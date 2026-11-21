import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  evaluateFigmaTimeline,
  type HeroCursorAnchors,
  type RectBox,
  type ScriptedPhase,
} from '../../utils/figmaCursorTimeline';

interface FigmaDesignerStageProps {
  heroRef: React.RefObject<HTMLElement | null>;
  roleTextRef: React.RefObject<HTMLElement | null>;
  sayHiBtnRef: React.RefObject<HTMLButtonElement | null>;
  polaroidCaptionRef: React.RefObject<HTMLElement | null>;
  onPolaroidSelectedChange: (selected: boolean) => void;
}

function measureRelativeRect(
  el: HTMLElement | null,
  containerRect: DOMRect,
): RectBox | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return null;
  return {
    left: r.left - containerRect.left,
    top: r.top - containerRect.top,
    width: r.width,
    height: r.height,
  };
}

/**
 * Scripted Figma-style designer cursor ("karke") running a continuous 3-step
 * sequence (highlight role -> brief 1s pause near Say hi -> double-click
 * Polaroid me_01.jpg) controlled via IntersectionObserver and live DOM bounds.
 */
export function FigmaDesignerStage({
  heroRef,
  roleTextRef,
  sayHiBtnRef,
  polaroidCaptionRef,
  onPolaroidSelectedChange,
}: FigmaDesignerStageProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isDesktopFinePointer, setIsDesktopFinePointer] = useState(false);

  const cursorWrapperRef = useRef<HTMLDivElement>(null);
  const cursorArrowRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  const roleHighlightRef = useRef<HTMLDivElement>(null);
  const roleDimsRef = useRef<HTMLSpanElement>(null);

  const anchorsRef = useRef<HeroCursorAnchors | null>(null);
  const isVisibleRef = useRef(true);
  const elapsedMsRef = useRef(0);
  const lastPolaroidSelectedRef = useRef(false);
  const callbackRef = useRef(onPolaroidSelectedChange);
  callbackRef.current = onPolaroidSelectedChange;

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setIsDesktopFinePointer(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (prefersReducedMotion || !isDesktopFinePointer || !heroEl) {
      if (lastPolaroidSelectedRef.current) {
        lastPolaroidSelectedRef.current = false;
        callbackRef.current(false);
      }
      return;
    }

    let rafId: number | null = null;
    let lastTimestamp: number | null = null;

    const recalcAnchors = () => {
      const containerRect = heroEl.getBoundingClientRect();
      const roleRect = measureRelativeRect(roleTextRef.current, containerRect);
      const sayHiRect = measureRelativeRect(sayHiBtnRef.current, containerRect);
      const polaroidCaptionRect = measureRelativeRect(
        polaroidCaptionRef.current,
        containerRect,
      );

      if (!roleRect || !sayHiRect || !polaroidCaptionRect) {
        return;
      }

      anchorsRef.current = {
        roleRect,
        sayHiRect,
        polaroidCaptionRect,
        containerWidth: containerRect.width,
        containerHeight: containerRect.height,
      };
    };

    const renderFrame = (elapsedMs: number) => {
      const anchors = anchorsRef.current;
      if (!anchors) return;

      const frame = evaluateFigmaTimeline(elapsedMs, anchors);

      // 1. Update scripted "karke" cursor position & click press feedback
      if (cursorWrapperRef.current) {
        cursorWrapperRef.current.style.opacity = '1';
        cursorWrapperRef.current.style.transform = `translate3d(${frame.cursor.x.toFixed(2)}px, ${frame.cursor.y.toFixed(2)}px, 0)`;
        cursorWrapperRef.current.dataset.phase = frame.phase;
        cursorWrapperRef.current.dataset.clickPulse = String(frame.clickPulseId);
      }

      if (cursorArrowRef.current) {
        cursorArrowRef.current.style.transform = frame.isPressing
          ? 'scale(0.91)'
          : 'scale(1)';
      }

      if (rippleRef.current) {
        if (frame.clickRippleProgress !== null) {
          const p = frame.clickRippleProgress;
          const scale = 0.45 + p * 1.45;
          const opacity = Math.max(0, (1 - p) * 0.65);
          rippleRef.current.style.opacity = opacity.toFixed(3);
          rippleRef.current.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        } else {
          rippleRef.current.style.opacity = '0';
        }
      }

      // 2. Step 1: Progressive Figma Text-layer selection highlight matching text bounds
      if (roleHighlightRef.current) {
        const { roleRect } = anchors;
        const padX = 4;
        const padY = 3;
        const fullWidth = roleRect.width + padX * 2;
        const fullHeight = roleRect.height + padY * 2;
        const currentWidth = Math.max(0, fullWidth * frame.roleHighlightProgress);

        roleHighlightRef.current.style.left = `${(roleRect.left - padX).toFixed(1)}px`;
        roleHighlightRef.current.style.top = `${(roleRect.top - padY).toFixed(1)}px`;
        roleHighlightRef.current.style.width = `${currentWidth.toFixed(1)}px`;
        roleHighlightRef.current.style.height = `${fullHeight.toFixed(1)}px`;
        roleHighlightRef.current.style.opacity = frame.roleHighlightOpacity.toFixed(3);

        if (roleDimsRef.current) {
          const w = Math.round(currentWidth);
          const h = Math.round(fullHeight);
          roleDimsRef.current.textContent = `${w} × ${h}`;
          roleDimsRef.current.style.opacity =
            frame.roleHighlightProgress > 0.32 ? '1' : '0';
        }
      }

      // 3. Step 3: Figma image-layer selection state on Polaroid photograph
      if (frame.polaroidSelected !== lastPolaroidSelectedRef.current) {
        lastPolaroidSelectedRef.current = frame.polaroidSelected;
        callbackRef.current(frame.polaroidSelected);
      }
    };

    const stopLoop = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      lastTimestamp = null;
    };

    let lastMeasuredPhase: ScriptedPhase | null = null;

    const startLoop = () => {
      if (rafId !== null || !isVisibleRef.current) return;
      recalcAnchors();

      const tick = (now: number) => {
        if (!isVisibleRef.current) {
          stopLoop();
          return;
        }
        if (lastTimestamp !== null) {
          const dt = Math.min(64, Math.max(0, now - lastTimestamp));
          elapsedMsRef.current += dt;
        }
        lastTimestamp = now;

        if (!anchorsRef.current) {
          recalcAnchors();
        }
        const anchors = anchorsRef.current;
        if (anchors) {
          const previewPhase = evaluateFigmaTimeline(
            elapsedMsRef.current,
            anchors,
          ).phase;
          if (
            previewPhase !== lastMeasuredPhase &&
            (previewPhase === 'intro-move' ||
              previewPhase === 'step1-drag' ||
              previewPhase === 'move-to-sayhi' ||
              previewPhase === 'step2-hover' ||
              previewPhase === 'move-to-polaroid' ||
              previewPhase === 'step3-click1')
          ) {
            lastMeasuredPhase = previewPhase;
            recalcAnchors();
          }
        }
        renderFrame(elapsedMsRef.current);

        rafId = window.requestAnimationFrame(tick);
      };

      rafId = window.requestAnimationFrame(tick);
    };

    const initTimer = window.setTimeout(() => {
      recalcAnchors();
      if (isVisibleRef.current) {
        startLoop();
      }
    }, 900);

    const settleTimer = window.setTimeout(() => {
      recalcAnchors();
    }, 1360);

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        recalcAnchors();
      });
    }

    const resizeObserver = new ResizeObserver(() => {
      recalcAnchors();
    });
    resizeObserver.observe(heroEl);
    if (roleTextRef.current) resizeObserver.observe(roleTextRef.current);
    if (sayHiBtnRef.current) resizeObserver.observe(sayHiBtnRef.current);
    if (polaroidCaptionRef.current) resizeObserver.observe(polaroidCaptionRef.current);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const visible = Boolean(entry?.isIntersecting);
        isVisibleRef.current = visible;
        if (visible) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.45 },
    );
    intersectionObserver.observe(heroEl);

    const handleWindowResize = () => recalcAnchors();
    window.addEventListener('resize', handleWindowResize, { passive: true });

    return () => {
      window.clearTimeout(initTimer);
      window.clearTimeout(settleTimer);
      stopLoop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      if (lastPolaroidSelectedRef.current) {
        lastPolaroidSelectedRef.current = false;
        callbackRef.current(false);
      }
    };
  }, [
    heroRef,
    isDesktopFinePointer,
    polaroidCaptionRef,
    prefersReducedMotion,
    roleTextRef,
    sayHiBtnRef,
  ]);

  if (prefersReducedMotion || !isDesktopFinePointer) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      data-testid="figma-designer-stage"
      className="pointer-events-none select-none absolute inset-0 z-20 overflow-hidden"
    >
      {/* Step 1: Authentic Figma Text-Layer Selection Frame */}
      <div
        ref={roleHighlightRef}
        data-testid="figma-role-selection"
        style={{ opacity: 0, width: 0, height: 0 }}
        className="absolute rounded-none border-[1.5px] border-[#0D99FF] bg-[#0D99FF]/[0.12] will-change-[width,opacity]"
      >
        {/* Top-left Figma layer name label */}
        <span className="absolute -top-[18px] -left-[1.5px] inline-flex items-center gap-1 rounded-t-[2px] bg-[#0D99FF] px-1.5 py-[1px] text-[10px] font-medium leading-[14px] tracking-[0.01em] text-white whitespace-nowrap">
          Text
        </span>

        {/* 4 Crisp Figma corner resize handles */}
        <span className="absolute -top-[3.5px] -left-[3.5px] h-[6.5px] w-[6.5px] rounded-[0.5px] border-[1.5px] border-[#0D99FF] bg-white" />
        <span className="absolute -top-[3.5px] -right-[3.5px] h-[6.5px] w-[6.5px] rounded-[0.5px] border-[1.5px] border-[#0D99FF] bg-white" />
        <span className="absolute -bottom-[3.5px] -left-[3.5px] h-[6.5px] w-[6.5px] rounded-[0.5px] border-[1.5px] border-[#0D99FF] bg-white" />
        <span className="absolute -bottom-[3.5px] -right-[3.5px] h-[6.5px] w-[6.5px] rounded-[0.5px] border-[1.5px] border-[#0D99FF] bg-white" />

        {/* Live Figma W × H dimensions pill centered below selection */}
        <span
          ref={roleDimsRef}
          data-testid="figma-role-dims"
          style={{ opacity: 0 }}
          className="absolute -bottom-[21px] left-1/2 -translate-x-1/2 inline-flex items-center rounded-[3px] bg-[#0D99FF] px-1.5 py-[1px] text-[9.5px] font-medium leading-[14px] tabular-nums tracking-[0.01em] text-white whitespace-nowrap transition-opacity duration-150"
        >
          0 × 0
        </span>
      </div>

      {/* Cursor A: Authentic Figma Multiplayer Designer Cursor ("karke") */}
      <div
        ref={cursorWrapperRef}
        data-testid="karke-cursor"
        data-phase="intro-move"
        data-click-pulse="0"
        style={{ opacity: 0, transform: 'translate3d(0px, 0px, 0)' }}
        className="absolute left-0 top-0 z-30 will-change-transform transition-opacity duration-300"
      >
        {/* Subtle concentric click ripple centered on pointer tip */}
        <span
          ref={rippleRef}
          style={{ opacity: 0 }}
          className="absolute left-[1.5px] top-[1.5px] h-6 w-6 rounded-full border-[1.5px] border-[#0D99FF] bg-[#0D99FF]/10 will-change-transform"
        />

        <div
          ref={cursorArrowRef}
          className="origin-top-left transition-transform duration-100 ease-out"
        >
          <svg
            width="17"
            height="19"
            viewBox="0 0 17 19"
            fill="none"
            className="block drop-shadow-[0_1.5px_2.5px_rgba(0,0,0,0.24)]"
          >
            <path
              d="M1.2 1.2L15.4 9.2L8.9 10.9L6.1 17.4L1.2 1.2Z"
              fill="#0D99FF"
              stroke="#FFFFFF"
              strokeWidth="1.35"
              strokeLinejoin="round"
            />
          </svg>

          <span className="ml-[11px] -mt-[2px] inline-flex items-center rounded-[2px] rounded-tr-[6px] rounded-br-[6px] rounded-bl-[6px] bg-[#0D99FF] px-2 py-[2px] text-[11px] font-medium leading-[15px] tracking-[0.005em] text-white shadow-[0_2px_6px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.1)]">
            karke
          </span>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface VisitorCursorProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

/**
 * Independent Cursor B ("you") following the real visitor's mouse inside
 * the hero viewport. Desktop fine-pointer only; completely decoupled from
 * the scripted "karke" cursor and never intercepts real clicks or scrolling.
 */
export function VisitorCursor({ containerRef }: VisitorCursorProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  const visibleRef = useRef(false);
  const initializedRef = useRef(false);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!enabled || !container) return;

    const applyDom = () => {
      const el = cursorRef.current;
      if (!el) return;
      el.style.transform = `translate3d(${currentRef.current.x.toFixed(1)}px, ${currentRef.current.y.toFixed(1)}px, 0)`;
      el.style.opacity = visibleRef.current ? '1' : '0';
      el.dataset.visible = visibleRef.current ? 'true' : 'false';
    };

    const stopLoop = () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const startLoop = () => {
      if (rafRef.current !== null) return;
      const tick = () => {
        const dx = targetRef.current.x - currentRef.current.x;
        const dy = targetRef.current.y - currentRef.current.y;
        const factor = prefersReducedMotion ? 1 : 0.28;

        currentRef.current.x += dx * factor;
        currentRef.current.y += dy * factor;
        applyDom();

        if (Math.hypot(targetRef.current.x - currentRef.current.x, targetRef.current.y - currentRef.current.y) < 0.3) {
          currentRef.current.x = targetRef.current.x;
          currentRef.current.y = targetRef.current.y;
          applyDom();
          rafRef.current = null;
          return;
        }

        rafRef.current = window.requestAnimationFrame(tick);
      };
      rafRef.current = window.requestAnimationFrame(tick);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        visibleRef.current = false;
        applyDom();
        return;
      }

      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      targetRef.current = { x, y };
      if (!initializedRef.current || !visibleRef.current) {
        currentRef.current = { x, y };
        initializedRef.current = true;
      }
      visibleRef.current = true;
      applyDom();
      startLoop();
    };

    const handlePointerLeave = () => {
      visibleRef.current = false;
      applyDom();
      stopLoop();
    };

    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      stopLoop();
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [containerRef, enabled, prefersReducedMotion]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      data-testid="visitor-cursor"
      data-visible="false"
      style={{ opacity: 0, transform: 'translate3d(0px, 0px, 0)' }}
      className="pointer-events-none select-none absolute left-0 top-0 z-30 will-change-transform transition-opacity duration-200"
    >
      {/* Subtle, smaller Figma multiplayer pointer for the visitor ("you") */}
      <svg
        width="14"
        height="16"
        viewBox="0 0 17 19"
        fill="none"
        className="block drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.2)]"
      >
        <path
          d="M1.2 1.2L15.4 9.2L8.9 10.9L6.1 17.4L1.2 1.2Z"
          fill="#7C3AED"
          stroke="#FFFFFF"
          strokeWidth="1.35"
          strokeLinejoin="round"
        />
      </svg>
      <span className="ml-[9px] -mt-[2px] inline-flex items-center rounded-[2px] rounded-tr-[5px] rounded-br-[5px] rounded-bl-[5px] bg-[#7C3AED] px-[7px] py-[1.5px] text-[10px] font-medium leading-[14px] tracking-[0.005em] text-white shadow-[0_2px_5px_rgba(0,0,0,0.16),0_1px_1.5px_rgba(0,0,0,0.08)]">
        you
      </span>
    </div>
  );
}

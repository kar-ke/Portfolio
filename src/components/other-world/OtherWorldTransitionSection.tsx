import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ChevronsDown } from 'lucide-react';
import { OTHER_WORLD_COPY, OTHER_WORLD_STAMPS } from '../../config/hobbies';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import type { ScrollProgressListener } from '../../hooks/useSmoothScroll';
import {
  computeDeskViewBox,
  computeFixedDeskMaxScale,
  computeRunwayProgress,
  computeSequentialStampIndex,
  evaluateOtherWorldFrame,
  OTHER_WORLD_TIMELINE,
} from '../../utils/otherWorldTimeline';
import { OtherWorldDeskSvg } from './OtherWorldDeskSvg';
import { OtherWorldHobbies } from './OtherWorldHobbies';

interface OtherWorldTransitionSectionProps {
  subscribeScrollProgress: (listener: ScrollProgressListener) => () => void;
  onModalOpenChange?: (open: boolean) => void;
}

/**
 * Sticky scroll-driven portal from Selected Work into Personal Hobbies.
 * Zooms smoothly into the centered tilted stamp while cycling provided stamps
 * sequentially (01 -> 02 -> 03) on loop until zoom completes, then dissolves into hobbies.
 */
export const OtherWorldTransitionSection = memo(function OtherWorldTransitionSection({
  subscribeScrollProgress,
  onModalOpenChange,
}: OtherWorldTransitionSectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [compactLayout, setCompactLayout] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  );

  const runwayRef = useRef<HTMLElement | null>(null);
  const deskStageRef = useRef<HTMLDivElement | null>(null);
  const deskSvgRef = useRef<SVGSVGElement | null>(null);
  const sceneTextRef = useRef<SVGGElement | null>(null);
  const stampGroupRef = useRef<SVGGElement | null>(null);
  const stampImageRefs = useRef<(SVGImageElement | null)[]>([]);
  const scrollCueRef = useRef<HTMLDivElement | null>(null);
  const hobbiesLayerRef = useRef<HTMLDivElement | null>(null);

  const activeStampIndexRef = useRef<number>(0);
  const lastProgressRef = useRef<number>(-1);
  const viewportRef = useRef<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  });

  const setVisibleStampImage = useCallback((nextIdx: number) => {
    activeStampIndexRef.current = nextIdx;
    stampImageRefs.current.forEach((imgEl, idx) => {
      if (imgEl) {
        imgEl.style.opacity = idx === nextIdx ? '1' : '0';
      }
    });
    if (stampGroupRef.current) {
      stampGroupRef.current.setAttribute('data-active-stamp-index', String(nextIdx));
    }
  }, []);

  const applyFrameFromDom = useCallback(
    (force = false) => {
      if (prefersReducedMotion) return;
      const runwayEl = runwayRef.current;
      if (!runwayEl) return;

      const { width: vw, height: vh } = viewportRef.current;
      const rect = runwayEl.getBoundingClientRect();
      const progress = computeRunwayProgress(rect.top, rect.height, vh);

      // Skip duplicate DOM mutations when both smooth-scroll rAF and native scroll fire in one frame
      if (!force && Math.abs(progress - lastProgressRef.current) < 0.0001) {
        return;
      }
      lastProgressRef.current = progress;

      const fixedMaxScale = computeFixedDeskMaxScale(vw, vh);
      const frame = evaluateOtherWorldFrame(progress, fixedMaxScale, false);

      if (sceneTextRef.current) {
        sceneTextRef.current.style.opacity = String(frame.textOpacity);
      }
      if (scrollCueRef.current) {
        scrollCueRef.current.style.opacity = String(frame.cueOpacity);
      }

      if (deskSvgRef.current) {
        const box = computeDeskViewBox(vw, vh, frame.zoomProgress);
        deskSvgRef.current.setAttribute(
          'viewBox',
          `${box.x.toFixed(2)} ${box.y.toFixed(2)} ${box.width.toFixed(2)} ${box.height.toFixed(2)}`,
        );
        deskSvgRef.current.style.opacity = String(frame.deskOpacity);
      }

      // Cycle stamps sequentially (01 -> 02 -> 03) on loop until zoom completes at zoomEnd
      const nextStampIdx = computeSequentialStampIndex(progress, OTHER_WORLD_STAMPS.length);
      if (nextStampIdx !== activeStampIndexRef.current) {
        setVisibleStampImage(nextStampIdx);
      }

      if (deskStageRef.current) {
        deskStageRef.current.style.visibility =
          frame.deskOpacity <= 0.002 && frame.textOpacity <= 0.002 ? 'hidden' : 'visible';
      }

      if (hobbiesLayerRef.current) {
        hobbiesLayerRef.current.style.opacity = String(frame.hobbiesOpacity);
        hobbiesLayerRef.current.style.transform = `translate3d(0, ${frame.hobbiesTranslateY.toFixed(2)}px, 0)`;
        hobbiesLayerRef.current.style.pointerEvents = frame.hobbiesInteractive ? 'auto' : 'none';
        hobbiesLayerRef.current.setAttribute(
          'aria-hidden',
          frame.hobbiesInteractive ? 'false' : 'true',
        );
      }
    },
    [prefersReducedMotion, setVisibleStampImage],
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    viewportRef.current = { width: window.innerWidth, height: window.innerHeight };
    applyFrameFromDom(true);

    const unsubscribe = subscribeScrollProgress(() => {
      applyFrameFromDom(false);
    });

    const handleNativeScroll = () => {
      applyFrameFromDom(false);
    };

    const handleResize = () => {
      viewportRef.current = { width: window.innerWidth, height: window.innerHeight };
      setCompactLayout(window.innerWidth < 768);
      applyFrameFromDom(true);
    };

    window.addEventListener('scroll', handleNativeScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleNativeScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [applyFrameFromDom, prefersReducedMotion, subscribeScrollProgress]);

  useEffect(() => {
    if (!prefersReducedMotion) {
      applyFrameFromDom(true);
    }
  }, [compactLayout, applyFrameFromDom, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <section
        id="other-world"
        aria-label="Welcome to my other world"
        data-testid="other-world-section"
        className="relative w-full py-20 sm:py-24 bg-[#FCFCFB]"
      >
        <div className="w-full max-w-[1140px] mx-auto px-6 sm:px-10 lg:px-12 flex flex-col items-center">
          <div className="w-full max-w-[960px]">
            <OtherWorldDeskSvg
              showSceneText
              compactLayout={compactLayout}
              viewBox={compactLayout ? '0 -120 360 415' : '-345 0 1050 250'}
              className="w-full h-auto block"
            />
          </div>
          <div className="mt-20 w-full">
            <OtherWorldHobbies onModalOpenChange={onModalOpenChange} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={runwayRef}
      id="other-world"
      aria-label="Welcome to my other world"
      data-testid="other-world-section"
      style={{
        height: `clamp(${OTHER_WORLD_TIMELINE.mobileRunwayVh}svh, 340svh, ${OTHER_WORLD_TIMELINE.desktopRunwayVh}svh)`,
      }}
      className="relative w-full bg-[#FCFCFB]"
    >
      <div className="sr-only">
        <h2>
          {OTHER_WORLD_COPY.leftLine1} {OTHER_WORLD_COPY.rightLine1} {OTHER_WORLD_COPY.leftLine2}{' '}
          {OTHER_WORLD_COPY.rightLine2}
        </h2>
        <p>
          {OTHER_WORLD_COPY.leftSubtitle} {OTHER_WORLD_COPY.rightSubtitle}
        </p>
      </div>

      <div
        data-testid="other-world-sticky-stage"
        className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center bg-[#FCFCFB]"
      >
        <div
          ref={deskStageRef}
          data-testid="other-world-desk-stage"
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
        >
          <OtherWorldDeskSvg
            svgRef={deskSvgRef}
            sceneTextRef={sceneTextRef}
            stampGroupRef={stampGroupRef}
            stampImageRefs={stampImageRefs}
            showSceneText
            compactLayout={compactLayout}
            className="absolute inset-0 w-full h-full block"
          />

          <div
            ref={scrollCueRef}
            data-testid="other-world-scroll-cue"
            className="absolute bottom-8 sm:bottom-10 inset-x-0 flex items-center justify-center gap-1.5 text-[12px] sm:text-[12.5px] font-medium tracking-[0.02em] text-[#6E6E73] will-change-opacity"
          >
            <span>{OTHER_WORLD_COPY.scrollCue}</span>
            <ChevronsDown
              className="w-3.5 h-3.5 text-[#1D1D1F]"
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
        </div>

        <div
          ref={hobbiesLayerRef}
          data-testid="other-world-hobbies-layer"
          aria-hidden="true"
          style={{ opacity: 0, pointerEvents: 'none', transform: 'translate3d(0, 20px, 0)' }}
          className="relative z-10 w-full flex items-center justify-center pt-14 sm:pt-16 pb-6 will-change-[transform,opacity]"
        >
          <OtherWorldHobbies onModalOpenChange={onModalOpenChange} />
        </div>
      </div>
    </section>
  );
});

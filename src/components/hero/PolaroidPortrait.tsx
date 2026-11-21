import { useCallback, useEffect, useRef, useState } from 'react';
import { HERO_PORTRAIT_ALT, HERO_PORTRAIT_SRC } from '../../config/portfolio';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  computePolaroidTransform,
  isPolaroidSettled,
  lerpPolaroidTransform,
  POLAROID_DEFAULTS,
  type PolaroidTransform,
} from '../../utils/polaroidPhysics';

interface PolaroidPortraitProps {
  src?: string;
  alt?: string;
  caption?: string;
  captionRef?: React.RefObject<HTMLElement | null>;
  isLayerSelected?: boolean;
}

const INITIAL_TRANSFORM: PolaroidTransform = computePolaroidTransform(false, 0, 0, false);

export function PolaroidPortrait({
  src = HERO_PORTRAIT_SRC,
  alt = HERO_PORTRAIT_ALT,
  caption = 'me_01.jpg',
  captionRef,
  isLayerSelected = false,
}: PolaroidPortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const currentRef = useRef<PolaroidTransform>(INITIAL_TRANSFORM);
  const targetRef = useRef<PolaroidTransform>(INITIAL_TRANSFORM);
  const rafRef = useRef<number | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const applyTransformToDom = useCallback((t: PolaroidTransform) => {
    if (frameRef.current) {
      frameRef.current.style.transform = `translate3d(${t.frameOffsetX.toFixed(2)}px, ${(t.frameOffsetY + t.translateY).toFixed(2)}px, 0) rotate(${t.rotateZ}deg) scale(${t.scale.toFixed(4)})`;
    }
    if (imageRef.current) {
      imageRef.current.style.transform = `translate3d(${t.imageOffsetX.toFixed(2)}px, ${t.imageOffsetY.toFixed(2)}px, 0) scale(1.055)`;
    }
  }, []);

  const startSmoothLoop = useCallback(() => {
    if (rafRef.current !== null) return;

    const tick = () => {
      const next = lerpPolaroidTransform(currentRef.current, targetRef.current, 0.11);
      currentRef.current = next;
      applyTransformToDom(next);

      if (isPolaroidSettled(next, targetRef.current)) {
        currentRef.current = targetRef.current;
        applyTransformToDom(targetRef.current);
        rafRef.current = null;
        return;
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
  }, [applyTransformToDom]);

  useEffect(() => {
    applyTransformToDom(currentRef.current);
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [applyTransformToDom]);

  const isFinePointer = useCallback(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return true;
    }
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }, []);

  const updateTarget = useCallback(
    (hovered: boolean, nx: number, ny: number) => {
      targetRef.current = computePolaroidTransform(
        hovered,
        nx,
        ny,
        prefersReducedMotion,
      );
      if (prefersReducedMotion) {
        currentRef.current = targetRef.current;
        applyTransformToDom(targetRef.current);
      } else {
        startSmoothLoop();
      }
    },
    [applyTransformToDom, prefersReducedMotion, startSmoothLoop],
  );

  const handlePointerEnter = () => {
    if (!isFinePointer()) return;
    setIsHovered(true);
    updateTarget(true, 0, 0);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isFinePointer() || prefersReducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;

    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    updateTarget(true, nx, ny);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    updateTarget(false, 0, 0);
  };

  return (
    <div
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex items-center justify-center py-4 px-3"
    >
      <figure
        ref={frameRef}
        data-testid="polaroid-frame"
        data-active={isHovered ? 'true' : 'false'}
        data-layer-selected={isLayerSelected ? 'true' : 'false'}
        data-rotation={String(POLAROID_DEFAULTS.restingRotationDeg)}
        style={{
          transform: `translate3d(0px, 0px, 0) rotate(${POLAROID_DEFAULTS.restingRotationDeg}deg) scale(1)`,
        }}
        className={[
          'group relative block w-full max-w-[252px] sm:max-w-[288px] lg:max-w-[314px]',
          'bg-white rounded-[3px] p-3 pb-11 sm:p-4 sm:pb-[52px]',
          'ring-1 ring-black/[0.045] will-change-transform',
          'transition-shadow duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isHovered
            ? 'shadow-[0_34px_70px_-24px_rgba(17,17,17,0.2),0_12px_26px_-8px_rgba(17,17,17,0.08)]'
            : 'shadow-[0_24px_56px_-20px_rgba(17,17,17,0.14),0_8px_18px_-6px_rgba(17,17,17,0.06)]',
        ].join(' ')}
      >
        {/* Subtle Figma Image-Layer Selection Outline triggered by Step 3 double-click */}
        <div
          aria-hidden="true"
          data-testid="polaroid-figma-selection"
          className={[
            'pointer-events-none absolute -inset-[2px] rounded-[4px] border-[1.5px] border-[#0D99FF] transition-opacity duration-200',
            isLayerSelected ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        >
          <span className="absolute -top-[21px] -left-[1.5px] inline-flex items-center rounded-t-[4px] bg-[#0D99FF] px-1.5 py-[1px] text-[10px] font-semibold leading-[16px] tracking-[0.01em] text-white whitespace-nowrap">
            {caption}
          </span>
          <span className="absolute -top-[4px] -left-[4px] h-[7px] w-[7px] rounded-[1px] border-[1.5px] border-[#0D99FF] bg-white" />
          <span className="absolute -top-[4px] -right-[4px] h-[7px] w-[7px] rounded-[1px] border-[1.5px] border-[#0D99FF] bg-white" />
          <span className="absolute -bottom-[4px] -left-[4px] h-[7px] w-[7px] rounded-[1px] border-[1.5px] border-[#0D99FF] bg-white" />
          <span className="absolute -bottom-[4px] -right-[4px] h-[7px] w-[7px] rounded-[1px] border-[1.5px] border-[#0D99FF] bg-white" />
        </div>

        <div className="relative aspect-[10/10.6] w-full overflow-hidden rounded-[2px] bg-[#ECEAE4] ring-1 ring-black/[0.05]">
          {!imageError ? (
            <img
              ref={imageRef}
              src={src}
              alt={alt}
              referrerPolicy="no-referrer"
              loading="eager"
              decoding="async"
              onError={() => setImageError(true)}
              style={{
                transform: 'translate3d(0px, 0px, 0) scale(1.055)',
              }}
              className="h-full w-full object-cover object-[50%_30%] select-none pointer-events-none will-change-transform"
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center bg-[#F0EEE9] px-6 text-center">
              <span className="text-[28px] font-semibold tracking-[-0.03em] text-[#111111]/70">
                K.
              </span>
              <span className="mt-2 text-[13px] text-[#6E6E73]">
                Portrait placeholder
              </span>
            </div>
          )}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/[0.03] via-transparent to-white/[0.08] opacity-60 transition-opacity duration-500 group-hover:opacity-90"
          />
        </div>

        <figcaption
          style={{ fontFamily: 'var(--font-handwriting)' }}
          className="absolute inset-x-0 bottom-2.5 sm:bottom-3.5 flex justify-center text-[18px] sm:text-[20px] leading-none tracking-[0.01em] text-[#2C2C2E]/85 select-none pointer-events-none"
        >
          <span ref={captionRef} className="inline-block">
            {caption}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}

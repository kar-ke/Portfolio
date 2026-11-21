import { useCallback, useEffect, useMemo, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import {
  computeSmoothNavbarProgressStep,
  computeSmoothScrollStep,
  computeSyncedNavbarProgress,
  SMOOTH_SCROLL_CONFIG,
  SYNCED_NAVBAR_CONFIG,
} from '../utils/navbarState';

export type ScrollProgressListener = (progress: number, scrollY: number) => void;

export interface SmoothScrollController {
  readonly scrollToY: (targetY: number) => void;
  readonly subscribe: (listener: ScrollProgressListener) => () => void;
}

function getMaxScrollY(): number {
  if (typeof document === 'undefined' || typeof window === 'undefined') return 0;
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

function normalizeWheelDeltaY(event: WheelEvent): number {
  if (event.deltaMode === 1) {
    return event.deltaY * 32;
  }
  if (event.deltaMode === 2) {
    return event.deltaY * window.innerHeight;
  }
  return event.deltaY;
}

/**
 * Unhurried, frame-rate-independent inertial smooth scroll controller with
 * secondary damped navbar shrink synchronization inside one unified rAF loop.
 */
export function useSmoothScroll(disabled = false): SmoothScrollController {
  const prefersReducedMotion = usePrefersReducedMotion();
  const listenersRef = useRef<Set<ScrollProgressListener>>(new Set());

  const currentYRef = useRef(0);
  const targetYRef = useRef(0);
  const prevYRef = useRef(0);
  const targetProgressRef = useRef(0);
  const visualProgressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const isProgrammaticScrollRef = useRef(false);

  const notifyListeners = useCallback((visualProgress: number, scrollY: number) => {
    for (const listener of listenersRef.current) {
      listener(visualProgress, scrollY);
    }
  }, []);

  const stopLoop = useCallback(() => {
    if (rafIdRef.current !== null) {
      window.cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    lastFrameTimeRef.current = null;
  }, []);

  const startLoop = useCallback(() => {
    if (rafIdRef.current !== null) return;

    const step = (now: number) => {
      const dt = lastFrameTimeRef.current === null ? 16.667 : now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      const maxY = getMaxScrollY();
      targetYRef.current = Math.max(0, Math.min(maxY, targetYRef.current));

      const scrollStep = computeSmoothScrollStep(
        currentYRef.current,
        targetYRef.current,
        dt,
        SMOOTH_SCROLL_CONFIG,
      );

      if (scrollStep.nextY !== currentYRef.current) {
        currentYRef.current = scrollStep.nextY;
        isProgrammaticScrollRef.current = true;
        window.scrollTo(0, scrollStep.nextY);
        isProgrammaticScrollRef.current = false;
      }

      // Update continuous target navbar progress from smooth scroll movement
      targetProgressRef.current = computeSyncedNavbarProgress(
        targetProgressRef.current,
        currentYRef.current,
        prevYRef.current,
        SYNCED_NAVBAR_CONFIG,
      );
      prevYRef.current = currentYRef.current;

      // Secondary slower damped glide for the navbar width itself
      const navStep = computeSmoothNavbarProgressStep(
        visualProgressRef.current,
        targetProgressRef.current,
        dt,
        SYNCED_NAVBAR_CONFIG,
      );
      visualProgressRef.current = navStep.nextProgress;

      notifyListeners(visualProgressRef.current, currentYRef.current);

      if (scrollStep.settled && navStep.settled) {
        stopLoop();
        return;
      }

      rafIdRef.current = window.requestAnimationFrame(step);
    };

    rafIdRef.current = window.requestAnimationFrame(step);
  }, [notifyListeners, stopLoop]);

  const scrollToY = useCallback(
    (rawTargetY: number) => {
      const maxY = getMaxScrollY();
      const clampedTarget = Math.max(0, Math.min(maxY, rawTargetY));

      if (prefersReducedMotion || disabled) {
        stopLoop();
        currentYRef.current = clampedTarget;
        targetYRef.current = clampedTarget;
        targetProgressRef.current = computeSyncedNavbarProgress(
          targetProgressRef.current,
          clampedTarget,
          prevYRef.current,
          SYNCED_NAVBAR_CONFIG,
        );
        prevYRef.current = clampedTarget;
        visualProgressRef.current = targetProgressRef.current;
        window.scrollTo(0, clampedTarget);
        notifyListeners(visualProgressRef.current, clampedTarget);
        return;
      }

      targetYRef.current = clampedTarget;
      startLoop();
    },
    [disabled, notifyListeners, prefersReducedMotion, startLoop, stopLoop],
  );

  const subscribe = useCallback((listener: ScrollProgressListener) => {
    listenersRef.current.add(listener);
    listener(visualProgressRef.current, currentYRef.current);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  useEffect(() => {
    const initialY = window.scrollY;
    currentYRef.current = initialY;
    targetYRef.current = initialY;
    prevYRef.current = initialY;
    targetProgressRef.current = computeSyncedNavbarProgress(
      0,
      initialY,
      initialY,
      SYNCED_NAVBAR_CONFIG,
    );
    visualProgressRef.current = targetProgressRef.current;
    notifyListeners(visualProgressRef.current, initialY);

    const handleWheel = (event: WheelEvent) => {
      if (disabled || prefersReducedMotion || event.ctrlKey || event.metaKey) {
        return;
      }

      const targetEl = event.target as HTMLElement | null;
      if (targetEl?.closest('[role="dialog"]')) {
        return;
      }

      const maxY = getMaxScrollY();
      if (maxY <= 0) return;

      event.preventDefault();
      const deltaY = normalizeWheelDeltaY(event) * SMOOTH_SCROLL_CONFIG.wheelMultiplier;
      targetYRef.current = Math.max(0, Math.min(maxY, targetYRef.current + deltaY));
      startLoop();
    };

    const handleNativeScroll = () => {
      if (isProgrammaticScrollRef.current) return;
      const nativeY = window.scrollY;

      if (rafIdRef.current === null) {
        currentYRef.current = nativeY;
        targetYRef.current = nativeY;
        targetProgressRef.current = computeSyncedNavbarProgress(
          targetProgressRef.current,
          nativeY,
          prevYRef.current,
          SYNCED_NAVBAR_CONFIG,
        );
        prevYRef.current = nativeY;

        if (prefersReducedMotion) {
          visualProgressRef.current = targetProgressRef.current;
          notifyListeners(visualProgressRef.current, nativeY);
        } else {
          // Even external scrollbar/touch scrolls get the silky damped navbar glide
          startLoop();
        }
      }
    };

    const handleResize = () => {
      const maxY = getMaxScrollY();
      targetYRef.current = Math.min(targetYRef.current, maxY);
      currentYRef.current = Math.min(currentYRef.current, maxY);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleNativeScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      stopLoop();
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleNativeScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [disabled, notifyListeners, prefersReducedMotion, startLoop, stopLoop]);

  return useMemo(() => ({ scrollToY, subscribe }), [scrollToY, subscribe]);
}

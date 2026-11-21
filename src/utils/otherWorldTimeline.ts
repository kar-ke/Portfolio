/**
 * Pure deterministic scroll-timeline evaluator for the
 * "Welcome to my other world" -> Desk Zoom -> Personal Hobbies transition.
 *
 * Frame choreography:
 *   0.00 -> 0.28 : Flanking titles, sub-captions & scroll cue drift outward and fade out fast.
 *   0.00 -> 0.70 : Vector SVG viewBox zooms smoothly & exponentially into the laptop screen center,
 *                  locking at the fixed target zoom where the laptop bezel frames the viewport.
 *   0.58 -> 0.74 : Inner laptop screen UI box & cursor arrow fade out so the screen clears cleanly.
 *   0.70 -> 0.94 : Zoom holds steady at fixed max scale while the outer laptop bezel dissolves (1 -> 0).
 *   0.72 -> 0.96 : "Beyond pixels and prototypes" hobbies section cross-fades cleanly into view.
 */

export interface DeskViewBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface OtherWorldFrameState {
  readonly progress: number;
  readonly textOpacity: number;
  readonly textSpreadPx: number;
  readonly cueOpacity: number;
  readonly zoomProgress: number;
  readonly deskScale: number;
  readonly screenContentOpacity: number;
  readonly deskOpacity: number;
  readonly deskStrokeWidthPx: number;
  readonly hobbiesOpacity: number;
  readonly hobbiesTranslateY: number;
  readonly hobbiesInteractive: boolean;
}

export const OTHER_WORLD_TIMELINE = {
  /** Scroll runway multiplier on desktop (generous runway slows zoom for silky feel) */
  desktopRunwayVh: 360,
  /** Streamlined scroll runway on mobile viewports */
  mobileRunwayVh: 290,
  /** Text & captions begin fading smoothly once zoom gets underway */
  textFadeStart: 0.02,
  /** Text & captions finish fading out right around halfway through the zoom (zoomEnd = 0.70) */
  textFadeEnd: 0.36,
  /** Scroll cue ("scroll to dive in") disappears immediately as zoom starts */
  cueFadeEnd: 0.12,
  /** Inner laptop screen elements (tilted stamp + pointer) clear right before hobbies enter */
  screenContentFadeStart: 0.62,
  screenContentFadeEnd: 0.75,
  /** Desk reaches its fixed target zoom by this progress and locks there */
  zoomEnd: 0.7,
  /** Desk bezel begins fading out right as fixed zoom settles */
  deskFadeStart: 0.7,
  deskFadeEnd: 0.94,
  /** Personal hobbies section cross-fades in inside the dissolving laptop frame */
  hobbiesFadeStart: 0.72,
  hobbiesFadeEnd: 0.96,
  /** Interactive pointer events enable once hobbies content is visibly readable */
  hobbiesInteractiveThreshold: 0.78,
  /** Scroll progress step interval triggering a fast random image swap inside the tilted stamp */
  stampShuffleStep: 0.022,
} as const;

export const DESK_SVG_METRICS = {
  fullWidth: 360,
  fullHeight: 250,
  deskCenterX: 180,
  deskCenterY: 125,
  laptopCenterX: 166,
  laptopCenterY: 88,
  laptopBezelWidth: 140,
  laptopBezelHeight: 88,
} as const;

export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function remap01(value: number, start: number, end: number): number {
  if (end <= start) return value >= end ? 1 : 0;
  return clamp01((value - start) / (end - start));
}

/**
 * Picks a random stamp image index guaranteed not to repeat currentIndex
 * (when count > 1) so every zoom step feels like a crisp rapid flip.
 */
export function pickNextRandomStampIndex(
  currentIndex: number,
  count: number,
  randomValue = Math.random(),
): number {
  if (count <= 1) return 0;
  const safeCurrent = ((Math.floor(currentIndex) % count) + count) % count;
  const offset = 1 + Math.floor(clamp01(randomValue * 0.999999) * (count - 1));
  return (safeCurrent + offset) % count;
}

/** Smooth cubic in-out easing for natural optical camera push */
export function easeInOutCubic(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/** Smooth cubic ease-out for settling into fixed zoom & cross-fading */
export function easeOutCubic(t: number): number {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
}

/** Smooth quadratic ease-out for fast early text fade-out */
export function easeOutQuad(t: number): number {
  const x = clamp01(t);
  return 1 - (1 - x) * (1 - x);
}

/**
 * Returns the desired resting pixel width of the desk illustration (+10% larger overall)
 * balanced for the unified desktop flanking lockup and compact mobile layout.
 */
export function getRestingDeskWidthPx(viewportWidth: number): number {
  if (viewportWidth >= 1280) return 374;
  if (viewportWidth >= 1024) return 330;
  if (viewportWidth >= 768) return 268;
  return 296;
}

/**
 * Computes the exact native SVG viewBox for any eased zoomProgress in [0, 1].
 * Uses exponential magnification so the zoom feels perceptually smooth and uniform,
 * while remaining 100% vector-sharp at viewport resolution (zero GPU bitmap blur).
 */
export function computeDeskViewBox(
  viewportWidth: number,
  viewportHeight: number,
  zoomProgress: number,
): DeskViewBox {
  const safeW = Math.max(320, viewportWidth);
  const safeH = Math.max(320, viewportHeight);
  const aspect = safeW / safeH;
  const restingDeskPx = getRestingDeskWidthPx(safeW);

  // Start viewBox: full desk renders at exact restingDeskPx centered in the viewport
  const startWidth = DESK_SVG_METRICS.fullWidth * (safeW / restingDeskPx);
  const startHeight = startWidth / aspect;

  // End viewBox (fixed max zoom): 140x88 laptop bezel frames ~88% width / ~84% height cleanly
  const endWidthForW = DESK_SVG_METRICS.laptopBezelWidth / 0.88;
  const endWidthForH = (DESK_SVG_METRICS.laptopBezelHeight / 0.84) * aspect;
  const endWidth = Math.max(endWidthForW, endWidthForH);

  // Exponential camera push for uniform perceived speed
  const z = clamp01(zoomProgress);
  const width = startWidth * Math.pow(endWidth / startWidth, z);
  const height = width / aspect;

  // Shift center linearly in zoom-space so laptop screen converges smoothly to exact dead-center
  const centerBlend = startWidth === endWidth ? 1 : (startWidth - width) / (startWidth - endWidth);
  const cx =
    DESK_SVG_METRICS.deskCenterX +
    (DESK_SVG_METRICS.laptopCenterX - DESK_SVG_METRICS.deskCenterX) * centerBlend;
  const cy =
    DESK_SVG_METRICS.deskCenterY +
    (DESK_SVG_METRICS.laptopCenterY - DESK_SVG_METRICS.deskCenterY) * centerBlend;

  return {
    x: cx - width / 2,
    y: cy - height / 2,
    width,
    height,
  };
}

/**
 * Computes the effective magnification ratio between start and fixed max zoom.
 */
export function computeFixedDeskMaxScale(
  viewportWidth: number,
  viewportHeight: number,
): number {
  const startBox = computeDeskViewBox(viewportWidth, viewportHeight, 0);
  const endBox = computeDeskViewBox(viewportWidth, viewportHeight, 1);
  return startBox.width / endBox.width;
}

/**
 * Computes normalized sticky runway progress [0, 1] from container top rect
 * and scrollable runway distance.
 */
export function computeRunwayProgress(
  runwayTopPx: number,
  runwayHeightPx: number,
  viewportHeightPx: number,
): number {
  const scrollableDistance = runwayHeightPx - viewportHeightPx;
  if (scrollableDistance <= 1) return 0;
  return clamp01(-runwayTopPx / scrollableDistance);
}

/**
 * Evaluates all visual transform & opacity properties for a given normalized
 * scroll progress in [0, 1].
 */
export function evaluateOtherWorldFrame(
  rawProgress: number,
  fixedMaxScale: number,
  prefersReducedMotion = false,
): OtherWorldFrameState {
  if (prefersReducedMotion) {
    return {
      progress: 1,
      textOpacity: 1,
      textSpreadPx: 0,
      cueOpacity: 0,
      zoomProgress: 0,
      deskScale: 1,
      screenContentOpacity: 1,
      deskOpacity: 1,
      deskStrokeWidthPx: 1.85,
      hobbiesOpacity: 1,
      hobbiesTranslateY: 0,
      hobbiesInteractive: true,
    };
  }

  const progress = clamp01(rawProgress);

  // 1. Fixed scene text stays locked to the desk (zero separate drift) and fades cleanly by halfway through zoom
  const textT = remap01(
    progress,
    OTHER_WORLD_TIMELINE.textFadeStart,
    OTHER_WORLD_TIMELINE.textFadeEnd,
  );
  const textOpacity = 1 - easeOutQuad(textT);
  const textSpreadPx = 0;

  // 2. Bottom "scroll to dive in" cue fades out right away
  const cueT = remap01(progress, 0, OTHER_WORLD_TIMELINE.cueFadeEnd);
  const cueOpacity = 1 - easeOutQuad(cueT);

  // 3. Smooth, deliberately paced zoom into the laptop screen until zoomEnd (0.70), then locked
  const zoomT = remap01(progress, 0, OTHER_WORLD_TIMELINE.zoomEnd);
  const zoomProgress = easeInOutCubic(zoomT);
  const deskScale = Math.pow(fixedMaxScale, zoomProgress);
  // Crisp vector stroke thickens subtly as the camera enters the laptop bezel (1.85px -> 3.1px)
  const deskStrokeWidthPx = 1.85 + zoomProgress * 1.25;

  // 4. Inner laptop screen details (rounded box + pointer) clear right before hobbies fade in
  const screenFadeT = remap01(
    progress,
    OTHER_WORLD_TIMELINE.screenContentFadeStart,
    OTHER_WORLD_TIMELINE.screenContentFadeEnd,
  );
  const screenContentOpacity = 1 - easeOutQuad(screenFadeT);

  // 5. Outer laptop bezel holds opacity 1 while zooming, then dissolves gently at fixed zoom (0.70 -> 0.94)
  const deskFadeT = remap01(
    progress,
    OTHER_WORLD_TIMELINE.deskFadeStart,
    OTHER_WORLD_TIMELINE.deskFadeEnd,
  );
  const deskOpacity = 1 - easeInOutCubic(deskFadeT);

  // 6. Personal hobbies section cross-fades cleanly into the dissolving laptop bezel (0.72 -> 0.96)
  const hobbiesT = remap01(
    progress,
    OTHER_WORLD_TIMELINE.hobbiesFadeStart,
    OTHER_WORLD_TIMELINE.hobbiesFadeEnd,
  );
  const easedHobbies = easeOutCubic(hobbiesT);
  const hobbiesOpacity = easedHobbies;
  const hobbiesTranslateY = (1 - easedHobbies) * 20;
  const hobbiesInteractive = progress >= OTHER_WORLD_TIMELINE.hobbiesInteractiveThreshold;

  return {
    progress,
    textOpacity,
    textSpreadPx,
    cueOpacity,
    zoomProgress,
    deskScale,
    screenContentOpacity,
    deskOpacity,
    deskStrokeWidthPx,
    hobbiesOpacity,
    hobbiesTranslateY,
    hobbiesInteractive,
  };
}

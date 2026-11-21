export interface SmoothScrollConfig {
  /** Base exponential damping per 16.67ms frame (lower = slower, silkier inertia). */
  readonly damping: number;
  /** Gentle wheel delta multiplier so flicks glide with poised, unhurried weight. */
  readonly wheelMultiplier: number;
  /** Settling threshold in pixels where rAF stops idling. */
  readonly epsilon: number;
}

export interface SyncedNavbarConfig {
  /** ScrollY (px) at/below which the navbar target always returns to expanded (0). */
  readonly topExpandedPx: number;
  /** Scroll travel distance (px) over which the navbar transitions 0 -> 1 or 1 -> 0. */
  readonly travelRangePx: number;
  /** Secondary exponential damping per 16.67ms frame for extra-smooth, slower navbar width glide. */
  readonly visualDamping: number;
  /** Settling threshold for visualProgress [0..1]. */
  readonly visualEpsilon: number;
}

export interface NavbarWidths {
  /** Compact width with adequate space to accommodate all nav elements cleanly. */
  readonly compactPx: number;
  /** Relaxed extra horizontal breathing room added in the default expanded state. */
  readonly relaxedExtraPx: number;
  /** Default expanded width (compactPx + relaxedExtraPx). */
  readonly expandedPx: number;
}

export const SMOOTH_SCROLL_CONFIG: SmoothScrollConfig = {
  damping: 0.048,
  wheelMultiplier: 0.85,
  epsilon: 0.2,
};

export const SYNCED_NAVBAR_CONFIG: SyncedNavbarConfig = {
  topExpandedPx: 6,
  travelRangePx: 320,
  visualDamping: 0.052,
  visualEpsilon: 0.001,
};

export const NAVBAR_WIDTHS: NavbarWidths = {
  compactPx: 668,
  relaxedExtraPx: 100,
  expandedPx: 768,
};

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

/**
 * Computes one frame-rate-independent inertial smooth scroll step.
 */
export function computeSmoothScrollStep(
  currentY: number,
  targetY: number,
  deltaMs = 16.667,
  config: SmoothScrollConfig = SMOOTH_SCROLL_CONFIG,
): { readonly nextY: number; readonly settled: boolean } {
  const diff = targetY - currentY;
  if (Math.abs(diff) <= config.epsilon) {
    return { nextY: targetY, settled: true };
  }

  const clampedDt = Math.max(1, Math.min(64, deltaMs));
  const factor = 1 - Math.pow(1 - config.damping, clampedDt / 16.667);
  const nextY = currentY + diff * factor;

  if (Math.abs(targetY - nextY) <= config.epsilon) {
    return { nextY: targetY, settled: true };
  }

  return { nextY, settled: false };
}

/**
 * Updates target navbar shrink progress [0 = expanded, 1 = compact]
 * from each smooth scroll position delta.
 * - Always returns 0 at the top of the page (<= topExpandedPx).
 * - Gradually increases toward 1 while scrolling down over travelRangePx.
 * - Gradually decreases toward 0 while scrolling up over travelRangePx.
 */
export function computeSyncedNavbarProgress(
  prevProgress: number,
  currentY: number,
  prevY: number,
  config: SyncedNavbarConfig = SYNCED_NAVBAR_CONFIG,
): number {
  const safeY = Number.isFinite(currentY) ? Math.max(0, currentY) : 0;
  if (safeY <= config.topExpandedPx) {
    return 0;
  }

  const safePrevY = Number.isFinite(prevY) ? Math.max(0, prevY) : 0;
  const deltaY = safeY - safePrevY;
  if (deltaY === 0) {
    return clamp01(prevProgress);
  }

  return clamp01(prevProgress + deltaY / config.travelRangePx);
}

/**
 * Applies secondary frame-rate-independent exponential damping so the navbar
 * width glides even more smoothly and unhurriedly behind smooth scroll motion.
 */
export function computeSmoothNavbarProgressStep(
  visualProgress: number,
  targetProgress: number,
  deltaMs = 16.667,
  config: SyncedNavbarConfig = SYNCED_NAVBAR_CONFIG,
): { readonly nextProgress: number; readonly settled: boolean } {
  const safeVisual = clamp01(visualProgress);
  const safeTarget = clamp01(targetProgress);
  const diff = safeTarget - safeVisual;

  if (Math.abs(diff) <= config.visualEpsilon) {
    return { nextProgress: safeTarget, settled: true };
  }

  const clampedDt = Math.max(1, Math.min(64, deltaMs));
  const factor = 1 - Math.pow(1 - config.visualDamping, clampedDt / 16.667);
  const nextProgress = clamp01(safeVisual + diff * factor);

  if (Math.abs(safeTarget - nextProgress) <= config.visualEpsilon) {
    return { nextProgress: safeTarget, settled: true };
  }

  return { nextProgress, settled: false };
}

/**
 * Smooth sine ease-in-out curve that feathers the start and end of navbar width
 * contraction and expansion to zero abrupt velocity.
 */
export function easeNavbarProgress(progress: number): number {
  const t = clamp01(progress);
  return 0.5 - 0.5 * Math.cos(Math.PI * t);
}

/**
 * Interpolates navbar width smoothly between expandedPx (+100px relaxed space)
 * and compactPx (adequate fit for all nav elements only).
 */
export function computeNavbarWidthPx(
  progress: number,
  widths: NavbarWidths = NAVBAR_WIDTHS,
): number {
  const eased = easeNavbarProgress(progress);
  return Number((widths.expandedPx - (widths.expandedPx - widths.compactPx) * eased).toFixed(2));
}

/**
 * Formats a Date into 24-hour Indian Standard Time (Asia/Kolkata) as "HH:MM".
 */
export function formatISTTime(date: Date): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  } catch {
    const utcMs = date.getTime() + date.getTimezoneOffset() * 60_000;
    const istDate = new Date(utcMs + 330 * 60_000);
    const hh = String(istDate.getHours()).padStart(2, '0');
    const mm = String(istDate.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }
}

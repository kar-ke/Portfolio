export interface RectBox {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

export interface Point2D {
  readonly x: number;
  readonly y: number;
}

export interface HeroCursorAnchors {
  readonly roleRect: RectBox;
  readonly sayHiRect: RectBox;
  readonly polaroidCaptionRect: RectBox;
  readonly containerWidth: number;
  readonly containerHeight: number;
}

export type ScriptedPhase =
  | 'intro-move'
  | 'step1-pre'
  | 'step1-drag'
  | 'step1-hold'
  | 'step1-release'
  | 'move-to-sayhi'
  | 'step2-hover'
  | 'move-to-polaroid'
  | 'step3-pre'
  | 'step3-click1'
  | 'step3-click2'
  | 'step3-hold'
  | 'step3-park'
  | 'loop-pause';

export interface TimelineSegment {
  readonly phase: ScriptedPhase;
  readonly durationMs: number;
}

/**
 * Sequential, non-overlapping timeline for the "karke" designer cursor:
 * - Step 1: Highlight role text ("Product & Visual Designer.")
 * - Step 2: Move smoothly near the "Say hi" button and pause for 1000ms (1s)
 * - Step 3: Double-click Polaroid me_01.jpg (190ms interval) to highlight frame
 */
export const TIMELINE_SEGMENTS: readonly TimelineSegment[] = [
  { phase: 'intro-move', durationMs: 920 },
  { phase: 'step1-pre', durationMs: 220 },
  { phase: 'step1-drag', durationMs: 1120 },
  { phase: 'step1-hold', durationMs: 1150 },
  { phase: 'step1-release', durationMs: 300 },
  { phase: 'move-to-sayhi', durationMs: 880 },
  { phase: 'step2-hover', durationMs: 1000 },
  { phase: 'move-to-polaroid', durationMs: 1020 },
  { phase: 'step3-pre', durationMs: 220 },
  { phase: 'step3-click1', durationMs: 190 },
  { phase: 'step3-click2', durationMs: 220 },
  { phase: 'step3-hold', durationMs: 1450 },
  { phase: 'step3-park', durationMs: 920 },
  { phase: 'loop-pause', durationMs: 720 },
] as const;

export const TOTAL_CYCLE_DURATION_MS = TIMELINE_SEGMENTS.reduce(
  (sum, seg) => sum + seg.durationMs,
  0,
);

export interface ScriptedFrameState {
  readonly phase: ScriptedPhase;
  readonly cursor: Point2D;
  readonly isPressing: boolean;
  /** 0..1 progress of the active click ripple (null when inactive). */
  readonly clickRippleProgress: number | null;
  /** Distinct click pulse index (1 or 2) during Step 3 double-click. */
  readonly clickPulseId: number;
  /** Step 1: 0..1 width progress of Figma text highlight. */
  readonly roleHighlightProgress: number;
  /** Step 1: 0..1 opacity of Figma text highlight. */
  readonly roleHighlightOpacity: number;
  /** Step 3: whether the Polaroid image layer is in its Figma-selected state. */
  readonly polaroidSelected: boolean;
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function easeInOutCubic(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function easeOutCubic(t: number): number {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
}

/**
 * Evaluates a gentle quadratic Bézier arc between two points with subtle
 * human-like curvature and micro-imperfection so movement feels organic.
 */
export function interpolateHumanArc(
  from: Point2D,
  to: Point2D,
  t: number,
  arcOffsetPx = 22,
): Point2D {
  const u = easeInOutCubic(t);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = -dy / dist;
  const ny = dx / dist;

  // Control point sits slightly off-center for an authentic mouse arc
  const cx = from.x + dx * 0.46 + nx * arcOffsetPx;
  const cy = from.y + dy * 0.46 + ny * arcOffsetPx;

  const inv = 1 - u;
  const x = inv * inv * from.x + 2 * inv * u * cx + u * u * to.x;
  const y = inv * inv * from.y + 2 * inv * u * cy + u * u * to.y;

  // Tiny organic hand micro-drift that fades to 0 at both endpoints
  const micro = Math.sin(u * Math.PI) * 1.4;
  return {
    x: x + micro * Math.sin(u * Math.PI * 2),
    y: y + micro * Math.cos(u * Math.PI * 2),
  };
}

/**
 * Computes the resting point right near the "Say hi" button where "karke"
 * briefly hovers for 1 second during Step 2.
 */
export function getSayHiHoverPoint(sayHiRect: RectBox): Point2D {
  return {
    x: sayHiRect.left + sayHiRect.width * 0.72,
    y: sayHiRect.top + sayHiRect.height + 6,
  };
}

export function getIdleParkPoint(anchors: HeroCursorAnchors): Point2D {
  return {
    x: Math.min(
      anchors.containerWidth - 96,
      anchors.roleRect.left + anchors.roleRect.width + 64,
    ),
    y: Math.max(88, anchors.roleRect.top - 42),
  };
}

/**
 * Resolves elapsed milliseconds within the looping timeline into the active
 * phase and its normalized [0, 1] local progress.
 */
export function resolveTimelinePhase(elapsedMs: number): {
  readonly phase: ScriptedPhase;
  readonly localProgress: number;
  readonly cycleMs: number;
} {
  const safeMs = Number.isFinite(elapsedMs) && elapsedMs >= 0 ? elapsedMs : 0;
  const cycleMs = safeMs % TOTAL_CYCLE_DURATION_MS;
  let cursor = 0;

  for (const segment of TIMELINE_SEGMENTS) {
    if (cycleMs < cursor + segment.durationMs) {
      return {
        phase: segment.phase,
        localProgress: clamp01((cycleMs - cursor) / segment.durationMs),
        cycleMs,
      };
    }
    cursor += segment.durationMs;
  }

  return {
    phase: TIMELINE_SEGMENTS[TIMELINE_SEGMENTS.length - 1].phase,
    localProgress: 1,
    cycleMs,
  };
}

/**
 * Pure frame evaluator for the entire 3-step scripted "karke" cursor animation.
 */
export function evaluateFigmaTimeline(
  elapsedMs: number,
  anchors: HeroCursorAnchors,
): ScriptedFrameState {
  const { phase, localProgress } = resolveTimelinePhase(elapsedMs);

  const idlePt = getIdleParkPoint(anchors);
  const roleStart: Point2D = {
    x: anchors.roleRect.left - 2,
    y: anchors.roleRect.top + anchors.roleRect.height * 0.54,
  };
  const roleEnd: Point2D = {
    x: anchors.roleRect.left + anchors.roleRect.width + 6,
    y: anchors.roleRect.top + anchors.roleRect.height * 0.56,
  };

  const sayHiHoverPt = getSayHiHoverPoint(anchors.sayHiRect);

  const polaroidTarget: Point2D = {
    x: anchors.polaroidCaptionRect.left + anchors.polaroidCaptionRect.width * 0.62,
    y: anchors.polaroidCaptionRect.top + anchors.polaroidCaptionRect.height * 0.52,
  };

  const base: Omit<ScriptedFrameState, 'phase' | 'cursor'> = {
    isPressing: false,
    clickRippleProgress: null,
    clickPulseId: 0,
    roleHighlightProgress: 0,
    roleHighlightOpacity: 0,
    polaroidSelected: false,
  };

  switch (phase) {
    case 'intro-move':
      return {
        ...base,
        phase,
        cursor: interpolateHumanArc(idlePt, roleStart, localProgress, -20),
      };

    case 'step1-pre':
      return {
        ...base,
        phase,
        cursor: roleStart,
        isPressing: localProgress > 0.65,
      };

    case 'step1-drag': {
      const dragT = easeInOutCubic(localProgress);
      const dragX = roleStart.x + (roleEnd.x - roleStart.x) * dragT;
      const dragY =
        roleStart.y +
        (roleEnd.y - roleStart.y) * dragT +
        Math.sin(dragT * Math.PI) * 1.5;
      return {
        ...base,
        phase,
        cursor: { x: dragX, y: dragY },
        isPressing: true,
        roleHighlightProgress: dragT,
        roleHighlightOpacity: 1,
      };
    }

    case 'step1-hold':
      return {
        ...base,
        phase,
        cursor: roleEnd,
        roleHighlightProgress: 1,
        roleHighlightOpacity: 1,
      };

    case 'step1-release':
      return {
        ...base,
        phase,
        cursor: roleEnd,
        roleHighlightProgress: 1,
        roleHighlightOpacity: Number((1 - easeOutCubic(localProgress)).toFixed(3)),
      };

    case 'move-to-sayhi':
      return {
        ...base,
        phase,
        cursor: interpolateHumanArc(roleEnd, sayHiHoverPt, localProgress, 24),
      };

    case 'step2-hover': {
      // Gentle 1-second organic hover pause near "Say hi" without drawing
      const driftX = Math.sin(localProgress * Math.PI * 2) * 2.2;
      const driftY = Math.sin(localProgress * Math.PI) * -2.0;
      return {
        ...base,
        phase,
        cursor: {
          x: sayHiHoverPt.x + driftX,
          y: sayHiHoverPt.y + driftY,
        },
      };
    }

    case 'move-to-polaroid':
      return {
        ...base,
        phase,
        cursor: interpolateHumanArc(sayHiHoverPt, polaroidTarget, localProgress, -28),
      };

    case 'step3-pre':
      return {
        ...base,
        phase,
        cursor: polaroidTarget,
      };

    case 'step3-click1':
      return {
        ...base,
        phase,
        cursor: polaroidTarget,
        isPressing: localProgress < 0.45,
        clickRippleProgress: localProgress,
        clickPulseId: 1,
      };

    case 'step3-click2':
      return {
        ...base,
        phase,
        cursor: polaroidTarget,
        isPressing: localProgress < 0.45,
        clickRippleProgress: localProgress,
        clickPulseId: 2,
        polaroidSelected: localProgress >= 0.25,
      };

    case 'step3-hold':
      return {
        ...base,
        phase,
        cursor: polaroidTarget,
        polaroidSelected: true,
      };

    case 'step3-park':
      return {
        ...base,
        phase,
        cursor: interpolateHumanArc(polaroidTarget, idlePt, localProgress, -22),
        polaroidSelected: localProgress < 0.15,
      };

    case 'loop-pause':
      return {
        ...base,
        phase,
        cursor: idlePt,
      };
  }
}

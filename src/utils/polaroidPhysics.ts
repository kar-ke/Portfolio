export interface PolaroidTransform {
  /** Constant resting Z-rotation (never changes on hover). */
  readonly rotateZ: number;
  readonly frameOffsetX: number;
  readonly frameOffsetY: number;
  readonly translateY: number;
  readonly scale: number;
  readonly imageOffsetX: number;
  readonly imageOffsetY: number;
}

export interface PolaroidConfig {
  readonly restingRotationDeg: number;
  readonly maxFrameParallaxPx: number;
  readonly maxImageParallaxPx: number;
  readonly hoverLiftPx: number;
  readonly hoverScale: number;
}

export const POLAROID_DEFAULTS: PolaroidConfig = {
  restingRotationDeg: 4,
  maxFrameParallaxPx: 7,
  maxImageParallaxPx: 6,
  hoverLiftPx: -5,
  hoverScale: 1.012,
};

function clampUnit(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(-1, Math.min(1, value));
}

function round2(value: number): number {
  return Number(value.toFixed(2));
}

/**
 * Computes resting or subtle parallax-only Polaroid transforms.
 * Keeps resting rotation constant on hover (no rotation change or 3D tilt).
 */
export function computePolaroidTransform(
  isHovered: boolean,
  normalizedX: number,
  normalizedY: number,
  reducedMotion = false,
  config: PolaroidConfig = POLAROID_DEFAULTS,
): PolaroidTransform {
  if (!isHovered) {
    return {
      rotateZ: config.restingRotationDeg,
      frameOffsetX: 0,
      frameOffsetY: 0,
      translateY: 0,
      scale: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
    };
  }

  if (reducedMotion) {
    return {
      rotateZ: config.restingRotationDeg,
      frameOffsetX: 0,
      frameOffsetY: 0,
      translateY: -2,
      scale: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
    };
  }

  const nx = clampUnit(normalizedX);
  const ny = clampUnit(normalizedY);

  return {
    rotateZ: config.restingRotationDeg,
    frameOffsetX: round2(nx * config.maxFrameParallaxPx),
    frameOffsetY: round2(ny * config.maxFrameParallaxPx),
    translateY: config.hoverLiftPx,
    scale: config.hoverScale,
    imageOffsetX: round2(-nx * config.maxImageParallaxPx),
    imageOffsetY: round2(-ny * config.maxImageParallaxPx),
  };
}

/**
 * Smoothly interpolates between current and target Polaroid transforms
 * for liquid 60fps requestAnimationFrame parallax damping.
 */
export function lerpPolaroidTransform(
  current: PolaroidTransform,
  target: PolaroidTransform,
  factor: number,
): PolaroidTransform {
  const t = Math.max(0, Math.min(1, factor));
  const lerp = (a: number, b: number) => a + (b - a) * t;

  return {
    rotateZ: target.rotateZ,
    frameOffsetX: lerp(current.frameOffsetX, target.frameOffsetX),
    frameOffsetY: lerp(current.frameOffsetY, target.frameOffsetY),
    translateY: lerp(current.translateY, target.translateY),
    scale: lerp(current.scale, target.scale),
    imageOffsetX: lerp(current.imageOffsetX, target.imageOffsetX),
    imageOffsetY: lerp(current.imageOffsetY, target.imageOffsetY),
  };
}

export function isPolaroidSettled(
  current: PolaroidTransform,
  target: PolaroidTransform,
  epsilon = 0.02,
): boolean {
  return (
    Math.abs(current.frameOffsetX - target.frameOffsetX) < epsilon &&
    Math.abs(current.frameOffsetY - target.frameOffsetY) < epsilon &&
    Math.abs(current.translateY - target.translateY) < epsilon &&
    Math.abs(current.scale - target.scale) < 0.0005 &&
    Math.abs(current.imageOffsetX - target.imageOffsetX) < epsilon &&
    Math.abs(current.imageOffsetY - target.imageOffsetY) < epsilon
  );
}

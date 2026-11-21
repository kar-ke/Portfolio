import { memo, type CSSProperties, type MutableRefObject, type RefObject } from 'react';
import { OTHER_WORLD_COPY, STAMP_DUMMY_IMAGES } from '../../config/hobbies';

interface OtherWorldDeskSvgProps {
  className?: string;
  style?: CSSProperties;
  viewBox?: string;
  svgRef?: RefObject<SVGSVGElement | null>;
  screenInnerRef?: RefObject<SVGGElement | null>;
  sceneTextRef?: RefObject<SVGGElement | null>;
  stampGroupRef?: RefObject<SVGGElement | null>;
  stampImageRefs?: MutableRefObject<(SVGImageElement | null)[]>;
  showSceneText?: boolean;
  compactLayout?: boolean;
}

/**
 * Generates an organic perforated postage-stamp perimeter path centered at (0, 0).
 */
function buildStampPerimeterPath(halfW: number, halfH: number): string {
  const stepX = 5.5;
  const stepY = 5.5;
  const r = 1.65;
  const parts: string[] = [];

  // Start at top-left corner
  parts.push(`M ${-halfW} ${-halfH}`);

  // Top edge (left -> right) with semicircular perforations
  for (let x = -halfW + stepX * 0.7; x <= halfW - stepX * 0.7; x += stepX) {
    parts.push(`L ${(x - r).toFixed(2)} ${-halfH}`);
    parts.push(`A ${r} ${r} 0 0 0 ${(x + r).toFixed(2)} ${-halfH}`);
  }
  parts.push(`L ${halfW} ${-halfH}`);

  // Right edge (top -> bottom)
  for (let y = -halfH + stepY * 0.7; y <= halfH - stepY * 0.7; y += stepY) {
    parts.push(`L ${halfW} ${(y - r).toFixed(2)}`);
    parts.push(`A ${r} ${r} 0 0 0 ${halfW} ${(y + r).toFixed(2)}`);
  }
  parts.push(`L ${halfW} ${halfH}`);

  // Bottom edge (right -> left)
  for (let x = halfW - stepX * 0.7; x >= -halfW + stepX * 0.7; x -= stepX) {
    parts.push(`L ${(x + r).toFixed(2)} ${halfH}`);
    parts.push(`A ${r} ${r} 0 0 0 ${(x - r).toFixed(2)} ${halfH}`);
  }
  parts.push(`L ${-halfW} ${halfH}`);

  // Left edge (bottom -> top)
  for (let y = halfH - stepY * 0.7; y >= -halfH + stepY * 0.7; y -= stepY) {
    parts.push(`L ${-halfW} ${(y + r).toFixed(2)}`);
    parts.push(`A ${r} ${r} 0 0 0 ${-halfW} ${(y - r).toFixed(2)}`);
  }

  parts.push('Z');
  return parts.join(' ');
}

const STAMP_OUTER_PATH = buildStampPerimeterPath(21.5, 24.5);

/**
 * Pure monochrome hand-drawn studio desk illustration & world-locked typography.
 *
 * Crafted with organic Bezier ink contours, delicate double-sketch overlaps,
 * fine-liner cross-hatching, and a tilted perforated postage stamp right at the
 * laptop zoom center (166, 88) whose photo flips rapidly while zooming.
 */
export const OtherWorldDeskSvg = memo(function OtherWorldDeskSvg({
  className = '',
  style,
  viewBox = '0 0 360 250',
  svgRef,
  screenInnerRef,
  sceneTextRef,
  stampGroupRef,
  stampImageRefs,
  showSceneText = false,
  compactLayout = false,
}: OtherWorldDeskSvgProps) {
  const ink = '#1D1D1F';
  const mutedInk = '#3A3A3E';
  const subtleInk = '#6E6E73';
  const fontFamily = 'var(--font-sans)';

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <defs>
        <clipPath id="other-world-stamp-clip">
          <rect x="-16.2" y="-19.2" width="32.4" height="38.4" rx="1.2" />
        </clipPath>
      </defs>

      {/* World-locked Monochrome Typography (zooms strictly together with the desk, fades out halfway) */}
      {showSceneText && (
        <g ref={sceneTextRef} data-testid="other-world-scene-text">
          {compactLayout ? (
            <>
              {/* Compact Mobile Vertical Lockup with gentle breathing space around desk */}
              <text
                x="180"
                y="-62"
                textAnchor="middle"
                fill={ink}
                fontFamily={fontFamily}
                fontSize="54"
                fontWeight="700"
                letterSpacing="-1.9"
                data-testid="other-world-mobile-heading"
              >
                {OTHER_WORLD_COPY.leftLine1} {OTHER_WORLD_COPY.rightLine1}
              </text>
              <text
                x="180"
                y="-8"
                textAnchor="middle"
                fill={ink}
                fontFamily={fontFamily}
                fontSize="54"
                fontWeight="700"
                letterSpacing="-1.9"
              >
                {OTHER_WORLD_COPY.leftLine2} {OTHER_WORLD_COPY.rightLine2}
              </text>

              <text
                x="46"
                y="278"
                textAnchor="start"
                fill={subtleInk}
                fontFamily={fontFamily}
                fontSize="17"
                fontWeight="500"
                letterSpacing="-0.15"
                data-testid="other-world-subtitles"
              >
                {OTHER_WORLD_COPY.leftSubtitle}
              </text>
              <text
                x="318"
                y="278"
                textAnchor="end"
                fill={subtleInk}
                fontFamily={fontFamily}
                fontSize="17"
                fontWeight="500"
                letterSpacing="-0.15"
              >
                {OTHER_WORLD_COPY.rightSubtitle}
              </text>
            </>
          ) : (
            <>
              {/* Desktop/Tablet Horizontal Lockup — +10% overall scale & +5% breathing space */}
              <g data-testid="other-world-left-text">
                <text
                  x="20"
                  y="122"
                  textAnchor="end"
                  fill={ink}
                  fontFamily={fontFamily}
                  fontSize="80"
                  fontWeight="700"
                  letterSpacing="-2.8"
                >
                  {OTHER_WORLD_COPY.leftLine1}
                </text>
                <text
                  x="20"
                  y="198"
                  textAnchor="end"
                  fill={ink}
                  fontFamily={fontFamily}
                  fontSize="80"
                  fontWeight="700"
                  letterSpacing="-2.8"
                >
                  {OTHER_WORLD_COPY.leftLine2}
                </text>
              </g>

              <g data-testid="other-world-right-text">
                <text
                  x="346"
                  y="122"
                  textAnchor="start"
                  fill={ink}
                  fontFamily={fontFamily}
                  fontSize="80"
                  fontWeight="700"
                  letterSpacing="-2.8"
                >
                  {OTHER_WORLD_COPY.rightLine1}
                </text>
                <text
                  x="346"
                  y="198"
                  textAnchor="start"
                  fill={ink}
                  fontFamily={fontFamily}
                  fontSize="80"
                  fontWeight="700"
                  letterSpacing="-2.8"
                >
                  {OTHER_WORLD_COPY.rightLine2}
                </text>
              </g>

              {/* Sub-captions tucked neatly beneath "other" and "world" right along the desk base */}
              <g data-testid="other-world-subtitles">
                <text
                  x="20"
                  y="236"
                  textAnchor="end"
                  fill={subtleInk}
                  fontFamily={fontFamily}
                  fontSize="15"
                  fontWeight="500"
                  letterSpacing="-0.1"
                >
                  {OTHER_WORLD_COPY.leftSubtitle}
                </text>
                <text
                  x="346"
                  y="236"
                  textAnchor="start"
                  fill={subtleInk}
                  fontFamily={fontFamily}
                  fontSize="15"
                  fontWeight="500"
                  letterSpacing="-0.1"
                >
                  {OTHER_WORLD_COPY.rightSubtitle}
                </text>
              </g>
            </>
          )}
        </g>
      )}

      {/* Wall Pinboard / Hand-sketched 6-note Grid (upper right behind laptop) */}
      <g
        stroke={ink}
        strokeWidth="var(--desk-stroke, 1.85)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Slightly imperfect organic board outline with light double-sketch accent */}
        <path
          d="M234 28.5 C254 26.2 287 26.8 308.5 28.2 C313.2 28.6 314.8 31.8 314.4 36.2 C313.6 48 313.8 61 312.6 72.5 C312.1 76.8 309.2 79 304.8 79.1 C282 79.4 258 78.6 236.5 78.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M237 30.2 C259 28.8 289 29.2 307 30.1"
          strokeOpacity="0.28"
          strokeWidth="calc(var(--desk-stroke, 1.85) * 0.65)"
          vectorEffect="non-scaling-stroke"
        />
        {/* Hand-dotted corner pins */}
        <path d="M239.2 33.4 C240.5 32.1 241.8 33.6 240.3 34.4 Z" fill={ink} stroke="none" />
        <path d="M307.4 33.8 C308.8 32.5 310.1 34.1 308.5 34.9 Z" fill={ink} stroke="none" />
        <path d="M306.6 73.2 C308 72 309.2 73.6 307.7 74.4 Z" fill={ink} stroke="none" />

        {/* Row 1 of 3 organic hand-drawn sticky tiles */}
        <path
          d="M242.5 36.8 C247.5 35.8 253.8 36.1 258.6 36.7 C259.6 41.2 259.3 46.5 258.5 51.1 C253.2 51.7 247.4 51.4 242.2 50.9 C241.6 46.2 241.8 41.1 242.5 36.8 Z"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M245.5 42.5 C249 42 252.5 42.3 255.2 42.1 M245.8 46.5 C248.4 46.2 251.2 46.5 253.4 46.3"
          strokeOpacity="0.45"
          strokeWidth="calc(var(--desk-stroke, 1.85) * 0.65)"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M265.2 36.2 C270.6 35.7 276.4 36.3 281.8 36.1 C282.6 41 282.2 46.4 281.6 51.3 C276.2 51.8 270.4 51.2 265.1 51.4 C264.5 46.6 264.6 41.2 265.2 36.2 Z"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M288.4 37.1 C293.5 36.3 299.6 36.6 304.8 37.2 C305.4 41.8 305.1 47.1 304.4 51.8 C299.2 52.3 293.4 51.9 288.2 51.5 C287.8 46.9 287.7 41.8 288.4 37.1 Z"
          vectorEffect="non-scaling-stroke"
        />

        {/* Row 2 of 3 organic hand-drawn sticky tiles */}
        <path
          d="M242.2 57.6 C247.4 56.9 253.6 57.2 258.7 57.5 C259.4 62.1 259.1 67.4 258.4 72.1 C253.1 72.6 247.5 72.3 242.1 71.9 C241.5 67.3 241.6 62.2 242.2 57.6 Z"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M265.4 57.1 C270.8 56.7 276.5 57.3 281.9 57.2 C282.4 62 282.1 67.3 281.4 72.2 C276.1 72.7 270.5 72.1 265.3 72.3 C264.7 67.4 264.8 62.1 265.4 57.1 Z"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M288.2 57.4 C293.6 56.8 299.5 57.1 304.7 57.6 C305.3 62.2 305.1 67.4 304.2 72.1 C299 72.7 293.3 72.3 288 71.8 C287.6 67.2 287.6 62.2 288.2 57.4 Z"
          vectorEffect="non-scaling-stroke"
        />
        {/* Expressive hand-drawn checkmark that overshoots the tile slightly */}
        <path
          d="M291.2 64.8 C293.2 66.8 294.8 68.5 296.1 69.6 C299.1 64.9 302.9 60.1 307.6 54.6"
          stroke={ink}
          strokeWidth="calc(var(--desk-stroke, 1.85) * 1.15)"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {/* Hand-Sketched Desk Surface Outline with Organic Bevel & Subtle Hatch Shadows */}
      <g
        stroke={mutedInk}
        strokeWidth="var(--desk-stroke, 1.85)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M95 140.4 C86 140.2 78.5 140.8 71.5 141.3 C62.8 142 57.2 148.2 54.1 157.4 C50.5 174 47.6 195.5 45.8 214.2 C44.2 224.2 49.4 234.8 61.5 235.8 C134 236.6 226 236.4 303.8 235.1 C314.8 234.4 320.2 224.2 317.1 213.2 C313.2 195.2 309.8 173.8 306.2 156.4 C303.6 147.6 298.2 141.6 289.2 141.1 L284.5 141.2"
          vectorEffect="non-scaling-stroke"
        />
        {/* Soft hand-sketched desk rim thickness + subtle second pen stroke */}
        <path
          d="M51.5 232.2 C56 239.2 62.5 241.3 72.5 241.2 C144 241.8 219 241.5 292.8 240.6 C303.6 240.4 310.1 238.1 314.2 231.2"
          strokeOpacity="0.62"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M78 238.4 C138 239 224 238.7 286 238.1"
          strokeOpacity="0.25"
          strokeWidth="calc(var(--desk-stroke, 1.85) * 0.65)"
          vectorEffect="non-scaling-stroke"
        />
        {/* Subtle fine-liner desk shadow hatches under laptop & sketchbook */}
        <path
          d="M92 174.5 L98 172.2 M104 174.8 L110 172.5 M116 174.6 L122 172.4 M222 174.5 L228 172.3 M234 174.6 L240 172.2"
          strokeOpacity="0.34"
          strokeWidth="calc(var(--desk-stroke, 1.85) * 0.6)"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {/* Organic Potted Cactus / Succulent (right of laptop) */}
      <g
        stroke={ink}
        strokeWidth="var(--desk-stroke, 1.85)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M251.2 119.4 C244.4 114.6 241.8 103.5 246.8 98.2 C251.5 93.8 257.8 98.8 258.2 108.8"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M257.2 118.4 C255.8 104.2 258.8 89.6 266.2 89.8 C273.5 90.1 275.4 104.4 273.2 118.4"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M273.2 118.5 C276.4 108.2 282.4 101.2 287.4 104.3 C291.5 107.1 288.2 115.4 282.2 119.3"
          vectorEffect="non-scaling-stroke"
        />
        {/* Delicate paired needle ticks */}
        <path
          d="M263.8 97.8 L265.8 95.6 M267.8 105.2 L270.1 103.8 M261.2 109.6 L263.4 108.8 M249.2 105.4 L247.1 104.2 M280.8 109.2 L283.1 107.8"
          stroke={mutedInk}
          strokeWidth="calc(var(--desk-stroke, 1.85) * 0.72)"
          vectorEffect="non-scaling-stroke"
        />
        {/* Hand-thrown pot body + rim lip + light diagonal shadow hatch */}
        <path
          d="M247.8 119.2 C256.2 121.8 275.8 121.6 284.2 119.1 C283.2 126.2 282.1 132.8 280.8 139.2 C273.8 142.3 258.2 142.1 251.1 139.1 C249.8 132.6 248.8 126.1 247.8 119.2 Z"
          fill="#FCFCFB"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M248.8 125.2 C258.2 127.4 273.8 127.2 283.1 125.1"
          strokeOpacity="0.58"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M274.5 129.5 L278.5 127.5 M273.2 134.2 L278.1 131.8 M272.2 138.4 L277.2 135.9"
          strokeOpacity="0.38"
          strokeWidth="calc(var(--desk-stroke, 1.85) * 0.62)"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {/* Open Laptop — Focal Point (Center Screen: x=96..236, y=44..132, Zoom Center: 166, 88) */}
      <g
        stroke={ink}
        strokeWidth="var(--desk-stroke, 1.85)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Outer Laptop Lid / Hand-Drawn Bezel */}
        <path
          d="M104.2 44.8 C143.8 43.1 188.4 43.4 228.1 45.1 C233.6 45.4 236.6 49.2 236.1 55.2 C235.5 78.2 235.1 100.8 234.4 123.1 C234.1 128.6 230.4 132.1 224.8 132.2 C185.5 132.4 146.5 131.8 107.1 132.1 C101.6 132 97.7 128.6 97.4 123.1 C96.8 100.6 96.5 78.1 95.9 55.1 C95.4 49.1 98.6 45.2 104.2 44.8 Z"
          fill="#FCFCFB"
          vectorEffect="non-scaling-stroke"
        />

        {/* Inner Display Frame (creates crisp hand-drawn double-line bezel at deep zoom) */}
        <path
          d="M110.2 51.4 C146.2 50.1 185.8 50.4 222.1 51.6 C226.6 51.9 229.1 54.6 228.9 59.1 C228.4 78.8 228.1 98.2 227.5 117.6 C227.3 122.1 224.7 124.9 220.1 124.8 C184.2 125.1 148 124.6 111.8 124.9 C107.2 124.8 104.5 122.1 104.3 117.5 C103.8 98.1 103.6 78.8 103.1 59.1 C102.9 54.6 105.6 51.7 110.2 51.4 Z"
          fill="#FCFCFB"
          stroke={ink}
          vectorEffect="non-scaling-stroke"
        />

        {/* Focal Center inside Laptop Screen: Tilted Postage Stamp (rapid random dummy photos) + Cursor */}
        <g ref={screenInnerRef} data-testid="other-world-screen-inner">
          {/* Tilted Postage Stamp centered directly at laptop zoom focal point (166, 88) */}
          <g
            ref={stampGroupRef}
            data-testid="other-world-tilted-stamp"
            data-active-stamp-index="0"
            transform="translate(166 88) rotate(-7.5)"
          >
            {/* Soft hand-drawn paper drop shadow */}
            <path
              d={STAMP_OUTER_PATH}
              transform="translate(1.8 2.1)"
              fill={ink}
              fillOpacity="0.1"
              stroke="none"
            />

            {/* Crisp white perforated postage stamp paper */}
            <path
              d={STAMP_OUTER_PATH}
              fill="#FFFFFF"
              stroke={ink}
              strokeWidth="calc(var(--desk-stroke, 1.85) * 0.72)"
              vectorEffect="non-scaling-stroke"
            />

            {/* Stacked Preloaded Dummy Photos inside Stamp Photo Frame (instant 0-lag random switching) */}
            <g clipPath="url(#other-world-stamp-clip)">
              <rect x="-16.5" y="-19.5" width="33" height="39" fill="#E5E5E7" stroke="none" />
              {STAMP_DUMMY_IMAGES.map((src, idx) => (
                <image
                  key={src}
                  ref={(el) => {
                    if (stampImageRefs) {
                      stampImageRefs.current[idx] = el;
                    }
                  }}
                  href={src}
                  x="-16.5"
                  y="-19.5"
                  width="33"
                  height="39"
                  preserveAspectRatio="xMidYMid slice"
                  style={{ opacity: idx === 0 ? 1 : 0 }}
                />
              ))}
            </g>

            {/* Delicate inner ink frame around photo */}
            <rect
              x="-16.2"
              y="-19.2"
              width="32.4"
              height="38.4"
              rx="1.2"
              stroke={ink}
              strokeOpacity="0.72"
              strokeWidth="calc(var(--desk-stroke, 1.85) * 0.48)"
              vectorEffect="non-scaling-stroke"
            />

            {/* Subtle vintage postmark wavy ink lines grazing upper-right stamp corner */}
            <path
              d="M11.5 -14.2 C14.5 -15.4 17.5 -13.1 20.5 -14.3 M12.2 -10.8 C15.2 -12 18.2 -9.7 21.2 -10.9"
              stroke={ink}
              strokeOpacity="0.34"
              strokeWidth="calc(var(--desk-stroke, 1.85) * 0.45)"
              vectorEffect="non-scaling-stroke"
            />
          </g>

          {/* Small hand-drawn cursor arrow tucked lightly near bottom-right of the stamp */}
          <path
            d="M198.5 96.5 C200.2 101.8 201.8 106.5 203.2 111.2 C204.6 108.8 205.8 106.8 206.9 105.2 C209.1 104.5 211.6 103.6 213.8 102.9 C208.8 100.7 203.6 98.6 198.5 96.5 Z"
            stroke={ink}
            fill="#FCFCFB"
            strokeWidth="calc(var(--desk-stroke, 1.85) * 0.85)"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* Hand-Drawn Laptop Keyboard Base */}
        <path
          d="M99.2 132.1 C143.5 131.9 188.6 132.2 232.8 132.1 C238.1 142.8 243.4 153.5 248.1 163.8 C249.6 167.4 247.3 170.6 242.9 170.7 C191.5 171.2 140.4 170.6 89.2 170.6 C84.7 170.5 82.4 167.5 84.1 163.9 C89.2 153.4 94.1 142.7 99.2 132.1 Z"
          fill="#FCFCFB"
          vectorEffect="non-scaling-stroke"
        />
        {/* Natural sketchy keyboard rows (slight organic breaks & tilt) */}
        <path
          d="M104.5 139.2 C145 138.8 187 139.3 227.5 139.1"
          strokeOpacity="0.68"
          strokeWidth="calc(var(--desk-stroke, 1.85) * 0.82)"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M101.2 145.3 C143 144.8 189 145.4 230.8 145.1"
          strokeOpacity="0.68"
          strokeWidth="calc(var(--desk-stroke, 1.85) * 0.82)"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M98.4 151.2 C141 150.9 191 151.3 233.6 151.1"
          strokeOpacity="0.68"
          strokeWidth="calc(var(--desk-stroke, 1.85) * 0.82)"
          vectorEffect="non-scaling-stroke"
        />
        {/* Hand-sketched trackpad */}
        <path
          d="M148.2 157.2 C160.2 156.9 172.1 157.1 183.8 157.3 C184.7 160.1 185.7 162.9 186.4 165.4 C172.6 165.7 159.4 165.5 145.6 165.4 C146.4 162.8 147.3 159.9 148.2 157.2 Z"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {/* Hand-Drawn Coffee Mug with Subtle Steam Wisps & Pen Hatching (middle-right on desk) */}
      <g
        stroke={ink}
        strokeWidth="var(--desk-stroke, 1.85)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Delicate curling steam wisps */}
        <path
          d="M281.5 142.2 C279.8 139.1 283.4 136.4 281.8 133.2 M289.5 141.6 C288.1 138.4 291.5 135.8 290.1 132.4"
          strokeOpacity="0.45"
          strokeWidth="calc(var(--desk-stroke, 1.85) * 0.65)"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M270.2 151.4 C270.1 161.2 269.8 171.2 270.3 181.1 C270.6 185.6 277.2 188.2 286.1 188.1 C295.2 188.1 301.8 185.4 302.1 180.9 C302.3 171.1 302.1 161.2 301.9 151.4"
          fill="#FCFCFB"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M270.2 151.4 C270.4 147.8 277.6 146.2 286.1 146.3 C294.6 146.4 301.8 148.1 301.9 151.4 C301.7 154.9 294.6 156.4 286.1 156.3 C277.5 156.2 270.4 154.8 270.2 151.4 Z"
          fill="#FCFCFB"
          vectorEffect="non-scaling-stroke"
        />
        {/* Inner coffee surface line */}
        <path
          d="M274.2 151.9 C279.6 153.4 292.4 153.3 297.8 151.8"
          strokeOpacity="0.45"
          strokeWidth="calc(var(--desk-stroke, 1.85) * 0.65)"
          vectorEffect="non-scaling-stroke"
        />
        {/* Hand-curved handle */}
        <path
          d="M302.1 158.2 C311.4 157.8 312.4 173.8 302.1 175.2"
          vectorEffect="non-scaling-stroke"
        />
        {/* Subtle decorative mug band + side shading hatches */}
        <path
          d="M270.6 168.1 C278.4 171.2 293.8 171.1 301.6 168.1"
          stroke={mutedInk}
          strokeOpacity="0.58"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M296.2 160.2 L296.4 165.4 M298.8 172.2 L298.9 179.4 M295.4 174.1 L295.5 181.2"
          strokeOpacity="0.35"
          strokeWidth="calc(var(--desk-stroke, 1.85) * 0.6)"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {/* Hand-Sketched Spiral Sketchbook & Fineliner Pen (front left) */}
      <g
        stroke={ink}
        strokeWidth="var(--desk-stroke, 1.85)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M80.2 178.1 C93.1 179.6 106.2 181.3 118.9 183.2 C113.8 197.1 108.4 211.2 103.1 224.8 C88.2 222.7 73.1 220.4 58.2 218.1 C65.4 204.8 72.8 191.5 80.2 178.1 Z"
          fill="#FCFCFB"
          vectorEffect="non-scaling-stroke"
        />
        {/* Stacked page edges beneath cover */}
        <path
          d="M58.4 218.2 C59.4 219.9 60.2 221.6 61.1 223.1 C75.8 225.4 90.4 227.8 105.1 230.1 C110.2 216.2 115.1 202.1 120.1 188.2"
          strokeOpacity="0.6"
          vectorEffect="non-scaling-stroke"
        />
        {/* Hand-drawn uneven spiral wire rings */}
        <path
          d="M82.1 176.2 C83.8 172.8 87.2 174.9 86.1 179.1 M91.9 177.3 C93.7 173.9 97.1 176.1 96.1 180.1 M101.8 178.8 C103.6 175.6 107.1 177.9 106.1 181.9 M111.2 180.1 C113.1 176.9 116.4 179.1 115.2 183.1"
          vectorEffect="non-scaling-stroke"
        />
        {/* Expressive little hand-drawn sketch on the open page */}
        <path
          d="M84.4 196.8 C84.2 193.6 87.2 191.6 90.2 192.4 C93.1 193.2 94.1 196.4 92.6 199.1 C91.1 201.6 87.6 202.2 85.4 200.4 C84.6 199.6 84.5 198.2 84.4 196.8 Z"
          stroke={ink}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M78.2 212.1 C81.4 204.8 92.8 205.1 96.2 213.2 M73.2 198.1 C75.6 198.6 77.9 198.9 80.2 199.2 M71.4 204.2 C73.2 204.5 75.1 204.8 76.9 205.1"
          stroke={mutedInk}
          strokeWidth="calc(var(--desk-stroke, 1.85) * 0.8)"
          vectorEffect="non-scaling-stroke"
        />
        {/* Faceted fineliner pen resting beside sketchbook */}
        <path
          d="M132.1 184.2 C137.8 191.4 143.4 198.7 149.1 205.9 C150.4 207.7 151.8 209.4 153.1 211.1 C150.7 210.1 148.4 209.1 146.1 208.1 C140.1 201.1 134.1 194.1 128.1 187.1 C129.4 186.1 130.8 185.1 132.1 184.2 Z"
          fill="#FCFCFB"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M133.5 186.5 L138.2 192.4"
          strokeOpacity="0.45"
          strokeWidth="calc(var(--desk-stroke, 1.85) * 0.65)"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {/* Hand-Sketched Graphics Drawing Tablet, Organic Cord & Stylus (front center-right) */}
      <g
        stroke={ink}
        strokeWidth="var(--desk-stroke, 1.85)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Loose natural curving USB cable */}
        <path
          d="M236.2 155.1 C254.6 153.8 259.4 168.8 248.2 175.8 C240.1 180.4 231.8 180.1 227.1 187.2"
          strokeOpacity="0.72"
          vectorEffect="non-scaling-stroke"
        />
        {/* Organic rounded tablet chassis */}
        <path
          d="M178.2 188.1 C199.4 187.6 220.8 187.9 242.1 188.2 C246.2 188.3 249.1 191.2 250.1 195.2 C251.4 202.8 252.8 210.4 254.1 218.1 C254.6 222.1 251.9 225.2 246.9 225.1 C222.2 225.5 197.6 225.2 173.1 225.1 C168.1 225.1 165.4 222.1 166.1 218.1 C167.4 210.4 168.8 202.8 170.1 195.1 C171.1 191.1 174.1 188.2 178.2 188.1 Z"
          fill="#FCFCFB"
          vectorEffect="non-scaling-stroke"
        />
        {/* Active drawing area */}
        <path
          d="M182.2 196.1 C201.8 195.8 221.4 196.1 240.9 196.2 C242.3 203.4 243.7 210.7 244.9 217.9 C222.8 218.2 200.6 218.1 178.4 217.9 C179.7 210.6 180.9 203.3 182.2 196.1 Z"
          stroke={mutedInk}
          vectorEffect="non-scaling-stroke"
        />
        {/* Tiny express-key dots along left side of drawing tablet */}
        <path
          d="M173.4 201.5 L175.8 201.5 M172.6 206.8 L175.1 206.8 M171.8 212.1 L174.3 212.1"
          strokeOpacity="0.6"
          strokeWidth="calc(var(--desk-stroke, 1.85) * 0.78)"
          vectorEffect="non-scaling-stroke"
        />
        {/* Top status bar stroke */}
        <path
          d="M186.2 192.1 C202.4 191.8 218.6 192.1 234.8 192.1"
          stroke={ink}
          strokeWidth="calc(var(--desk-stroke, 1.85) * 1.15)"
          vectorEffect="non-scaling-stroke"
        />
        {/* Tapered hand-drawn stylus resting on right */}
        <path
          d="M277.1 197.1 C274.1 205.4 271.1 213.7 268.1 222.1 C267.1 223.1 266.1 224.1 265.1 225.1 C265.1 223.4 265.1 221.7 265.1 220.1 C267.8 212.1 270.4 204.1 273.1 196.1 C274.4 196.4 275.8 196.8 277.1 197.1 Z"
          fill="#FCFCFB"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
});

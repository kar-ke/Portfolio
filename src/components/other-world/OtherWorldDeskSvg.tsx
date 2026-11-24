import { memo, type CSSProperties, type MutableRefObject, type RefObject } from 'react';
import { OTHER_WORLD_COPY, OTHER_WORLD_STAMPS } from '../../config/hobbies';

interface OtherWorldDeskSvgProps {
  className?: string;
  style?: CSSProperties;
  viewBox?: string;
  svgRef?: RefObject<SVGSVGElement | null>;
  sceneTextRef?: RefObject<SVGGElement | null>;
  stampGroupRef?: RefObject<SVGGElement | null>;
  stampImageRefs?: MutableRefObject<(SVGImageElement | null)[]>;
  showSceneText?: boolean;
  compactLayout?: boolean;
}

/**
 * Unified monochrome hand-drawn designer's desk illustration + world-locked typography.
 *
 * All elements share a single SVG coordinate system so "Welcome / other" and "to my / world"
 * zoom in lockstep with the hand-drawn desk illustration (open laptop, 6-box wall grid,
 * cactus, coffee mug, sketchbook + pen, drawing tablet + stylus) while the small tilted
 * stamp inside the laptop screen cycles smoothly during zoom.
 */
export const OtherWorldDeskSvg = memo(function OtherWorldDeskSvg({
  className = '',
  style,
  viewBox = '0 0 360 250',
  svgRef,
  sceneTextRef,
  stampGroupRef,
  stampImageRefs,
  showSceneText = false,
  compactLayout = false,
}: OtherWorldDeskSvgProps) {
  const ink = '#1D1D1F';
  const subtleInk = '#6E6E73';
  const paper = '#FCFCFB';
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
      {/* World-locked monochrome typography zooming in lockstep with the desk */}
      {showSceneText && (
        <g ref={sceneTextRef} data-testid="other-world-scene-text">
          {compactLayout ? (
            <>
              <text
                x="180"
                y="-86"
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
                y="-32"
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
                x="180"
                y="278"
                textAnchor="middle"
                fill={subtleInk}
                fontFamily={fontFamily}
                fontSize="17"
                fontWeight="500"
                letterSpacing="-0.15"
                data-testid="other-world-subtitles"
              >
                {`${OTHER_WORLD_COPY.leftSubtitle} ${OTHER_WORLD_COPY.rightSubtitle}`}
              </text>
            </>
          ) : (
            <>
              <g data-testid="other-world-left-text">
                <text
                  x="6"
                  y="112"
                  textAnchor="end"
                  fill={ink}
                  fontFamily={fontFamily}
                  fontSize="82"
                  fontWeight="700"
                  letterSpacing="-2.8"
                >
                  {OTHER_WORLD_COPY.leftLine1}
                </text>
                <text
                  x="6"
                  y="186"
                  textAnchor="end"
                  fill={ink}
                  fontFamily={fontFamily}
                  fontSize="82"
                  fontWeight="700"
                  letterSpacing="-2.8"
                >
                  {OTHER_WORLD_COPY.leftLine2}
                </text>
              </g>

              <g data-testid="other-world-right-text">
                <text
                  x="354"
                  y="112"
                  textAnchor="start"
                  fill={ink}
                  fontFamily={fontFamily}
                  fontSize="82"
                  fontWeight="700"
                  letterSpacing="-2.8"
                >
                  {OTHER_WORLD_COPY.rightLine1}
                </text>
                <text
                  x="354"
                  y="186"
                  textAnchor="start"
                  fill={ink}
                  fontFamily={fontFamily}
                  fontSize="82"
                  fontWeight="700"
                  letterSpacing="-2.8"
                >
                  {OTHER_WORLD_COPY.rightLine2}
                </text>
              </g>

              <g data-testid="other-world-subtitles">
                <text
                  x="6"
                  y="224"
                  textAnchor="end"
                  fill={subtleInk}
                  fontFamily={fontFamily}
                  fontSize="15.5"
                  fontWeight="500"
                  letterSpacing="-0.1"
                >
                  {OTHER_WORLD_COPY.leftSubtitle}
                </text>
                <text
                  x="354"
                  y="224"
                  textAnchor="start"
                  fill={subtleInk}
                  fontFamily={fontFamily}
                  fontSize="15.5"
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

      {/* Hand-drawn monochrome designer's desk illustration */}
      <g
        data-testid="other-world-desk-illustration"
        stroke={ink}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* 1. Wall Pinboard / 6-Box Grid (top-right behind laptop) */}
        <g>
          <path
            d="M 218 16 C 242 14, 272 13.5, 294 15.5 C 297.5 16, 298.5 19, 298 36 C 297.5 52, 297 64, 293.5 67.5 C 270 69, 240 68.5, 217 66.5 C 214.5 66, 214 62, 214.5 42 C 215 26, 215.5 17, 218 16 Z"
            fill={paper}
            strokeWidth="1.95"
            vectorEffect="non-scaling-stroke"
          />
          {/* Corner pin dots */}
          <circle cx="220" cy="20.5" r="1.15" fill={ink} stroke="none" />
          <circle cx="292.5" cy="20" r="1.15" fill={ink} stroke="none" />
          <circle cx="219.5" cy="62" r="1.15" fill={ink} stroke="none" />
          <circle cx="292" cy="62.5" r="1.15" fill={ink} stroke="none" />

          {/* Top row of 3 hand-drawn boxes */}
          <path
            d="M 225 23.5 C 231 22.8, 237 22.8, 241.5 23.5 C 242.5 27, 242.5 33, 241.5 37.5 C 236 38.2, 230 38, 224.8 37.5 C 224 33, 224.2 27.5, 225 23.5 Z"
            strokeWidth="1.55"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 248.5 23.2 C 254.5 22.7, 260.5 22.8, 265 23.4 C 266 27, 265.8 33.2, 265 37.4 C 259.5 38.1, 253.5 38, 248.2 37.4 C 247.5 33, 247.6 27.2, 248.5 23.2 Z"
            strokeWidth="1.55"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 272 23.4 C 277.8 22.8, 283.5 23, 287.8 23.6 C 288.6 27.5, 288.6 33.2, 287.6 37.6 C 282.5 38.2, 276.8 38, 271.8 37.4 C 271 33, 271.2 27.4, 272 23.4 Z"
            strokeWidth="1.55"
            vectorEffect="non-scaling-stroke"
          />

          {/* Bottom row of 3 hand-drawn boxes (with checkmark in 3rd) */}
          <path
            d="M 224.8 44.5 C 230.8 43.9, 236.8 44, 241.4 44.6 C 242.2 48.2, 242.2 54.4, 241.2 58.6 C 235.8 59.3, 230 59.2, 224.6 58.6 C 223.8 54.2, 224 48.6, 224.8 44.5 Z"
            strokeWidth="1.55"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 248.4 44.4 C 254.2 43.8, 260.2 44, 264.8 44.6 C 265.6 48.2, 265.6 54.2, 264.6 58.6 C 259.2 59.3, 253.4 59.1, 248.2 58.5 C 247.4 54.2, 247.6 48.4, 248.4 44.4 Z"
            strokeWidth="1.55"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 271.8 44.4 C 277.6 43.8, 283.6 44, 288 44.6 C 288.8 48.4, 288.6 54.4, 287.8 58.8 C 282.4 59.4, 276.6 59.2, 271.6 58.6 C 270.8 54.2, 271 48.4, 271.8 44.4 Z"
            strokeWidth="1.55"
            vectorEffect="non-scaling-stroke"
          />
          {/* Hand-drawn checkmark */}
          <path
            d="M 275 51.8 C 276.8 53.6, 278.4 55.4, 279.6 56.8 C 282.4 52.8, 286.4 47.4, 290.6 43.4"
            strokeWidth="2.1"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* 2. Hand-Drawn Desk Surface / Tabletop */}
        <g>
          <path
            d="M 62 125 C 122 123.5, 240 123.5, 298 125 C 304 125.5, 307 128.5, 311 139 C 320 163, 329 190, 335 213 C 337.5 222.5, 331.5 230, 320 230.5 C 240 233, 120 233, 40 230.5 C 28.5 230, 22.5 222.5, 25 213 C 31 190, 40 163, 49 139 C 53 128.5, 56 125.5, 62 125 Z"
            fill={paper}
            strokeWidth="2.05"
            vectorEffect="non-scaling-stroke"
          />
          {/* Subtle hand-drawn tabletop front lip */}
          <path
            d="M 31 228.5 C 35 234.5, 42 236, 52 236.2 C 128 238, 232 238, 308 236.2 C 318 236, 325 234.5, 329 228.5"
            strokeWidth="1.5"
            opacity="0.72"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* 3. Open Hand-Drawn Laptop (Center Focal Object) */}
        <g data-testid="other-world-laptop">
          {/* Outer laptop lid */}
          <path
            d="M 107 37.5 C 142 35.4, 194 35.4, 229 37.5 C 234 38, 236 41.5, 235.5 52 C 234.8 74, 234.2 98, 233 116 C 232.6 119.5, 229.8 121.2, 225.5 121.4 C 190 122.4, 146 122.4, 110.5 121.4 C 106.2 121.2, 103.4 119.5, 103 116 C 101.8 98, 101.2 74, 100.5 52 C 100 41.5, 102 38, 107 37.5 Z"
            fill={paper}
            strokeWidth="2.45"
            vectorEffect="non-scaling-stroke"
          />
          {/* Inner laptop screen bezel — centered at (168, 78), 118 × 72 */}
          <path
            d="M 113 43.2 C 145 41.8, 191 41.8, 223 43.2 C 226.4 43.5, 227.6 45.8, 227.2 52.5 C 226.8 71, 226.4 92, 225.6 109.2 C 225.2 112.5, 223.2 114, 219.5 114.2 C 188 115, 148 115, 116.5 114.2 C 112.8 114, 110.8 112.5, 110.4 109.2 C 109.6 92, 109.2 71, 108.8 52.5 C 108.4 45.8, 109.6 43.5, 113 43.2 Z"
            fill={paper}
            strokeWidth="1.95"
            vectorEffect="non-scaling-stroke"
          />

          {/* Small tilted stamp inside the laptop screen (cycles stamps while zooming) */}
          <g
            ref={stampGroupRef}
            data-testid="other-world-tilted-stamp"
            data-active-stamp-index="0"
            transform="translate(152 75.5) rotate(-6.5)"
            style={{
              filter:
                'drop-shadow(0px 1.5px 2.5px rgba(17, 17, 19, 0.14)) drop-shadow(0px 5px 9px rgba(17, 17, 19, 0.14))',
            }}
          >
            {OTHER_WORLD_STAMPS.map((stamp, idx) => (
              <image
                key={stamp.id}
                ref={(el) => {
                  if (stampImageRefs) {
                    stampImageRefs.current[idx] = el;
                  }
                }}
                href={stamp.src}
                x="-21"
                y="-21"
                width="42"
                height="42"
                preserveAspectRatio="xMidYMid meet"
                style={{ opacity: idx === 0 ? 1 : 0 }}
              />
            ))}
          </g>

          {/* Hand-drawn cursor arrow inside laptop screen */}
          <path
            d="M 188 80.5 C 189.6 87.2, 191.2 94.2, 193 101 C 194.8 98.2, 196.4 95.4, 198 93.4 C 200.6 92.8, 203.4 92.2, 206.4 91.6 C 200.6 87.6, 194.2 83.8, 188 80.5 Z"
            fill={paper}
            strokeWidth="1.85"
            vectorEffect="non-scaling-stroke"
          />

          {/* Laptop keyboard deck */}
          <path
            d="M 104 121.5 C 96 131, 88 142, 83.5 151.5 C 81.8 155, 84.5 158.2, 89.5 158.5 C 140 160.2, 196 160.2, 246.5 158.5 C 251.5 158.2, 254.2 155, 252.5 151.5 C 248 142, 240 131, 232 121.5"
            fill={paper}
            strokeWidth="2.05"
            vectorEffect="non-scaling-stroke"
          />
          {/* Keyboard lower thickness */}
          <path
            d="M 84.5 156.5 C 87 160.8, 91.5 162, 99 162.2 C 145 163.5, 191 163.5, 237 162.2 C 244.5 162, 249 160.8, 251.5 156.5"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          {/* Subtle hand-drawn keyboard rows */}
          <path
            d="M 105 129.5 C 146 129, 190 129, 231 129.5"
            strokeWidth="1.35"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 100 135.5 C 145 135, 191 135, 236 135.5"
            strokeWidth="1.35"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 96 141.5 C 144 141, 192 141, 240 141.5"
            strokeWidth="1.35"
            vectorEffect="non-scaling-stroke"
          />
          {/* Trackpad */}
          <path
            d="M 149 146.2 C 161 145.8, 175 145.8, 187 146.2 C 188.8 148.5, 189.2 152, 188.2 154.2 C 175 154.8, 161 154.8, 147.8 154.2 C 146.8 152, 147.2 148.5, 149 146.2 Z"
            strokeWidth="1.45"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* 4. Potted Cactus (right of laptop) */}
        <g>
          {/* Cactus stems */}
          <path
            d="M 274 114 C 272.5 103, 273.5 91.5, 277.8 90.2 C 282.4 88.8, 284 100, 282.8 114"
            fill={paper}
            strokeWidth="1.7"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 267 114 C 262.8 106.5, 259.8 98.5, 263.5 96.4 C 267 94.5, 270.4 101.8, 271.5 113.5"
            fill={paper}
            strokeWidth="1.65"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 284.5 113.5 C 287.2 103.5, 291.5 96.8, 294.8 98.6 C 297.8 100.4, 294.2 108.4, 289.2 114"
            fill={paper}
            strokeWidth="1.65"
            vectorEffect="non-scaling-stroke"
          />
          {/* Tiny prickly spine ticks */}
          <path
            d="M 277.5 95.5 L 278 97.8 M 276 103 L 278.5 103.5 M 264.5 101.5 L 266 103 M 291.2 103.5 L 292.6 105"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
          {/* Ceramic pot */}
          <path
            d="M 262 114.2 C 271 112.5, 285 112.5, 294 114.2 C 293.5 122.5, 291.8 131, 289.5 135.2 C 283 137.4, 273 137.4, 266.5 135.2 C 264.2 131, 262.5 122.5, 262 114.2 Z"
            fill={paper}
            strokeWidth="1.85"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 262.5 115.2 C 271 118.2, 285 118.2, 293.5 115.2"
            strokeWidth="1.45"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* 5. Coffee Mug (front-right below cactus) */}
        <g>
          {/* Mug handle */}
          <path
            d="M 307.5 156.5 C 316.5 156, 318.8 164.5, 316.8 171.5 C 315.2 176.8, 311.5 178.4, 306.5 177.2"
            fill="none"
            strokeWidth="1.9"
            vectorEffect="non-scaling-stroke"
          />
          {/* Mug cylinder */}
          <path
            d="M 279.5 151.5 C 288 149.2, 299 149.2, 307.5 151.5 C 308 163.5, 307.5 175.5, 306 183.5 C 299.5 186.6, 287.5 186.6, 281 183.5 C 279.5 175.5, 279 163.5, 279.5 151.5 Z"
            fill={paper}
            strokeWidth="1.9"
            vectorEffect="non-scaling-stroke"
          />
          {/* Mug rim & coffee fill */}
          <path
            d="M 280.2 152.2 C 288 155.4, 299 155.4, 306.8 152.2"
            strokeWidth="1.45"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 280.8 171.5 C 288.5 174.2, 298.5 174.2, 306.2 171.5 L 305.4 182.2 C 299 185, 288 185, 281.6 182.2 Z"
            fill={ink}
            fillOpacity="0.88"
            stroke="none"
          />
          {/* Subtle steam wisps */}
          <path
            d="M 288.5 145.5 C 287.2 142.8, 290.2 140.4, 289 137.8"
            strokeWidth="1.25"
            opacity="0.65"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 297 146 C 295.8 143.4, 298.6 141.2, 297.4 138.6"
            strokeWidth="1.25"
            opacity="0.65"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* 6. Open Sketchbook + Ink Pen (front-left on desk) */}
        <g>
          {/* Sketchbook cover & pages */}
          <path
            d="M 54 166.5 C 68 162.5, 84 159.5, 97 157.5 C 107 168.5, 118 182.5, 128 197.5 C 115 203.5, 96 211.5, 76 217.5 C 63 203, 51 186, 42 173.5 C 45.5 170.8, 49.5 168.2, 54 166.5 Z"
            fill={paper}
            strokeWidth="1.9"
            vectorEffect="non-scaling-stroke"
          />
          {/* Stacked page edge thickness */}
          <path
            d="M 43.5 176 C 52.5 188.5, 64 205.5, 76.5 220.5 C 96.5 214.5, 115 206.5, 128.5 200"
            strokeWidth="1.45"
            vectorEffect="non-scaling-stroke"
          />
          {/* Spiral binding loops along top-left edge */}
          <path
            d="M 55 165.5 C 53.5 162.5, 56 161, 58 163.5 M 65 163 C 63.5 160, 66 158.5, 68 161 M 75 160.8 C 73.5 157.8, 76 156.5, 78 159 M 85 158.8 C 83.5 155.8, 86 154.5, 88 157"
            strokeWidth="1.35"
            vectorEffect="non-scaling-stroke"
          />
          {/* Whimsical hand-drawn character / doodle inside sketchbook */}
          <path
            d="M 65 183 C 67.5 176.5, 74.5 174.5, 79 178 C 83.5 181.5, 83.5 188, 78.5 191.5 C 73.5 195, 66.5 193, 64.8 188.5"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="71.5" cy="182.5" r="1.15" fill={ink} stroke="none" />
          <circle cx="76.5" cy="181.2" r="1.15" fill={ink} stroke="none" />
          <path
            d="M 71.5 187 C 74 188.8, 76.8 188, 78.2 186"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 85 196.5 C 93 193.5, 102 189.5, 109.5 186.5 M 90 202.5 C 97 199.8, 105 196.5, 112 193.5"
            strokeWidth="1.3"
            opacity="0.75"
            vectorEffect="non-scaling-stroke"
          />

          {/* Diagonal ink pen resting beside sketchbook */}
          <path
            d="M 116 167.5 C 127 175.5, 138 183.5, 148.5 191.5 L 152.5 196 L 146 194.2 C 135.5 186.2, 124.5 178.2, 113.8 170.2 C 113.2 168.8, 114.4 167.2, 116 167.5 Z"
            fill={paper}
            strokeWidth="1.65"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* 7. Drawing Tablet + USB Cord + Stylus (front-center-right on desk) */}
        <g>
          {/* Wavy USB cord connecting tablet to laptop */}
          <path
            d="M 244 176.5 C 254 168, 261 159, 256 151.5 C 251.5 145, 241 144.5, 236 141"
            fill="none"
            strokeWidth="1.45"
            vectorEffect="non-scaling-stroke"
          />
          {/* Tablet body */}
          <path
            d="M 168 177 C 194 175.5, 224 175.5, 249 177 C 253.5 177.5, 255.5 180.5, 256 190 C 256.8 201, 256.8 210, 254.5 215.5 C 253.2 218.5, 250 220, 245 220.2 C 218 221.5, 190 221.5, 165 220.2 C 160.5 220, 158 218, 157.5 214.2 C 156.8 205, 158.2 192, 161.5 181.5 C 162.8 178.2, 165 177.2, 168 177 Z"
            fill={paper}
            strokeWidth="1.9"
            vectorEffect="non-scaling-stroke"
          />
          {/* Active drawing zone on tablet */}
          <path
            d="M 176 182.5 C 199 181.8, 224 181.8, 246 182.5 C 248.2 182.8, 249.2 184.5, 249.4 191 C 249.8 199, 249.6 207, 248.6 212.5 C 248 214.2, 246.5 215, 243.5 215.2 C 221 215.8, 197 215.8, 174 215.2 C 171.8 215, 170.8 213.8, 170.8 211 C 170.8 202.5, 171.6 192, 173 185.5 C 173.6 183.4, 174.5 182.6, 176 182.5 Z"
            strokeWidth="1.35"
            vectorEffect="non-scaling-stroke"
          />
          {/* Tablet express-key indicator strip */}
          <path
            d="M 166 186.5 L 165.4 191 M 164.8 196.5 L 164.2 201 M 163.8 206.5 L 163.4 210.5"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          {/* Stylus pen beside tablet */}
          <path
            d="M 277.5 190.5 C 273.5 199.5, 269.5 208.5, 266.2 216.5 L 263.5 220.2 L 263.2 215 C 266.5 206.8, 270.5 198, 274.2 189.2 C 275.4 188.4, 277.2 189.2, 277.5 190.5 Z"
            fill={paper}
            strokeWidth="1.65"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </g>
    </svg>
  );
});

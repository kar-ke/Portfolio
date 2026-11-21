import { memo, useRef, useState } from 'react';
import { FileText } from 'lucide-react';
import { PORTFOLIO_COPY } from '../../config/portfolio';
import { FigmaDesignerStage } from './FigmaDesignerStage';
import { MultilingualGreeting } from './MultilingualGreeting';
import { PolaroidPortrait } from './PolaroidPortrait';
import { VisitorCursor } from './VisitorCursor';

interface HeroSectionProps {
  onSayHi: () => void;
  onResumeClick: () => void;
}

export const HeroSection = memo(function HeroSection({
  onSayHi,
  onResumeClick,
}: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const roleTextRef = useRef<HTMLSpanElement>(null);
  const sayHiBtnRef = useRef<HTMLButtonElement>(null);
  const polaroidCaptionRef = useRef<HTMLElement>(null);
  const [polaroidLayerSelected, setPolaroidLayerSelected] = useState(false);

  return (
    <section
      ref={heroRef}
      id="top"
      aria-label="Introduction"
      className="relative w-full min-h-[88svh] lg:min-h-[90vh] flex items-center pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-32 lg:pb-14"
    >
      <div className="relative z-10 w-full max-w-[1140px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-14 sm:gap-16 lg:gap-10 xl:gap-12">
          {/* Left Column — Editorial Composition matching Reference */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div
              className="mb-1 sm:mb-1.5 animate-hero-reveal"
              style={{ animationDelay: '40ms' }}
            >
              <MultilingualGreeting />
            </div>

            <h1
              className="text-[clamp(2.1rem,4.05vw,3.3rem)] font-bold tracking-[-0.036em] leading-[1.1] text-[#111111] [text-wrap:balance] animate-hero-reveal"
              style={{ animationDelay: '130ms' }}
            >
              <span>{PORTFOLIO_COPY.nameHeading}</span>
              <span
                role="img"
                aria-label="waving hand"
                style={{
                  fontFamily:
                    '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
                }}
                className="inline-block ml-2.5 align-[-0.04em] text-[0.88em] leading-none select-none"
              >
                👋
              </span>
            </h1>

            <p
              className="mt-6 sm:mt-7 text-[18px] sm:text-[20px] font-semibold tracking-[-0.02em] leading-[1.35] text-[#1D1D1F] animate-hero-reveal"
              style={{ animationDelay: '220ms' }}
            >
              <span ref={roleTextRef} className="inline-block">
                {PORTFOLIO_COPY.roleHeading}
              </span>
            </p>

            <p
              className="mt-2.5 sm:mt-3 text-[16px] sm:text-[17px] leading-[1.68] tracking-[-0.008em] text-[#515154] max-w-[50ch] font-medium animate-hero-reveal"
              style={{ animationDelay: '300ms' }}
            >
              {PORTFOLIO_COPY.introParagraph}
            </p>

            {/* Primary Hero Pill Actions matching Reference */}
            <div
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3.5 animate-hero-reveal"
              style={{ animationDelay: '380ms' }}
            >
              <button
                ref={sayHiBtnRef}
                type="button"
                onClick={onSayHi}
                data-testid="say-hi-button"
                className={[
                  'inline-flex items-center justify-center gap-2 rounded-full h-[50px] sm:h-[54px] min-w-[160px] sm:min-w-[176px] px-7 sm:px-8',
                  'bg-[#F1F1F3] hover:bg-[#FBE99B] text-[#111111] text-[15px] font-semibold tracking-[-0.01em] whitespace-nowrap shrink-0 cursor-pointer',
                  'hover:shadow-[0_8px_20px_-8px_rgba(234,200,72,0.38)]',
                  'hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.985]',
                  'transition-[background-color,color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                ].join(' ')}
              >
                <span>Say hi</span>
              </button>

              <a
                href={PORTFOLIO_COPY.resumePdfUrl}
                download={PORTFOLIO_COPY.resumeDownloadName}
                onClick={onResumeClick}
                data-testid="resume-download-link"
                className={[
                  'inline-flex items-center justify-center gap-2 rounded-full h-[50px] sm:h-[54px] min-w-[160px] sm:min-w-[176px] px-7 sm:px-8',
                  'bg-[#242426] hover:bg-[#111111] text-white text-[15px] font-semibold tracking-[-0.01em] whitespace-nowrap shrink-0 cursor-pointer',
                  'shadow-[0_4px_14px_-4px_rgba(17,17,17,0.22)] hover:shadow-[0_8px_22px_-6px_rgba(17,17,17,0.28)]',
                  'hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.985]',
                  'transition-[background-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                ].join(' ')}
              >
                <span>Resume</span>
                <FileText className="w-4 h-4 opacity-85" strokeWidth={1.85} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right Column — Right-Tilted Polaroid Portrait with Subtle Parallax */}
          <div
            className="lg:col-span-5 flex justify-center lg:justify-end animate-hero-reveal"
            style={{ animationDelay: '250ms' }}
          >
            <PolaroidPortrait
              captionRef={polaroidCaptionRef}
              isLayerSelected={polaroidLayerSelected}
            />
          </div>
        </div>
      </div>

      {/* Cursor A: Scripted Figma Designer Cursor ("karke") */}
      <FigmaDesignerStage
        heroRef={heroRef}
        roleTextRef={roleTextRef}
        sayHiBtnRef={sayHiBtnRef}
        polaroidCaptionRef={polaroidCaptionRef}
        onPolaroidSelectedChange={setPolaroidLayerSelected}
      />

      {/* Cursor B: Independent Real Visitor Cursor ("you") */}
      <VisitorCursor containerRef={heroRef} />
    </section>
  );
});

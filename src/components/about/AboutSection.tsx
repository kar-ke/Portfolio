import { memo, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { AlignLeft, ListFilter } from 'lucide-react';
import {
  ABOUT_STORY_PARAGRAPHS,
  type AboutReadingMode,
} from '../../config/portfolio';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface ThumbMetrics {
  left: number;
  width: number;
  ready: boolean;
}

export const AboutSection = memo(function AboutSection() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [mode, setMode] = useState<AboutReadingMode>('story');
  const [flowPulseKey, setFlowPulseKey] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const storyBtnRef = useRef<HTMLButtonElement>(null);
  const tldrBtnRef = useRef<HTMLButtonElement>(null);

  const [thumb, setThumb] = useState<ThumbMetrics>({
    left: 4,
    width: 96,
    ready: false,
  });

  const syncThumb = useCallback((targetMode: AboutReadingMode) => {
    const activeBtn =
      targetMode === 'story' ? storyBtnRef.current : tldrBtnRef.current;
    if (!activeBtn) return;

    setThumb({
      left: activeBtn.offsetLeft,
      width: activeBtn.offsetWidth,
      ready: true,
    });
  }, []);

  useLayoutEffect(() => {
    syncThumb(mode);
  }, [mode, syncThumb]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      syncThumb(mode);
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, [mode, syncThumb]);

  const handleSelectMode = (nextMode: AboutReadingMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    if (!prefersReducedMotion) {
      setFlowPulseKey((k) => k + 1);
    }
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const next: AboutReadingMode = mode === 'story' ? 'tldr' : 'story';
      handleSelectMode(next);
      if (next === 'story') {
        storyBtnRef.current?.focus();
      } else {
        tldrBtnRef.current?.focus();
      }
    }
  };

  const isTldr = mode === 'tldr';

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      data-testid="about-section"
      data-reading-mode={mode}
      className="relative w-full scroll-mt-24"
    >
      <div className="w-full max-w-[1140px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="py-16 sm:py-22 lg:py-26">
          <div className="max-w-[780px] mx-auto">
            {/* Header row: About me heading + plain frosted-white rounded liquid toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-9 sm:mb-11">
              <h2
                id="about-heading"
                className="text-[22px] sm:text-[25px] lg:text-[27px] font-bold tracking-[-0.03em] leading-[1.16] text-[#1D1D1F]"
              >
                About me
              </h2>

              {/* Plain frosted-white rounded segmented toggle matching DynamicNavbar */}
              <div
                ref={trackRef}
                role="tablist"
                aria-label="About reading mode"
                data-testid="about-mode-toggle"
                onKeyDown={handleTabKeyDown}
                className={[
                  'relative inline-flex items-center p-1 rounded-full select-none',
                  'bg-[#F1F1F3]/78 backdrop-blur-2xl backdrop-saturate-[160%]',
                  'border border-black/[0.08]',
                  'shadow-[inset_0_1px_2px_rgba(17,17,17,0.04),inset_0_1px_0_rgba(255,255,255,0.85),0_10px_28px_-14px_rgba(29,29,31,0.10),0_2px_6px_rgba(29,29,31,0.04)]',
                ].join(' ')}
              >
                {/* Sliding plain frosted white liquid thumb (zero color tint) */}
                <span
                  aria-hidden="true"
                  data-testid="about-liquid-thumb"
                  style={{
                    width: `${thumb.width}px`,
                    transform: `translate3d(${thumb.left}px, 0, 0)`,
                  }}
                  className={[
                    'pointer-events-none absolute top-1 bottom-1 left-0 rounded-full will-change-[transform,width]',
                    thumb.ready && !prefersReducedMotion
                      ? 'transition-[transform,width] duration-[520ms] ease-[cubic-bezier(0.32,1.18,0.42,1)]'
                      : '',
                  ].join(' ')}
                >
                  <span
                    key={flowPulseKey}
                    className={[
                      'relative block w-full h-full rounded-full overflow-hidden',
                      'bg-white/92 backdrop-blur-xl border border-white/95 ring-1 ring-black/[0.045]',
                      'shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_4px_12px_-2px_rgba(17,17,17,0.10),0_1px_3px_rgba(17,17,17,0.05)]',
                      flowPulseKey > 0 && !prefersReducedMotion
                        ? 'animate-liquid-thumb-flow'
                        : '',
                    ].join(' ')}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-1.5 top-[1px] h-[44%] rounded-full bg-gradient-to-b from-white/90 via-white/30 to-transparent"
                    />
                  </span>
                </span>

                <button
                  ref={storyBtnRef}
                  type="button"
                  role="tab"
                  id="about-tab-story"
                  aria-selected={!isTldr}
                  aria-controls="about-story-panel"
                  data-testid="about-toggle-story"
                  onClick={() => handleSelectMode('story')}
                  className={[
                    'relative z-10 inline-flex items-center justify-center gap-1.5 h-[34px] sm:h-[36px] px-4 rounded-full',
                    'text-[13.5px] tracking-[-0.01em] whitespace-nowrap cursor-pointer',
                    'transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    !isTldr
                      ? 'font-semibold text-[#1D1D1F]'
                      : 'font-medium text-[#7A7A80] hover:text-[#2C2C2E]',
                  ].join(' ')}
                >
                  <AlignLeft
                    className="w-[14px] h-[14px] shrink-0"
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                  <span>Story</span>
                </button>

                <button
                  ref={tldrBtnRef}
                  type="button"
                  role="tab"
                  id="about-tab-tldr"
                  aria-selected={isTldr}
                  aria-controls="about-story-panel"
                  data-testid="about-toggle-tldr"
                  onClick={() => handleSelectMode('tldr')}
                  className={[
                    'relative z-10 inline-flex items-center justify-center gap-1.5 h-[34px] sm:h-[36px] px-4 rounded-full',
                    'text-[13.5px] tracking-[-0.01em] whitespace-nowrap cursor-pointer',
                    'transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    isTldr
                      ? 'font-semibold text-[#1D1D1F]'
                      : 'font-medium text-[#7A7A80] hover:text-[#2C2C2E]',
                  ].join(' ')}
                >
                  <ListFilter
                    className="w-[14px] h-[14px] shrink-0"
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                  <span>TL;DR</span>
                </button>
              </div>
            </div>

            {/* Editorial Story / In-Place TL;DR Prose — Apple soft readable charcoal & default body size */}
            <div
              id="about-story-panel"
              role="tabpanel"
              aria-labelledby={isTldr ? 'about-tab-tldr' : 'about-tab-story'}
              className="space-y-6 text-[16px] sm:text-[17px] leading-[1.72] tracking-[-0.008em] font-medium text-[#424245]"
            >
              {ABOUT_STORY_PARAGRAPHS.map((paragraph) => (
                <p key={paragraph.id}>
                  {paragraph.segments.map((segment, segmentIndex) => {
                    const shouldRedact = isTldr && !segment.keepInTldr;

                    if (segment.keepInTldr) {
                      return (
                        <span
                          key={`${paragraph.id}-${segmentIndex}`}
                          data-tldr-keep="true"
                          className={[
                            'transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                            isTldr ? 'text-[#2C2C2E]' : 'text-[#424245]',
                          ].join(' ')}
                        >
                          {segment.text}
                        </span>
                      );
                    }

                    return (
                      <span
                        key={`${paragraph.id}-${segmentIndex}`}
                        data-tldr-redacted={shouldRedact ? 'true' : 'false'}
                        className={[
                          'story-redact-span',
                          shouldRedact ? 'story-redact-span--struck' : '',
                        ].join(' ')}
                      >
                        {segment.text}
                      </span>
                    );
                  })}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

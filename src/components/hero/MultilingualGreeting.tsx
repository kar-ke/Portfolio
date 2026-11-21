import { useEffect, useState } from 'react';
import { MULTILINGUAL_GREETINGS } from '../../config/portfolio';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export const GREETING_ROTATE_CONFIG = {
  /** Calm, readable dwell duration before rotating to the next greeting. */
  holdMs: 2450,
  /** Smooth 3D bottom-to-top rotate-fade duration. */
  animationDurationMs: 760,
} as const;

export function getNextGreetingIndex(currentIndex: number, total: number): number {
  if (total <= 0) return 0;
  return (currentIndex + 1) % total;
}

interface GreetingSlotState {
  activeIndex: number;
  previousIndex: number | null;
}

export function MultilingualGreeting() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [slot, setSlot] = useState<GreetingSlotState>({
    activeIndex: 0,
    previousIndex: null,
  });
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || isPaused || MULTILINGUAL_GREETINGS.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setSlot((prev) => ({
        previousIndex: prev.activeIndex,
        activeIndex: getNextGreetingIndex(
          prev.activeIndex,
          MULTILINGUAL_GREETINGS.length,
        ),
      }));
    }, GREETING_ROTATE_CONFIG.holdMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPaused, prefersReducedMotion]);

  const activeIndex = prefersReducedMotion
    ? 0
    : slot.activeIndex % MULTILINGUAL_GREETINGS.length;
  const previousIndex = prefersReducedMotion ? null : slot.previousIndex;
  const nextIndex = getNextGreetingIndex(activeIndex, MULTILINGUAL_GREETINGS.length);
  const displayedGreeting = MULTILINGUAL_GREETINGS[activeIndex];

  // Proportionally refined size relative to the hero H1 ("I am Karthikeyan")
  const getTypographyClasses = (langCode: string) => {
    const isLatin = ['en', 'es', 'pt', 'it', 'fr', 'de'].includes(langCode);
    return isLatin
      ? 'font-serif italic text-[21px] sm:text-[24px] lg:text-[27px] tracking-[-0.015em]'
      : 'font-sans font-medium text-[17.5px] sm:text-[20px] lg:text-[22px] tracking-[-0.015em]';
  };

  const handlePauseStart = () => {
    setIsPaused(true);
  };

  const handlePauseEnd = () => {
    setIsPaused(false);
  };

  return (
    <div
      tabIndex={0}
      onPointerEnter={handlePauseStart}
      onPointerLeave={handlePauseEnd}
      onFocus={handlePauseStart}
      onBlur={handlePauseEnd}
      data-testid="multilingual-greeting"
      data-language={displayedGreeting?.language ?? 'English'}
      data-english-version={displayedGreeting?.englishVersion ?? 'hello'}
      data-paused={isPaused ? 'true' : 'false'}
      data-animation="bottom-to-top-rotate-fade"
      className="group relative inline-flex items-center select-none cursor-default rounded-xl pr-1 focus-visible:outline-offset-4"
    >
      <span className="sr-only">
        Hello ({displayedGreeting?.englishVersion})
      </span>

      {/* Pre-mounted GPU-composited 3D bottom-to-top rotate-fade stage */}
      <div className="greeting-rotate-stage relative h-[32px] sm:h-[36px] lg:h-[40px] inline-flex items-center">
        {/* Invisible width mirror keeps hover target & Liquid Glass pill tightly aligned */}
        <span
          aria-hidden="true"
          className={[
            'invisible pointer-events-none leading-none whitespace-nowrap',
            getTypographyClasses(displayedGreeting?.langCode ?? 'en'),
          ].join(' ')}
        >
          {displayedGreeting?.text ?? 'Hello'},
        </span>

        {MULTILINGUAL_GREETINGS.map((item, index) => {
          const isActive = index === activeIndex;
          const isExiting = index === previousIndex;
          const isUpcoming = index === nextIndex;

          const stateClass = isActive
            ? 'greeting-rotate-slot--active'
            : isExiting
              ? 'greeting-rotate-slot--exiting'
              : 'greeting-rotate-slot--waiting';

          const promoteLayer = isActive || isExiting || isUpcoming;

          return (
            <p
              key={item.language}
              aria-hidden="true"
              lang={item.langCode}
              className={[
                'greeting-rotate-slot pointer-events-none absolute left-0 inset-y-0 flex items-center leading-none whitespace-nowrap',
                stateClass,
                promoteLayer ? 'will-change-[transform,opacity]' : '',
                isActive && isPaused ? 'text-[#3A3A3C]' : 'text-[#6E6E73]',
                getTypographyClasses(item.langCode),
              ].join(' ')}
            >
              {item.text},
            </p>
          );
        })}
      </div>

      {/* Dreamy, watery Liquid Glass pill revealing the English reading on hover */}
      <div
        role="status"
        aria-live="polite"
        data-testid="greeting-liquid-pill"
        data-open={isPaused ? 'true' : 'false'}
        className={[
          'pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-20',
          'transition-[opacity,transform,filter] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform,filter]',
          isPaused
            ? 'opacity-100 translate-x-0 scale-100 blur-0'
            : 'opacity-0 -translate-x-2.5 scale-[0.9] blur-[5px]',
        ].join(' ')}
      >
        {/* Dreamy ambient watery halo */}
        <span
          aria-hidden="true"
          className={[
            'pointer-events-none absolute -inset-1.5 rounded-full blur-[9px]',
            'bg-[radial-gradient(ellipse_at_25%_40%,rgba(125,211,252,0.52),transparent_62%),radial-gradient(ellipse_at_78%_60%,rgba(196,181,253,0.42),transparent_65%)]',
            isPaused ? 'animate-liquid-halo' : '',
          ].join(' ')}
        />

        {/* Liquid Glass water-droplet capsule */}
        <div
          className={[
            'relative overflow-hidden inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5',
            'backdrop-blur-2xl backdrop-saturate-[220%]',
            'bg-[linear-gradient(125deg,rgba(255,255,255,0.84)_0%,rgba(224,242,254,0.54)_36%,rgba(237,233,254,0.46)_72%,rgba(255,255,255,0.78)_100%)]',
            'border border-white/90 ring-1 ring-[#38BDF8]/[0.2]',
            'shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.98),inset_0_-3px_8px_rgba(125,211,252,0.38),inset_2px_0_5px_rgba(255,255,255,0.7),0_12px_28px_-8px_rgba(15,23,42,0.14),0_2px_12px_-2px_rgba(56,189,248,0.26)]',
          ].join(' ')}
        >
          {/* Upper liquid meniscus specular highlight */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-1.5 top-[1px] h-[46%] rounded-full bg-gradient-to-b from-white/95 via-white/40 to-transparent"
          />

          {/* Lower internal water-rim bounce light */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-3 bottom-[1px] h-[22%] rounded-full bg-gradient-to-t from-[#BAE6FD]/55 to-transparent blur-[1px]"
          />

          {/* Dreamy slow-drifting watery caustic refraction orb */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-3 rounded-full bg-[radial-gradient(circle_at_28%_35%,rgba(125,211,252,0.48),transparent_55%),radial-gradient(circle_at_76%_65%,rgba(196,181,253,0.4),transparent_58%)] blur-[6px] animate-liquid-caustic"
          />

          {/* Subtle flowing liquid light sheen */}
          <span
            aria-hidden="true"
            className={[
              'pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/65 to-transparent blur-[2px]',
              isPaused ? 'animate-liquid-sheen' : '',
            ].join(' ')}
          />

          <span className="relative z-10 text-[12.5px] font-semibold tracking-[-0.01em] text-[#1D1D1F] whitespace-nowrap">
            {displayedGreeting?.englishVersion}
          </span>
          <span
            aria-hidden="true"
            className="relative z-10 h-[3px] w-[3px] rounded-full bg-[#1D1D1F]/28"
          />
          <span className="relative z-10 text-[11.5px] font-medium tracking-[-0.005em] text-[#515154] whitespace-nowrap">
            {displayedGreeting?.language}
          </span>
        </div>
      </div>
    </div>
  );
}

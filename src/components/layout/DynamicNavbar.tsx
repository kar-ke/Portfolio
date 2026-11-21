import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS, PORTFOLIO_COPY, type NavLinkItem } from '../../config/portfolio';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { type ScrollProgressListener } from '../../hooks/useSmoothScroll';
import {
  computeNavbarWidthPx,
  formatISTTime,
  NAVBAR_WIDTHS,
} from '../../utils/navbarState';

interface DynamicNavbarProps {
  activeLink: NavLinkItem['id'] | null;
  onSelectNavLink: (item: NavLinkItem) => void;
  onOpenContact: () => void;
  onBrandClick: () => void;
  subscribeScrollProgress: (listener: ScrollProgressListener) => () => void;
}

function SoftCloudIcon() {
  return (
    <svg
      width="17"
      height="13"
      viewBox="0 0 20 15"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="nav-cloud-grad" x1="10" y1="1" x2="10" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#D7DCE2" />
        </linearGradient>
      </defs>
      <path
        d="M5.75 13.75H14.5C16.8472 13.75 18.75 11.8472 18.75 9.5C18.75 7.2699 17.0329 5.44123 14.8475 5.26402C14.1292 2.94366 11.9656 1.25 9.40625 1.25C6.28214 1.25 3.75 3.78214 3.75 6.90625C3.75 7.06435 3.75649 7.22096 3.7692 7.37583C2.30956 7.82994 1.25 9.19098 1.25 10.8C1.25 12.4292 2.57076 13.75 4.2 13.75H5.75Z"
        fill="url(#nav-cloud-grad)"
        stroke="#C4CBD4"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const DynamicNavbar = memo(function DynamicNavbar({
  activeLink,
  onSelectNavLink,
  onOpenContact,
  onBrandClick,
  subscribeScrollProgress,
}: DynamicNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [istTime, setIstTime] = useState<string>(() => formatISTTime(new Date()));
  const navBarRef = useRef<HTMLDivElement>(null);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  useEscapeKey(mobileMenuOpen, closeMobileMenu);

  useEffect(() => {
    const updateClock = () => setIstTime(formatISTTime(new Date()));
    updateClock();
    const intervalId = window.setInterval(updateClock, 30_000);
    return () => window.clearInterval(intervalId);
  }, []);

  // Sync bar width directly on DOM inside the smooth scroll rAF loop (zero React re-renders)
  useEffect(() => {
    let lastProgress = -1;
    return subscribeScrollProgress((progress) => {
      if (Math.abs(progress - lastProgress) < 0.0005) return;
      lastProgress = progress;

      const el = navBarRef.current;
      if (!el) return;

      const widthPx = computeNavbarWidthPx(progress, NAVBAR_WIDTHS);
      el.style.maxWidth = `${widthPx}px`;
      el.dataset.progress = progress.toFixed(3);
      el.dataset.compact = progress >= 0.5 ? 'true' : 'false';
    });
  }, [subscribeScrollProgress]);

  const handleLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    item: NavLinkItem,
  ) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    onSelectNavLink(item);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex flex-col items-center pointer-events-none px-4 sm:px-6">
      <div
        ref={navBarRef}
        data-testid="dynamic-navbar"
        data-compact="false"
        data-progress="0.000"
        style={{ maxWidth: `${NAVBAR_WIDTHS.expandedPx}px` }}
        className={[
          'pointer-events-auto mt-4 w-full h-[54px] sm:h-[58px] pl-5 pr-2.5 sm:pl-5 sm:pr-2.5 rounded-full',
          'bg-white/74 backdrop-blur-2xl backdrop-saturate-[180%] border border-black/[0.08]',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_14px_36px_-14px_rgba(29,29,31,0.13),0_2px_8px_rgba(29,29,31,0.05)]',
          'flex items-center justify-between gap-3 sm:gap-5 will-change-[max-width]',
        ].join(' ')}
      >
        {/* Zone 1: Brand Wordmark + Live IST Clock & Weather Capsule */}
        <div className="flex items-center justify-start gap-2.5 sm:gap-3 min-w-0 shrink-0">
          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              setMobileMenuOpen(false);
              onBrandClick();
            }}
            className="text-[15.5px] sm:text-[16px] font-bold tracking-[-0.03em] text-[#111111] whitespace-nowrap shrink-0 rounded-full py-1 transition-opacity duration-200 hover:opacity-75"
          >
            {PORTFOLIO_COPY.brandName}
          </a>

          <div
            aria-label={`Local time ${istTime} IST, 22 degrees Celsius`}
            className="hidden sm:inline-flex items-center h-[30px] px-2.5 gap-2 text-[12px] rounded-full bg-black/[0.035] border border-black/[0.06] whitespace-nowrap shrink-0 select-none"
          >
            <span className="inline-flex items-baseline gap-1 tabular-nums">
              <span className="font-semibold text-[#1D1D1F]">{istTime}</span>
              <span className="font-medium text-[#7A7A80]">IST</span>
            </span>

            <span
              aria-hidden="true"
              className="h-3.5 w-px bg-black/[0.1]"
            />

            <span className="inline-flex items-center gap-1.5 tabular-nums font-semibold text-[#1D1D1F]">
              <SoftCloudIcon />
              <span>22°</span>
            </span>
          </div>
        </div>

        {/* Zone 2: Center Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center justify-center gap-0.5 sm:gap-1"
        >
          {NAV_LINKS.map((item) => {
            const isActive = activeLink === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(event) => handleLinkClick(event, item)}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'rounded-full px-3.5 py-1.5 text-[14px] font-medium whitespace-nowrap shrink-0',
                  'transition-[background-color,color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  isActive
                    ? 'bg-black/[0.065] text-[#111111]'
                    : 'text-[#2C2C2E] hover:bg-black/[0.055] hover:text-[#111111]',
                ].join(' ')}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Right Concentric Pill CTA + Mobile Menu Disclosure */}
        <div className="flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full text-[#111111] hover:bg-black/[0.055] transition-colors duration-150"
          >
            {mobileMenuOpen ? (
              <X className="w-[18px] h-[18px]" strokeWidth={1.85} aria-hidden="true" />
            ) : (
              <Menu className="w-[18px] h-[18px]" strokeWidth={1.85} aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenContact();
            }}
            className={[
              'inline-flex items-center justify-center h-[36px] sm:h-[38px] px-4 sm:px-5 text-[13px] sm:text-[13.5px]',
              'rounded-full bg-[#111111] text-white font-semibold tracking-[-0.01em] whitespace-nowrap shrink-0 cursor-pointer',
              'hover:bg-black hover:-translate-y-[0.5px] active:translate-y-0',
              'transition-[background-color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
              'shadow-[0_2px_6px_rgba(0,0,0,0.14)] hover:shadow-[0_6px_16px_rgba(17,17,17,0.22)]',
            ].join(' ')}
          >
            {PORTFOLIO_COPY.ctaLabel}
          </button>
        </div>
      </div>

      {/* Mobile Dynamic Island Expanded Menu Panel */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav-panel"
          aria-label="Mobile navigation"
          className="md:hidden pointer-events-auto mt-2.5 w-full max-w-[360px] rounded-3xl bg-white/86 backdrop-blur-2xl backdrop-saturate-[180%] border border-black/[0.08] shadow-[0_16px_40px_-12px_rgba(29,29,31,0.16)] p-2 animate-sheet-reveal"
        >
          <ul className="flex flex-col gap-0.5">
            {NAV_LINKS.map((item) => {
              const isActive = activeLink === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(event) => handleLinkClick(event, item)}
                    aria-current={isActive ? 'page' : undefined}
                    className={[
                      'flex items-center justify-between min-h-[44px] px-4 rounded-2xl text-[15px] font-medium transition-colors duration-150',
                      isActive
                        ? 'bg-black/[0.06] text-[#111111]'
                        : 'text-[#3A3A3C] hover:bg-black/[0.045] hover:text-[#111111]',
                    ].join(' ')}
                  >
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
});

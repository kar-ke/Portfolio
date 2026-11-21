/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { AboutSection } from './components/about/AboutSection';
import { HeroSection } from './components/hero/HeroSection';
import { DynamicNavbar } from './components/layout/DynamicNavbar';
import { OtherWorldTransitionSection } from './components/other-world/OtherWorldTransitionSection';
import { SelectedWorkSection } from './components/work/SelectedWorkSection';
import { type NavLinkItem } from './config/portfolio';
import { useSmoothScroll } from './hooks/useSmoothScroll';

// Loaded on demand when the visitor opens the contact modal
const ContactSheet = lazy(() => import('./components/layout/ContactSheet'));

export default function App() {
  const [activeNav, setActiveNav] = useState<NavLinkItem['id'] | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [hobbiesModalOpen, setHobbiesModalOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimerRef = useRef<number | null>(null);

  // Pause inertial wheel capture whenever any modal/dialog is open
  const smoothScroll = useSmoothScroll(contactOpen || projectModalOpen || hobbiesModalOpen);

  const showNotice = useCallback((message: string) => {
    setNotice(message);
    if (noticeTimerRef.current) {
      window.clearTimeout(noticeTimerRef.current);
    }
    noticeTimerRef.current = window.setTimeout(() => {
      setNotice(null);
      noticeTimerRef.current = null;
    }, 2800);
  }, []);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) {
        window.clearTimeout(noticeTimerRef.current);
      }
    };
  }, []);

  const handleOpenContact = useCallback(() => setContactOpen(true), []);
  const handleCloseContact = useCallback(() => setContactOpen(false), []);

  const handleSelectNavLink = useCallback(
    (item: NavLinkItem) => {
      setActiveNav(item.id);
      if (item.id === 'about' || item.id === 'work') {
        const sectionEl = document.getElementById(item.id);
        if (sectionEl) {
          const targetY = Math.max(
            0,
            sectionEl.getBoundingClientRect().top + window.scrollY - 76,
          );
          smoothScroll.scrollToY(targetY);
          return;
        }
      }
      showNotice(`${item.label} section is planned for the next iteration.`);
    },
    [showNotice, smoothScroll],
  );

  const handleBrandClick = useCallback(() => {
    setActiveNav(null);
    smoothScroll.scrollToY(0);
  }, [smoothScroll]);

  const handleResumeClick = useCallback(() => {
    showNotice('Downloading resume PDF…');
  }, [showNotice]);

  return (
    <div className="min-h-screen bg-[#FCFCFB] text-[#111111] flex flex-col">
      <DynamicNavbar
        activeLink={activeNav}
        onSelectNavLink={handleSelectNavLink}
        onOpenContact={handleOpenContact}
        onBrandClick={handleBrandClick}
        subscribeScrollProgress={smoothScroll.subscribe}
      />

      <main className="flex-1">
        <HeroSection
          onSayHi={handleOpenContact}
          onResumeClick={handleResumeClick}
        />

        <SelectedWorkSection onProjectModalChange={setProjectModalOpen} />

        <OtherWorldTransitionSection
          subscribeScrollProgress={smoothScroll.subscribe}
          onModalOpenChange={setHobbiesModalOpen}
        />

        <AboutSection />

        <footer className="w-full max-w-[1140px] mx-auto px-6 sm:px-10 lg:px-12">
          <div className="border-t border-black/[0.06] py-10 sm:py-12 flex items-center justify-between text-[13px] text-[#86868B]">
            <span>© {new Date().getFullYear()} Karthikeyan</span>
            <button
              type="button"
              onClick={handleBrandClick}
              className="inline-flex items-center gap-1.5 text-[#515154] hover:text-[#111111] transition-colors cursor-pointer py-1"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </footer>
      </main>

      {contactOpen && (
        <Suspense fallback={null}>
          <ContactSheet open={contactOpen} onClose={handleCloseContact} />
        </Suspense>
      )}

      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4"
      >
        {notice && (
          <div className="pointer-events-auto rounded-full bg-[#1D1D1F]/92 backdrop-blur-md text-white text-[13px] font-medium px-4 py-2.5 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.28)] animate-sheet-reveal">
            {notice}
          </div>
        )}
      </div>
    </div>
  );
}

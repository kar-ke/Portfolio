import { memo, useCallback, useEffect, useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import {
  HOBBY_FOLDERS,
  OTHER_WORLD_COPY,
  type HobbyCardVisual,
  type HobbyFolderId,
  type HobbySnapshotCard,
} from '../../config/hobbies';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface OtherWorldHobbiesProps {
  onModalOpenChange?: (open: boolean) => void;
}

export const OtherWorldHobbies = memo(function OtherWorldHobbies({
  onModalOpenChange,
}: OtherWorldHobbiesProps) {
  const [activeFolderId, setActiveFolderId] = useState<HobbyFolderId>('sketch-arts');
  const [activeCard, setActiveCard] = useState<HobbySnapshotCard | null>(null);

  const activeFolder =
    HOBBY_FOLDERS.find((folder) => folder.id === activeFolderId) ?? HOBBY_FOLDERS[0];

  const closeCardModal = useCallback(() => setActiveCard(null), []);
  useEscapeKey(activeCard !== null, closeCardModal);

  useEffect(() => {
    onModalOpenChange?.(activeCard !== null);
  }, [activeCard, onModalOpenChange]);

  const handleFolderKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const next = HOBBY_FOLDERS[(index + 1) % HOBBY_FOLDERS.length];
      setActiveFolderId(next.id);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const prev = HOBBY_FOLDERS[(index - 1 + HOBBY_FOLDERS.length) % HOBBY_FOLDERS.length];
      setActiveFolderId(prev.id);
    }
  };

  return (
    <div
      data-testid="other-world-hobbies"
      className="w-full max-w-[920px] mx-auto px-6 sm:px-10 flex flex-col items-center text-center"
    >
      {/* Editorial Headline + Monochrome Handwritten Accent */}
      <h2 className="text-[24px] sm:text-[32px] lg:text-[36px] font-bold tracking-[-0.03em] leading-[1.18] text-[#1D1D1F] [text-wrap:balance]">
        {OTHER_WORLD_COPY.hobbiesHeading}
      </h2>
      <p className="mt-1 sm:mt-1.5 font-[family-name:var(--font-handwriting)] text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.08] font-semibold text-[#515154]">
        {OTHER_WORLD_COPY.hobbiesAccent}
      </p>

      {/* 3 Interactive Hand-Drawn Monochrome Folder Tabs matching Frames 6–7 */}
      <div
        role="tablist"
        aria-label="Personal hobbies"
        className="mt-7 sm:mt-9 grid grid-cols-3 gap-4 sm:gap-9 lg:gap-12 items-start justify-items-center w-full max-w-[540px]"
      >
        {HOBBY_FOLDERS.map((folder, index) => {
          const isSelected = folder.id === activeFolder.id;
          return (
            <button
              key={folder.id}
              type="button"
              role="tab"
              id={`hobby-tab-${folder.id}`}
              aria-selected={isSelected}
              aria-controls={`hobby-panel-${folder.id}`}
              data-testid={`hobby-folder-${folder.id}`}
              onClick={() => setActiveFolderId(folder.id)}
              onKeyDown={(event) => handleFolderKeyDown(event, index)}
              className={[
                'group flex flex-col items-center text-center cursor-pointer rounded-xl px-2 py-1.5',
                'transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D1D1F]',
                isSelected ? 'opacity-100 -translate-y-0.5' : 'opacity-45 hover:opacity-80',
              ].join(' ')}
            >
              <HandDrawnFolderIcon active={isSelected} />
              <span
                className={[
                  'mt-2.5 text-[12px] sm:text-[13.5px] leading-snug tracking-[-0.01em] transition-colors',
                  isSelected ? 'font-bold text-[#1D1D1F]' : 'font-medium text-[#515154]',
                ].join(' ')}
              >
                <span className="text-[#1D1D1F] mr-0.5">*</span>
                {folder.label}
              </span>
              <span
                className={[
                  'mt-1 text-[10.5px] sm:text-[11.5px] leading-[1.35] text-[#6E6E73] max-w-[14ch] transition-opacity duration-300',
                  isSelected ? 'opacity-100' : 'opacity-0 pointer-events-none select-none',
                ].join(' ')}
              >
                {folder.helperNote}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tilted Editorial Monochrome Snapshot Strip for the Active Folder */}
      <div
        role="tabpanel"
        id={`hobby-panel-${activeFolder.id}`}
        aria-labelledby={`hobby-tab-${activeFolder.id}`}
        data-testid={`hobby-panel-${activeFolder.id}`}
        className="mt-7 sm:mt-10 grid grid-cols-3 gap-3 sm:gap-6 lg:gap-7 w-full max-w-[760px]"
      >
        {activeFolder.cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => setActiveCard(card)}
            data-testid={`hobby-card-${card.id}`}
            style={{ transform: `rotate(${card.tiltDeg}deg)` }}
            className={[
              'group relative w-full text-left rounded-[12px] sm:rounded-[16px] bg-white p-1.5 sm:p-2.5',
              'border border-black/[0.08] shadow-[0_14px_30px_-18px_rgba(17,17,17,0.22)]',
              'transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
              'hover:scale-[1.03] hover:-translate-y-1.5 hover:shadow-[0_22px_40px_-18px_rgba(17,17,17,0.28)]',
              'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D1D1F]',
            ].join(' ')}
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[8px] sm:rounded-[11px] border border-black/[0.06]">
              <HobbyCardArtwork visual={card.visual} />
            </div>
            <div className="pt-2 pb-0.5 px-1 flex items-center justify-between gap-1">
              <span className="text-[11px] sm:text-[12.5px] font-semibold tracking-[-0.015em] text-[#1D1D1F] truncate">
                {card.title}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-medium text-[#6E6E73] shrink-0">
                {card.tag}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Preview Modal when clicking any personal snapshot card */}
      {activeCard && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="hobby-modal-title"
          data-testid="hobby-card-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-sm text-left"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setActiveCard(null);
            }
          }}
        >
          <div className="relative w-full max-w-[520px] rounded-[24px] bg-white border border-black/[0.08] shadow-[0_32px_80px_-24px_rgba(17,17,17,0.32)] p-5 sm:p-7 animate-sheet-reveal">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11.5px] font-semibold tracking-[0.06em] uppercase text-[#6E6E73]">
                  {activeCard.tag}
                </span>
                <h3
                  id="hobby-modal-title"
                  className="mt-1 text-[20px] sm:text-[22px] font-bold tracking-[-0.025em] text-[#1D1D1F]"
                >
                  {activeCard.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCard(null)}
                aria-label="Close hobby preview"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F1F1F3] hover:bg-[#E5E5EA] text-[#1D1D1F] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 w-full aspect-[4/3] overflow-hidden rounded-[14px] border border-black/[0.06]">
              <HobbyCardArtwork visual={activeCard.visual} />
            </div>

            <p className="mt-4 text-[15px] leading-[1.64] font-normal text-[#4B4B4F]">
              {activeCard.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

function HandDrawnFolderIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 84 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-[54px] h-[42px] sm:w-[68px] sm:h-[54px]"
    >
      {/* Back folder tab */}
      <path
        d="M8 18 C8 12.5 11.5 9.5 17 9.5 L31 9.5 C34.5 9.5 36.8 11.2 38.6 14 L41 17.5 L69 17.5 C74 17.5 77 20.8 77 25.5 L77 29"
        stroke={active ? '#1D1D1F' : '#86868B'}
        strokeWidth={active ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Front folder body */}
      <path
        d="M7 25 C7 21.5 9.8 19 13.5 19 L71.5 19 C75.2 19 77.8 21.6 77.4 25.2 L75.2 52.5 C74.8 56.5 71.8 59 67.6 59 L16.2 59 C12 59 9 56.4 8.6 52.5 Z"
        fill={active ? '#FFFFFF' : '#F5F5F4'}
        stroke={active ? '#1D1D1F' : '#86868B'}
        strokeWidth={active ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Subtle monochrome sheet edge peeking out when active */}
      {active && (
        <path
          d="M17 15.5 L34 15.5"
          stroke="#1D1D1F"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function HobbyCardArtwork({ visual }: { visual: HobbyCardVisual }) {
  switch (visual) {
    case 'pencil-study':
      return (
        <div className="h-full w-full bg-[#F4F4F3] flex items-center justify-center p-3">
          <svg viewBox="0 0 180 120" className="w-full h-full" fill="none" aria-hidden="true">
            <rect x="14" y="12" width="152" height="96" rx="8" fill="#FFFFFF" stroke="#1D1D1F" strokeOpacity="0.14" />
            <circle cx="72" cy="58" r="24" stroke="#1D1D1F" strokeWidth="1.6" />
            <path d="M56 76 C65 64 82 64 92 78" stroke="#1D1D1F" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M108 38 L148 38 M108 50 L142 50 M108 62 L134 62" stroke="#515154" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M110 84 L144 74" stroke="#1D1D1F" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'sketchbook-spread':
      return (
        <div className="h-full w-full bg-[#EFEFEE] flex items-center justify-center p-3">
          <svg viewBox="0 0 180 120" className="w-full h-full" fill="none" aria-hidden="true">
            <rect x="18" y="16" width="68" height="88" rx="6" fill="#FFFFFF" stroke="#1D1D1F" strokeWidth="1.5" />
            <rect x="94" y="16" width="68" height="88" rx="6" fill="#FFFFFF" stroke="#1D1D1F" strokeWidth="1.5" />
            <rect x="30" y="30" width="44" height="24" rx="5" stroke="#1D1D1F" strokeWidth="1.6" />
            <path d="M30 66 L70 66 M30 76 L60 76" stroke="#86868B" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="128" cy="54" r="16" stroke="#1D1D1F" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M114 82 L144 82" stroke="#3A3A3E" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'poster-doodle':
      return (
        <div className="h-full w-full bg-[#ECECEB] flex items-center justify-center p-3">
          <svg viewBox="0 0 180 120" className="w-full h-full" fill="none" aria-hidden="true">
            <rect x="28" y="12" width="124" height="96" rx="8" fill="#1D1D1F" />
            <circle cx="122" cy="40" r="14" fill="#FCFCFB" fillOpacity="0.92" />
            <path d="M44 46 L94 46 M44 62 L112 62 M44 78 L86 78" stroke="#FCFCFB" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M108 82 L134 82" stroke="#A1A1A6" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'golden-hour-street':
      return (
        <div className="h-full w-full bg-gradient-to-b from-[#F4F4F3] via-[#DFDFDD] to-[#A1A1A6] relative overflow-hidden">
          <div className="absolute right-6 top-4 h-10 w-10 rounded-full bg-white/95 shadow-[0_0_24px_rgba(255,255,255,0.9)]" />
          <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[#1D1D1F]/90" />
          <div className="absolute left-5 bottom-[42%] w-10 h-14 bg-[#3A3A3E]/85 rounded-t-xs" />
          <div className="absolute left-18 bottom-[42%] w-12 h-20 bg-[#1D1D1F]/90 rounded-t-xs" />
          <div className="absolute right-8 bottom-[42%] w-11 h-16 bg-[#2C2C2E]/85 rounded-t-xs" />
        </div>
      );
    case 'monochrome-shadow':
      return (
        <div className="h-full w-full bg-gradient-to-br from-[#F2F2F2] via-[#D8D8DC] to-[#1D1D1F] relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(125deg,transparent_44%,rgba(17,17,17,0.82)_44.5%,rgba(17,17,17,0.82)_62%,transparent_62.5%)]" />
          <div className="absolute bottom-3 left-3 h-5 w-5 rounded-full border-2 border-white/80" />
        </div>
      );
    case 'window-light':
      return (
        <div className="h-full w-full bg-[#EAEAE8] relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white/90 to-transparent" />
          <div className="absolute top-3 left-4 w-16 h-20 border border-[#1D1D1F]/20 rounded-sm grid grid-cols-2 grid-rows-2 gap-1 p-1 bg-white/70">
            <span className="bg-[#D4D4D8]/60 rounded-[2px]" />
            <span className="bg-[#E4E4E7]/70 rounded-[2px]" />
            <span className="bg-[#F4F4F5] rounded-[2px]" />
            <span className="bg-[#F4F4F5] rounded-[2px]" />
          </div>
        </div>
      );
    case 'stage-rehearsal':
      return (
        <div className="h-full w-full bg-gradient-to-br from-[#18181A] via-[#262629] to-[#111112] relative overflow-hidden flex items-center justify-center">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-white/15 blur-xl" />
          <svg viewBox="0 0 180 120" className="w-full h-full relative" fill="none" aria-hidden="true">
            <path d="M22 86 Q60 44 94 74 T160 42" stroke="#E5E5EA" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M22 96 Q64 56 98 84 T160 54" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="94" cy="74" r="4.5" fill="#FFFFFF" />
          </svg>
        </div>
      );
    case 'playlist-groove':
      return (
        <div className="h-full w-full bg-[#F2F2F1] flex items-center justify-center p-3">
          <div className="w-full h-full rounded-[8px] bg-white border border-black/[0.06] p-3 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <span className="h-7 w-7 rounded-full bg-[#1D1D1F] inline-flex items-center justify-center">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FCFCFB]" />
              </span>
              <div className="space-y-1 flex-1">
                <div className="h-2 w-2/3 rounded-full bg-[#1D1D1F]/80" />
                <div className="h-1.5 w-1/2 rounded-full bg-[#86868B]/50" />
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-8">
              {[35, 70, 52, 92, 60, 82, 45, 74, 50].map((h, idx) => (
                <span
                  key={idx}
                  style={{ height: `${h}%` }}
                  className={idx % 3 === 0 ? 'flex-1 rounded-full bg-[#1D1D1F]' : 'flex-1 rounded-full bg-[#D1D1D6]'}
                />
              ))}
            </div>
          </div>
        </div>
      );
    case 'studio-motion':
      return (
        <div className="h-full w-full bg-[#F4F4F3] flex items-center justify-center p-3">
          <svg viewBox="0 0 180 120" className="w-full h-full" fill="none" aria-hidden="true">
            <circle cx="56" cy="62" r="22" stroke="#1D1D1F" strokeOpacity="0.2" strokeWidth="1.5" />
            <circle cx="88" cy="62" r="22" stroke="#1D1D1F" strokeOpacity="0.48" strokeWidth="1.7" />
            <circle cx="120" cy="62" r="22" stroke="#1D1D1F" strokeWidth="2.2" fill="#1D1D1F" fillOpacity="0.06" />
          </svg>
        </div>
      );
  }
}

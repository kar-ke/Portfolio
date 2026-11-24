import { memo } from 'react';
import type { ProjectThumbnailVariant } from '../../config/portfolio';

interface ProjectThumbnailFrameProps {
  variant: ProjectThumbnailVariant;
}

/** Fixed-size showcase container framing each project preview with reference 34px radius and crisp hairline border. */
export const ProjectThumbnailFrame = memo(function ProjectThumbnailFrame({
  variant,
}: ProjectThumbnailFrameProps) {
  const surfaceGradient: Record<ProjectThumbnailVariant, string> = {
    getset11: 'bg-gradient-to-b from-[#FFFFFF] via-[#FFFDF8] to-[#FDF3DC]',
    sciflare: 'bg-gradient-to-b from-[#FFFFFF] via-[#FAF9FF] to-[#EFEBFD]',
    invictus11: 'bg-gradient-to-b from-[#FFFFFF] via-[#F6FDFB] to-[#E6F6F1]',
    deductiveclouds: 'bg-gradient-to-b from-[#FFFFFF] via-[#F7FAFF] to-[#E9F1FE]',
  };

  return (
    <div
      data-testid={`project-thumbnail-${variant}`}
      className={[
        'relative w-full max-w-[560px] h-[250px] sm:w-[560px] sm:h-[392px] shrink-0 select-none overflow-hidden',
        'rounded-[34px] border border-black/[0.08]',
        surfaceGradient[variant],
        'transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'group-hover:-translate-y-1',
      ].join(' ')}
    >
      {variant === 'getset11' && <GetSet11Preview />}
      {variant === 'sciflare' && <SciflarePreview />}
      {variant === 'invictus11' && <Invictus11Preview />}
      {variant === 'deductiveclouds' && <DeductiveCloudsPreview />}
    </div>
  );
});

/** GetSet11 — Dual top-cropped mobile previews (contest lobby + multi-currency wallet). */
function GetSet11Preview() {
  return (
    <div className="absolute inset-0 flex items-start justify-center gap-2.5 sm:gap-5 px-4 sm:px-9 pb-4 sm:pb-7">
      {/* Left Phone — Fantasy Football Contests */}
      <div className="w-[46%] sm:w-[45%] h-[91%] -mt-[2px] rounded-b-[20px] sm:rounded-b-[32px] bg-[#161618] px-[3.5px] pb-[3.5px] sm:px-[5px] sm:pb-[5px] shadow-[0_14px_28px_-14px_rgba(17,17,17,0.35)]">
        <div className="h-full w-full overflow-hidden rounded-b-[17px] sm:rounded-b-[27px] bg-[#FAF8F4] flex flex-col justify-between p-2 sm:p-3.5">
          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[8px] sm:text-[11px] font-bold tracking-[-0.02em] text-[#1D1D1F] truncate">
                Matchday Contests
              </span>
              <span className="rounded-full bg-[#111827] px-1.5 py-0.5 text-[6px] sm:text-[8px] font-semibold text-white shrink-0">
                LIVE
              </span>
            </div>

            {/* League filter chips */}
            <div className="mt-1.5 sm:mt-2 grid grid-cols-4 gap-1 sm:gap-1.5">
              {['EPL', 'UCL', 'LaLiga', 'Cup'].map((league, idx) => (
                <div
                  key={league}
                  className={[
                    'rounded-[5px] sm:rounded-[7px] py-0.5 sm:py-1 text-center text-[6px] sm:text-[8px] font-semibold truncate',
                    idx === 0
                      ? 'bg-[#1D1D1F] text-white'
                      : 'bg-white border border-black/[0.06] text-[#515154]',
                  ].join(' ')}
                >
                  {league}
                </div>
              ))}
            </div>

            {/* Featured match cards */}
            <div className="mt-2 sm:mt-2.5 grid grid-cols-2 gap-1.5 sm:gap-2">
              <div className="rounded-[8px] sm:rounded-[10px] bg-gradient-to-br from-[#1B3A2F] to-[#0E241C] p-1.5 sm:p-2 text-white">
                <div className="text-[5.5px] sm:text-[7.5px] uppercase tracking-[0.04em] text-emerald-200/80 truncate">
                  Mega Pool
                </div>
                <div className="mt-0.5 sm:mt-1 text-[8px] sm:text-[12px] font-bold leading-tight">
                  ARS vs MCI
                </div>
                <div className="mt-1 sm:mt-1.5 inline-block rounded-full bg-white/15 px-1.5 py-0.5 text-[6px] sm:text-[7px] font-semibold">
                  £25,000
                </div>
              </div>
              <div className="rounded-[8px] sm:rounded-[10px] bg-white border border-black/[0.06] p-1.5 sm:p-2 shadow-[0_2px_6px_rgba(0,0,0,0.03)]">
                <div className="text-[5.5px] sm:text-[7.5px] font-medium text-[#6E6E73] truncate">
                  H2H League
                </div>
                <div className="mt-0.5 sm:mt-1 text-[8px] sm:text-[11px] font-bold text-[#1D1D1F] leading-tight">
                  LIV vs CHE
                </div>
                <div className="mt-1 sm:mt-1.5 flex items-center justify-between">
                  <span className="text-[6.5px] sm:text-[7.5px] font-bold text-[#15803D]">
                    £15
                  </span>
                  <span className="h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-emerald-100 text-emerald-700 inline-flex items-center justify-center text-[7px] sm:text-[8px] font-bold">
                    +
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Explore CTA */}
          <div className="rounded-[7px] sm:rounded-[8px] bg-[#EFE9DD] py-1 sm:py-1.5 text-center text-[7px] sm:text-[9px] font-semibold text-[#1D1D1F]">
            Explore 12 Flows →
          </div>
        </div>
      </div>

      {/* Right Phone — Multi-Currency Wallet & Payouts */}
      <div className="w-[46%] sm:w-[45%] h-[91%] -mt-[2px] rounded-b-[20px] sm:rounded-b-[32px] bg-[#161618] px-[3.5px] pb-[3.5px] sm:px-[5px] sm:pb-[5px] shadow-[0_14px_28px_-14px_rgba(17,17,17,0.35)]">
        <div className="h-full w-full overflow-hidden rounded-b-[17px] sm:rounded-b-[27px] bg-white flex flex-col justify-between p-2 sm:p-3.5">
          <div>
            <div className="text-[7.5px] sm:text-[10px] font-bold tracking-[-0.02em] text-[#1D1D1F] truncate">
              Smart Multi-Currency Wallet
            </div>

            {/* Balance hero card */}
            <div className="mt-1.5 sm:mt-2 rounded-[9px] sm:rounded-[12px] bg-gradient-to-br from-[#0F2F4A] via-[#134E4A] to-[#0F172A] p-2 sm:p-3 text-white">
              <div className="flex items-center justify-between gap-1 text-[6px] sm:text-[8px] text-white/75">
                <span className="truncate">Winnings</span>
                <span className="rounded-full bg-white/15 px-1.5 py-0.5 font-semibold text-white shrink-0">
                  GBP · EUR
                </span>
              </div>
              <div className="mt-1 text-[11px] sm:text-[16px] font-bold tracking-[-0.03em]">
                £4,280.50
              </div>
              <div className="mt-1.5 sm:mt-2 grid grid-cols-2 gap-1 sm:gap-1.5">
                <div className="rounded-[5px] sm:rounded-[6px] bg-white/15 px-1.5 py-0.5 sm:py-1 text-[5.5px] sm:text-[7.5px]">
                  <span className="block text-white/65 truncate">Rake Fee</span>
                  <span className="font-semibold truncate block">5% Flat</span>
                </div>
                <div className="rounded-[5px] sm:rounded-[6px] bg-white/15 px-1.5 py-0.5 sm:py-1 text-[5.5px] sm:text-[7.5px]">
                  <span className="block text-white/65 truncate">Payout</span>
                  <span className="font-semibold text-emerald-300 truncate block">Verified</span>
                </div>
              </div>
            </div>

            {/* Breakdown row (desktop/tablet) */}
            <div className="hidden sm:flex mt-2 rounded-[9px] bg-[#F7F7F9] border border-black/[0.04] px-2 py-1.5 items-center justify-between">
              <div>
                <div className="text-[8.5px] font-semibold text-[#1D1D1F]">
                  Prize Split · Tier 1
                </div>
                <div className="text-[7.5px] text-[#6E6E73]">
                  Auto-settled · 0.00 hidden fee
                </div>
              </div>
              <span className="text-[9px] font-bold text-[#15803D]">+£620</span>
            </div>
          </div>

          {/* Bottom nav bar */}
          <div className="grid grid-cols-4 gap-0.5 sm:gap-1 rounded-[8px] sm:rounded-[10px] bg-[#F4F5F7] p-0.5 sm:p-1">
            {['Home', 'Leagues', 'Wallet', 'Profile'].map((tab, idx) => (
              <div
                key={tab}
                className={[
                  'rounded-[6px] sm:rounded-[7px] py-0.5 sm:py-1 text-center text-[5.5px] sm:text-[7.5px] font-semibold truncate',
                  idx === 2 ? 'bg-white text-[#1D1D1F] shadow-xs' : 'text-[#76767B]',
                ].join(' ')}
              >
                {tab}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Sciflare — Sports API Monitoring Dashboard + Krazy11 white-label companion card.
 */
function SciflarePreview() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full h-full flex items-end gap-3 sm:gap-4">
        {/* Main Browser Window — API Monitoring Dashboard */}
        <div className="flex-1 h-[92%] rounded-[16px] sm:rounded-[20px] bg-white border border-black/[0.08] shadow-[0_14px_30px_-16px_rgba(37,25,112,0.22)] overflow-hidden flex flex-col">
          {/* Top chrome */}
          <div className="px-3 sm:px-4 py-2 border-b border-black/[0.05] bg-[#FAFAFC] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#E5E5EA]" />
              <span className="h-2 w-2 rounded-full bg-[#E5E5EA]" />
              <span className="h-2 w-2 rounded-full bg-[#E5E5EA]" />
            </div>
            <span className="text-[7.5px] sm:text-[8.5px] font-semibold text-[#5B47E0] tracking-[0.04em]">
              SCIFLARE SPORTS API
            </span>
            <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[7px] font-semibold text-emerald-700">
              99.98% UP
            </span>
          </div>

          {/* Dashboard Body */}
          <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Client Retention', value: '+20%', accent: 'text-[#5B47E0]' },
                { label: 'Avg Latency', value: '42ms', accent: 'text-[#1D1D1F]' },
                { label: 'Live Feeds', value: '1.4M', accent: 'text-[#1D1D1F]' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[9px] bg-[#F7F7FA] border border-black/[0.04] p-2"
                >
                  <div className="text-[6.5px] sm:text-[7.5px] text-[#6E6E73]">{stat.label}</div>
                  <div className={`mt-0.5 text-[11px] sm:text-[13px] font-bold ${stat.accent}`}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Smooth latency bar chart */}
            <div className="rounded-[10px] bg-[#FAF9FF] border border-[#5B47E0]/10 p-2.5 sm:p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[7.5px] sm:text-[8.5px] font-semibold text-[#1D1D1F]">
                  Live Match Feed Throughput
                </span>
                <span className="text-[7px] font-medium text-[#5B47E0]">Realtime</span>
              </div>
              <div className="flex items-end gap-1 sm:gap-1.5 h-12 sm:h-16">
                {[38, 52, 46, 70, 62, 84, 78, 92, 86, 95, 76, 88].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={[
                      'flex-1 rounded-t-[4px]',
                      i >= 7
                        ? 'bg-gradient-to-t from-[#5B47E0] to-[#8B7CF6]'
                        : 'bg-[#DCD8FA]',
                    ].join(' ')}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Companion Mobile Card — Krazy11 White-Label App */}
        <div className="hidden sm:flex w-[30%] h-[84%] rounded-[20px] bg-[#161618] p-[4px] shadow-[0_14px_28px_-14px_rgba(17,17,17,0.32)]">
          <div className="h-full w-full rounded-[16px] bg-white p-2.5 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="mx-auto h-1.5 w-8 rounded-full bg-[#161618]/80 mb-2" />
              <div className="text-[8px] font-bold text-[#5B47E0]">Krazy11</div>
              <div className="mt-1.5 rounded-[8px] bg-[#F4F2FF] p-2">
                <div className="text-[7px] font-semibold text-[#1D1D1F]">IND vs AUS</div>
                <div className="mt-0.5 text-[6.5px] text-[#6E6E73]">White-Label UI Kit</div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 w-full rounded-full bg-[#EFEBFD]" />
              <div className="h-2.5 w-3/4 rounded-full bg-[#F4F4F7]" />
              <div className="rounded-[7px] bg-[#5B47E0] py-1 text-center text-[7px] font-semibold text-white">
                Join Contest
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Invictus11 — Design Engineering web app + marketing surface built with Figma MCP & Claude Code.
 */
function Invictus11Preview() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full h-[92%] rounded-[18px] sm:rounded-[22px] bg-[#0F172A] border border-white/10 shadow-[0_18px_36px_-18px_rgba(15,23,42,0.45)] overflow-hidden flex flex-col text-white">
        {/* Top app bar */}
        <div className="px-3.5 sm:px-5 py-2.5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-[5px] bg-[#14B8A6] inline-flex items-center justify-center text-[7px] font-bold text-[#042F2E]">
              I11
            </span>
            <span className="text-[9px] sm:text-[10.5px] font-semibold tracking-[-0.01em]">
              Invictus11
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[7px] sm:text-[8px] text-teal-200">
              Figma MCP
            </span>
            <span className="rounded-full bg-[#14B8A6]/20 border border-[#14B8A6]/40 px-2 py-0.5 text-[7px] sm:text-[8px] font-semibold text-teal-300">
              Live Web App
            </span>
          </div>
        </div>

        {/* Main split content */}
        <div className="flex-1 p-3.5 sm:p-5 grid grid-cols-12 gap-3 sm:gap-4 items-center">
          <div className="col-span-7 space-y-2 sm:space-y-2.5">
            <span className="inline-block rounded-full bg-teal-400/15 px-2 py-0.5 text-[7px] sm:text-[8px] font-semibold text-teal-300">
              DESIGN + FRONT-END
            </span>
            <div className="text-[13px] sm:text-[16px] font-bold tracking-[-0.025em] leading-[1.18]">
              Next-gen fantasy web experience
            </div>
            <p className="text-[8px] sm:text-[9px] text-slate-300/85 leading-[1.45]">
              Responsive components designed and shipped directly to production.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <span className="rounded-full bg-[#14B8A6] px-2.5 py-1 text-[7.5px] sm:text-[8.5px] font-bold text-[#042F2E]">
                Launch Arena
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[7.5px] sm:text-[8.5px] font-medium text-white/85">
                UI Tokens
              </span>
            </div>
          </div>

          <div className="col-span-5 space-y-2">
            {[
              { title: 'Squad Builder', meta: 'Interactive Grid', pct: '94%' },
              { title: 'Live Leaderboard', meta: 'Realtime Sync', pct: '60fps' },
              { title: 'Marketing Site', meta: 'SEO & Launch', pct: '100%' },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[10px] bg-white/[0.06] border border-white/[0.08] p-2 flex items-center justify-between"
              >
                <div>
                  <div className="text-[8px] sm:text-[9px] font-semibold text-white">
                    {item.title}
                  </div>
                  <div className="text-[6.5px] sm:text-[7.5px] text-slate-400">{item.meta}</div>
                </div>
                <span className="text-[7.5px] sm:text-[8.5px] font-bold text-teal-300">
                  {item.pct}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Deductiveclouds — X-ray AI Analytics platform with charts and structured CSV data tables.
 */
function DeductiveCloudsPreview() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full h-[92%] rounded-[18px] sm:rounded-[22px] bg-white border border-black/[0.08] shadow-[0_14px_30px_-16px_rgba(29,78,216,0.2)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-3.5 sm:px-4 py-2 border-b border-black/[0.06] bg-[#F8FAFF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-[5px] bg-[#1D4ED8] text-white inline-flex items-center justify-center text-[7px] font-bold">
              X
            </span>
            <span className="text-[8.5px] sm:text-[10px] font-bold text-[#1D1D1F]">
              X-Ray AI Analytics
            </span>
          </div>
          <span className="rounded-full bg-[#DBEAFE] px-2 py-0.5 text-[7px] sm:text-[8px] font-semibold text-[#1D4ED8]">
            CSV → Visual Insights
          </span>
        </div>

        {/* Chart + Table */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between gap-2.5">
          {/* SVG trend chart */}
          <div className="rounded-[11px] bg-[#F7FAFF] border border-[#1D4ED8]/10 p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[7.5px] sm:text-[8.5px] font-semibold text-[#1D1D1F]">
                Anomaly Confidence Index
              </span>
              <span className="text-[7.5px] font-bold text-[#1D4ED8]">16+ Views</span>
            </div>
            <svg
              viewBox="0 0 260 56"
              className="w-full h-11 sm:h-13 overflow-visible"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="xrayArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.01" />
                </linearGradient>
              </defs>
              <path
                d="M0,44 C32,38 56,22 86,28 C116,34 140,12 174,16 C206,20 230,8 260,6 L260,56 L0,56 Z"
                fill="url(#xrayArea)"
              />
              <path
                d="M0,44 C32,38 56,22 86,28 C116,34 140,12 174,16 C206,20 230,8 260,6"
                fill="none"
                stroke="#1D4ED8"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <circle cx="174" cy="16" r="3.5" fill="#1D4ED8" />
              <circle cx="260" cy="6" r="3.5" fill="#1D4ED8" />
            </svg>
          </div>

          {/* Structured Data Table */}
          <div className="rounded-[10px] border border-black/[0.06] overflow-hidden">
            <div className="grid grid-cols-3 bg-[#F5F7FA] px-2.5 py-1 text-[6.5px] sm:text-[7.5px] font-semibold text-[#6E6E73]">
              <span>Dataset</span>
              <span>Model Output</span>
              <span className="text-right">Delta</span>
            </div>
            {[
              { name: 'Q3_Revenue.csv', status: 'Clustered', delta: '+18.4%' },
              { name: 'Churn_Signals.csv', status: 'Chart.js', delta: '-6.2%' },
            ].map((row) => (
              <div
                key={row.name}
                className="grid grid-cols-3 px-2.5 py-1.5 border-t border-black/[0.04] text-[7px] sm:text-[8px] font-medium text-[#1D1D1F]"
              >
                <span className="truncate">{row.name}</span>
                <span className="text-[#515154]">{row.status}</span>
                <span className="text-right font-bold text-[#1D4ED8]">{row.delta}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

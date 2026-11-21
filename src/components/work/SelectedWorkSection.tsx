import { memo, useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, Award, X } from 'lucide-react';
import {
  SELECTED_WORK_PROJECTS,
  type SelectedWorkProject,
} from '../../config/portfolio';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { ProjectThumbnailFrame } from './ProjectThumbnails';

interface SelectedWorkSectionProps {
  onProjectModalChange?: (open: boolean) => void;
}

export const SelectedWorkSection = memo(function SelectedWorkSection({
  onProjectModalChange,
}: SelectedWorkSectionProps) {
  const [activeProject, setActiveProject] =
    useState<SelectedWorkProject | null>(null);

  const closeProjectModal = useCallback(() => setActiveProject(null), []);
  useEscapeKey(activeProject !== null, closeProjectModal);

  useEffect(() => {
    onProjectModalChange?.(activeProject !== null);
  }, [activeProject, onProjectModalChange]);

  return (
    <section
      id="work"
      aria-labelledby="selected-work-heading"
      data-testid="selected-work-section"
      className="relative w-full scroll-mt-24"
    >
      <div className="w-full max-w-[1140px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="py-16 sm:py-22 lg:py-26">
          {/* Section Header — consistent with About me typography */}
          <div className="mb-12 sm:mb-16 lg:mb-20">
            <h2
              id="selected-work-heading"
              className="text-[22px] sm:text-[25px] lg:text-[27px] font-bold tracking-[-0.03em] leading-[1.16] text-[#1D1D1F]"
            >
              Selected work
            </h2>
          </div>

          {/* 4 Project Showcase Rows matching Reference Composition */}
          <div className="space-y-16 sm:space-y-20 lg:space-y-24">
            {SELECTED_WORK_PROJECTS.map((project) => (
              <article
                key={project.id}
                data-testid={`project-card-${project.id}`}
                className="group grid grid-cols-1 lg:grid-cols-[540px_1fr] items-center gap-8 sm:gap-10 lg:gap-12 xl:gap-16 lg:min-h-[350px]"
              >
                {/* Left Column — Fixed-Dimension Cushioned Bezel + Recessed Inner Shadow Thumbnail */}
                <div className="w-full sm:w-[540px]">
                  <button
                    type="button"
                    onClick={() => setActiveProject(project)}
                    aria-label={`Inspect ${project.company} — ${project.title}`}
                    className="block w-full sm:w-[540px] text-left rounded-[15px] sm:rounded-[19px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066CC]"
                  >
                    <ProjectThumbnailFrame variant={project.thumbnailVariant} />
                  </button>
                </div>

                {/* Right Column — Inline Icon + Bold Name, Timeline, Airy Summary, Dual Gold Pills, Underlined Link */}
                <div className="min-w-0 flex flex-col items-start">
                  {/* Inline App Icon + Bold Project Name */}
                  <div className="inline-flex items-center gap-2.5 sm:gap-3">
                    <span
                      aria-hidden="true"
                      className={[
                        'inline-flex h-[28px] w-[28px] items-center justify-center rounded-[7px]',
                        'text-[10px] font-bold tracking-[-0.02em] leading-none shrink-0',
                        'shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_3px_rgba(17,17,17,0.14)]',
                        project.brandBgClass,
                      ].join(' ')}
                    >
                      {project.brandMonogram}
                    </span>
                    <h3 className="text-[23px] sm:text-[25px] font-bold tracking-[-0.025em] leading-[1.15] text-[#111111]">
                      <button
                        type="button"
                        onClick={() => setActiveProject(project)}
                        className="text-left cursor-pointer hover:opacity-75 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066CC] rounded-sm"
                      >
                        {project.displayName}
                      </button>
                    </h3>
                  </div>

                  {/* Date Range */}
                  <p className="mt-2 text-[14px] sm:text-[14.5px] font-medium tracking-[-0.005em] text-[#76767B]">
                    {project.timeline}
                  </p>

                  {/* Airy Editorial Summary Paragraph */}
                  <p className="mt-5 sm:mt-6 text-[16.5px] sm:text-[17.5px] leading-[1.64] tracking-[-0.012em] font-normal text-[#4B4B4F] max-w-[44ch]">
                    {project.summary}
                  </p>

                  {/* Dual Warm-Gold Highlight Pills Side-by-Side */}
                  <div
                    data-testid={`project-badges-${project.id}`}
                    className="mt-6 sm:mt-7 flex flex-wrap items-center gap-2.5"
                  >
                    {project.badges.map((badge, badgeIndex) => (
                      <span
                        key={`${project.id}-badge-${badgeIndex}`}
                        className={[
                          'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5',
                          'bg-gradient-to-b from-[#FFF7D1] to-[#FDE99A]',
                          'border border-[#E9C75B]/85',
                          'shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_2px_8px_-4px_rgba(161,116,10,0.18)]',
                          'text-[12.5px] sm:text-[13px] font-semibold tracking-[-0.01em] text-[#6B4E08] whitespace-nowrap',
                        ].join(' ')}
                      >
                        <Award
                          className="w-3.5 h-3.5 shrink-0 text-[#7C590A]"
                          strokeWidth={1.9}
                          aria-hidden="true"
                        />
                        <span>{badge}</span>
                      </span>
                    ))}
                  </div>

                  {/* Underlined Action Link with North-East Arrow */}
                  <button
                    type="button"
                    onClick={() => setActiveProject(project)}
                    data-testid={`project-link-${project.id}`}
                    className="mt-6 sm:mt-7 inline-flex items-center gap-2 pb-1.5 border-b-[1.5px] border-[#111111] text-[15.5px] sm:text-[16.5px] font-medium tracking-[-0.01em] text-[#111111] hover:opacity-65 transition-opacity cursor-pointer focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066CC] rounded-[2px]"
                  >
                    <span>{project.ctaLabel}</span>
                    <ArrowUpRight
                      className="w-4 h-4 shrink-0"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Case Study Quick View Modal */}
      {activeProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          data-testid="project-case-study-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/28 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setActiveProject(null);
            }
          }}
        >
          <div className="relative w-full max-w-[680px] max-h-[90svh] overflow-y-auto rounded-[28px] bg-white border border-black/[0.08] shadow-[0_32px_80px_-24px_rgba(17,17,17,0.3)] p-6 sm:p-8 animate-sheet-reveal">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={[
                      'inline-flex h-[20px] w-[20px] items-center justify-center rounded-[5px] text-[8px] font-bold leading-none',
                      activeProject.brandBgClass,
                    ].join(' ')}
                  >
                    {activeProject.brandMonogram}
                  </span>
                  <span className="text-[12px] font-semibold tracking-[0.14em] uppercase text-[#515154]">
                    {activeProject.company}
                  </span>
                </div>
                <h3
                  id="project-modal-title"
                  className="mt-2.5 text-[22px] sm:text-[26px] font-bold tracking-[-0.03em] leading-[1.18] text-[#1D1D1F] [text-wrap:balance]"
                >
                  {activeProject.title}
                </h3>
                <p className="mt-1.5 text-[13.5px] font-medium text-[#6E6E73]">
                  <span>{activeProject.role}</span>
                  <span aria-hidden="true" className="mx-1.5">
                    ·
                  </span>
                  <span>{activeProject.timeline}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveProject(null)}
                aria-label="Close case study preview"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1F1F3] hover:bg-[#E5E5EA] text-[#1D1D1F] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 flex justify-center">
              <ProjectThumbnailFrame variant={activeProject.thumbnailVariant} />
            </div>

            <p className="mt-6 text-[15.5px] leading-[1.68] font-medium text-[#424245]">
              {activeProject.summary}
            </p>

            <div className="mt-5 pt-5 border-t border-black/[0.06]">
              <h4 className="text-[13px] font-semibold tracking-[-0.01em] text-[#1D1D1F] mb-3">
                Key contributions
              </h4>
              <ul className="space-y-2.5 text-[14.5px] leading-[1.62] font-medium text-[#424245]">
                {activeProject.caseStudyPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#86868B]"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-5 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-3">
              <div className="text-[13px] font-medium text-[#6E6E73]">
                {activeProject.deliverables.join(' · ')}
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 bg-gradient-to-b from-[#FFF6CC] to-[#FCE99C] border border-[#EAC85D]/85 text-[12px] font-semibold text-[#6B4E08]">
                <Award className="w-3.5 h-3.5 text-[#8A650B]" strokeWidth={2} aria-hidden="true" />
                <span>{activeProject.highlightBadge}</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
});

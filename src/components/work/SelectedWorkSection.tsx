import { memo, useCallback, useEffect, useState } from 'react';
import { Award, X } from 'lucide-react';
import {
  SELECTED_WORK_PROJECTS,
  type SelectedWorkProject,
} from '../../config/portfolio';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { ProjectThumbnailFrame } from './ProjectThumbnails';

interface SelectedWorkSectionProps {
  onProjectModalChange?: (open: boolean) => void;
}

/** Shared purple rounded-square placeholder app icon matching the reference card style. */
function ProjectCardIcon({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const isSmall = size === 'sm';
  return (
    <span
      aria-hidden="true"
      className={[
        'inline-flex flex-col items-center justify-center shrink-0 select-none text-white',
        'bg-gradient-to-b from-[#A34EF5] via-[#7A27DF] to-[#5714B6]',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.34),0_2px_6px_-2px_rgba(87,20,182,0.42)]',
        isSmall ? 'h-[20px] w-[20px] rounded-[5.5px]' : 'h-[23px] w-[23px] rounded-[6px]',
      ].join(' ')}
    >
      <span
        className={[
          'font-bold tracking-[-0.04em] leading-none',
          isSmall ? 'text-[5px]' : 'text-[5.8px]',
        ].join(' ')}
      >
        district
      </span>
      <span
        className={[
          'font-semibold tracking-[0.04em] uppercase opacity-80 leading-none mt-[1px]',
          isSmall ? 'text-[2.4px]' : 'text-[2.7px]',
        ].join(' ')}
      >
        BY ZOMATO
      </span>
    </span>
  );
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
          <div className="mb-12 sm:mb-16 lg:mb-20">
            <h2
              id="selected-work-heading"
              className="text-[22px] sm:text-[25px] lg:text-[27px] font-bold tracking-[-0.03em] leading-[1.16] text-[#1D1D1F]"
            >
              Selected work
            </h2>
          </div>

          <div className="space-y-[76px] sm:space-y-[94px] lg:space-y-28">
            {SELECTED_WORK_PROJECTS.map((project) => (
              <article
                key={project.id}
                data-testid={`project-card-${project.id}`}
                className="group grid grid-cols-1 lg:grid-cols-[560px_1fr] items-center gap-8 sm:gap-10 lg:gap-14 xl:gap-16 lg:min-h-[392px]"
              >
                {/* Left Column — Fixed-Dimension 34px Rounded Thumbnail */}
                <div className="w-full sm:w-[560px]">
                  <button
                    type="button"
                    onClick={() => setActiveProject(project)}
                    aria-label={`Inspect ${project.company} — ${project.title}`}
                    className="block w-full sm:w-[560px] text-left rounded-[34px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066CC]"
                  >
                    <ProjectThumbnailFrame variant={project.thumbnailVariant} />
                  </button>
                </div>

                {/* Right Column — Exact Reference Typography, Icon & Compact Gold Badge */}
                <div className="min-w-0 flex flex-col items-start">
                  <div className="inline-flex items-center gap-2.5">
                    <ProjectCardIcon />
                    <span className="font-mono text-[13px] sm:text-[13.5px] font-medium tracking-[0.12em] uppercase text-[#66666B] leading-none">
                      {project.company}
                    </span>
                  </div>

                  <h3 className="mt-3.5 text-[23.5px] sm:text-[27px] font-semibold tracking-[-0.028em] leading-[1.18] text-[#1D1D1F] [text-wrap:balance] max-w-[20ch]">
                    <button
                      type="button"
                      onClick={() => setActiveProject(project)}
                      className="text-left cursor-pointer hover:opacity-75 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066CC] rounded-sm"
                    >
                      {project.title}
                    </button>
                  </h3>

                  <p className="mt-5 font-figtree text-[16px] leading-[1.64] font-medium text-[#828282] max-w-[44ch]">
                    {project.summary}
                  </p>

                  <div
                    data-testid={`project-badges-${project.id}`}
                    className="mt-6"
                  >
                    <span
                      className={[
                        'inline-flex items-center gap-[7px] rounded-full px-[14px] py-[7px]',
                        'bg-gradient-to-b from-[#FFF7CC] to-[#FCE588]',
                        'border border-[#ECCB5C]',
                        'shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_3px_10px_-4px_rgba(161,116,10,0.22)]',
                        'text-[11.7px] sm:text-[12.2px] font-semibold tracking-[-0.005em] text-[#785306] whitespace-nowrap',
                      ].join(' ')}
                    >
                      <Award
                        className="w-[13.5px] h-[13.5px] shrink-0 text-[#785306]"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <span>{project.highlightBadge}</span>
                    </span>
                  </div>
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
                  <ProjectCardIcon size="sm" />
                  <span className="font-mono text-[12px] font-medium tracking-[0.12em] uppercase text-[#66666B]">
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

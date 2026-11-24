# Karthikeyan — Portfolio

Personal portfolio for Product & Visual Designer Karthikeyan, built with React, TypeScript, Tailwind CSS v4, and zero-re-render scroll choreography.

## Stack

| Layer | Technology |
| --- | --- |
| Framework | React 19, TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Icons | Lucide React |
| Testing | Node native test runner via `tsx` |

## Structure

```text
├── public/assets/
│   ├── aistudio/              # Portrait & resume PDF assets
│   └── stamp/                 # Monochrome stamp photos (stamp-1.jpg .. stamp-5.jpg)
└── src/
    ├── App.tsx                # Root layout, lazy modal loading, smooth-scroll wiring
    ├── index.css              # Design tokens, fonts, and keyframe animations
    ├── config/
    │   ├── portfolio.ts       # Bio copy, nav links, About Story/TL;DR, Selected Work data
    │   └── hobbies.ts         # "Other World" copy, stamp image list, hobby folders
    ├── hooks/
    │   ├── useSmoothScroll.ts         # Frame-rate-independent inertial scroll & rAF pub/sub
    │   ├── usePrefersReducedMotion.ts # Accessible motion preference observer
    │   └── useEscapeKey.ts            # Shared Escape-key dismissal for overlays
    ├── utils/
    │   ├── navbarState.ts             # Synced navbar width & IST clock math
    │   ├── polaroidPhysics.ts         # Hover parallax lerp helpers
    │   ├── figmaCursorTimeline.ts     # Scripted multiplayer cursor keyframes
    │   ├── otherWorldTimeline.ts      # Scroll-zoom viewBox math & random stamp picker
    │   └── portfolioLogic.test.ts     # Unit tests for pure timelines & config invariants
    └── components/
        ├── layout/            # DynamicNavbar, lazy-loaded ContactSheet
        ├── hero/              # HeroSection, MultilingualGreeting, PolaroidPortrait, cursors
        ├── work/              # SelectedWorkSection, ProjectThumbnails
        ├── other-world/       # Scroll-zoom desk SVG, tilted stamp shuffle, Hobbies tabs
        └── about/             # Story / TL;DR liquid-glass toggle section
```

## Scripts

```bash
npm install        # Install dependencies
npm run dev        # Start dev server on http://localhost:3000
npm run build      # Production bundle into dist/
npm run lint       # Type-check with tsc --noEmit
npm run test       # Run pure logic unit tests
```

## Customization

- **Copy, Links & Projects**: Edit `src/config/portfolio.ts`.
- **Collectible Stamps**: Edit `OTHER_WORLD_STAMPS` in `src/config/hobbies.ts` to add, reorder, or swap stamp PNGs cycled on scroll.
- **Hobbies Folders & Cards**: Edit `HOBBY_FOLDERS` in `src/config/hobbies.ts`.
- **Motion Performance**: Scroll-driven animations (`DynamicNavbar`, `OtherWorldTransitionSection`) subscribe directly to `useSmoothScroll`'s single `requestAnimationFrame` loop and update DOM styles/SVG `viewBox` without triggering per-frame React re-renders. All motion respects `prefers-reduced-motion`.

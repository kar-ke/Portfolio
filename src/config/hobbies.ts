export type HobbyFolderId = 'sketch-arts' | 'photography' | 'dance-rhythm';

export type HobbyCardVisual =
  | 'pencil-study'
  | 'poster-doodle'
  | 'sketchbook-spread'
  | 'golden-hour-street'
  | 'monochrome-shadow'
  | 'window-light'
  | 'stage-rehearsal'
  | 'playlist-groove'
  | 'studio-motion';

export interface HobbySnapshotCard {
  readonly id: string;
  readonly title: string;
  readonly tag: string;
  readonly caption: string;
  readonly tiltDeg: number;
  readonly visual: HobbyCardVisual;
}

export interface HobbyFolder {
  readonly id: HobbyFolderId;
  readonly label: string;
  readonly helperNote: string;
  readonly cards: readonly [HobbySnapshotCard, HobbySnapshotCard, HobbySnapshotCard];
}

export const OTHER_WORLD_COPY = {
  leftLine1: 'Welcome',
  leftLine2: 'other',
  rightLine1: 'to my',
  rightLine2: 'world',
  leftSubtitle: 'Off the screen,',
  rightSubtitle: 'still very much me',
  scrollCue: 'scroll to dive in',
  hobbiesHeading: 'Beyond pixels and prototypes,',
  hobbiesAccent: 'I love to*',
} as const;

export interface CollectibleStamp {
  readonly id: string;
  readonly label: string;
  readonly src: string;
}

/**
 * Collectible stamps cycled sequentially (01 -> 02 -> 03) on loop while scrolling
 * through the "Welcome to my other world" zoom portal.
 */
export const OTHER_WORLD_STAMPS: readonly CollectibleStamp[] = [
  {
    id: 'stamp-01-og-king',
    label: '01 — The OG King',
    src: '/assets/aistudio/The_OG_King_Original_Stamp_e6dd77ab.png',
  },
  {
    id: 'stamp-02-chai-adikkada',
    label: '02 — Chai Adikkada',
    src: '/assets/aistudio/Analysis_output_1_be93f6ba.png',
  },
  {
    id: 'stamp-03-eda-mone',
    label: '03 — Eda Mone !!!',
    src: '/assets/aistudio/Eda_Mone_Stamp_Design_635b7690.png',
  },
] as const;

export const HOBBY_FOLDERS: readonly HobbyFolder[] = [
  {
    id: 'sketch-arts',
    label: 'draw & sketch',
    helperNote: 'pen, paper & quiet explorations',
    cards: [
      {
        id: 'art-1',
        title: 'Pencil & Ink Studies',
        tag: 'Fine Arts',
        caption: 'Loose contour sketches and shading drills that sharpen my eye for visual balance.',
        tiltDeg: -3.2,
        visual: 'pencil-study',
      },
      {
        id: 'art-2',
        title: 'Late-Night Sketchbook',
        tag: 'Notebook',
        caption: 'Quick character doodles, icon grids, and rough layout thumbnails away from Figma.',
        tiltDeg: 1.4,
        visual: 'sketchbook-spread',
      },
      {
        id: 'art-3',
        title: 'Experimental Posters',
        tag: 'Typography',
        caption: 'Playful graphic compositions exploring rhythm, form, and hand-drawn accents.',
        tiltDeg: 3.1,
        visual: 'poster-doodle',
      },
    ],
  },
  {
    id: 'photography',
    label: 'frame moments',
    helperNote: 'chasing light & quiet stories',
    cards: [
      {
        id: 'photo-1',
        title: 'Golden Hour Streets',
        tag: '35mm Mood',
        caption: 'Warm evening light across everyday corners, signage, and passing silhouettes.',
        tiltDeg: -2.8,
        visual: 'golden-hour-street',
      },
      {
        id: 'photo-2',
        title: 'Monochrome Geometry',
        tag: 'B&W Frame',
        caption: 'High-contrast shadows, architectural lines, and stillness captured in black & white.',
        tiltDeg: 0.9,
        visual: 'monochrome-shadow',
      },
      {
        id: 'photo-3',
        title: 'Quiet Window Light',
        tag: 'Still Life',
        caption: 'Soft natural frames from cafes, desks, and slow Sunday afternoons.',
        tiltDeg: 2.9,
        visual: 'window-light',
      },
    ],
  },
  {
    id: 'dance-rhythm',
    label: 'move & groove',
    helperNote: 'music & choreography recharge me',
    cards: [
      {
        id: 'dance-1',
        title: 'College Stage Roots',
        tag: 'Performance',
        caption: 'Where rhythm, teamwork, and live energy first shaped how I think about timing and flow.',
        tiltDeg: -3.0,
        visual: 'stage-rehearsal',
      },
      {
        id: 'dance-2',
        title: 'Design-Session Loops',
        tag: 'Playlists',
        caption: 'Curated beats and instrumental grooves that keep every prototype feeling alive.',
        tiltDeg: 1.2,
        visual: 'playlist-groove',
      },
      {
        id: 'dance-3',
        title: 'Choreography & Flow',
        tag: 'Movement',
        caption: 'Studying momentum, pauses, and transitions—the same language behind great UI motion.',
        tiltDeg: 3.0,
        visual: 'studio-motion',
      },
    ],
  },
] as const;

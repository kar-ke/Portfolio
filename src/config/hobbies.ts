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

/**
 * Dummy monochrome images cycled rapidly inside the tilted postage stamp
 * at the center of the laptop screen while zooming.
 * Replace the files in /public/assets/stamp/ or update these paths anytime.
 */
export const STAMP_DUMMY_IMAGES: readonly string[] = [
  '/assets/stamp/stamp-1.jpg',
  '/assets/stamp/stamp-2.jpg',
  '/assets/stamp/stamp-3.jpg',
  '/assets/stamp/stamp-4.jpg',
  '/assets/stamp/stamp-5.jpg',
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

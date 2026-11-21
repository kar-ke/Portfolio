export interface GreetingItem {
  readonly text: string;
  readonly englishVersion: string;
  readonly language: string;
  readonly langCode: string;
}

export interface NavLinkItem {
  readonly id: 'about' | 'work' | 'workflow';
  readonly label: string;
  readonly href: string;
}

/**
 * Single photo reference — swap this path (or import a new image)
 * to replace the Polaroid portrait with your own photograph.
 */
export const HERO_PORTRAIT_SRC = '/assets/aistudio/image_3c6051a0.png';

export const HERO_PORTRAIT_ALT =
  'Black-and-white portrait of Karthikeyan looking upward in profile';

export const PORTFOLIO_COPY = {
  brandName: 'Karke',
  nameHeading: 'I am Karthikeyan',
  roleHeading: 'Product & Visual Designer.',
  introParagraph:
    'Based in India, I design thoughtful digital experiences and visual identities. I enjoy turning complex problems into simple, intuitive products through design, technology, and experimentation.',
  ctaLabel: 'Get in Touch',
  contactEmail: 'karthikramesh.work@gmail.com',
  contactPhone: '+91 9498875422',
  contactPhoneHref: 'tel:+919498875422',
  whatsappUrl: 'https://wa.me/919498875422',
  linkedinUrl: 'https://www.linkedin.com/in/karke',
  behanceUrl: 'https://www.behance.net/karthikeyan_ramesh',
  resumePdfUrl: '/assets/aistudio/Karthikeyan_resume_badf8dc1.pdf',
  resumeDownloadName: 'Karthikeyan_Ramesh_Resume.pdf',
  locationLabel: 'Based in India',
} as const;

export const NAV_LINKS: readonly NavLinkItem[] = [
  { id: 'about', label: 'About', href: '#about' },
  { id: 'work', label: 'Work', href: '#work' },
  { id: 'workflow', label: 'Workflow', href: '#workflow' },
] as const;

export const MULTILINGUAL_GREETINGS: readonly GreetingItem[] = [
  { text: 'Hello', englishVersion: 'hello', language: 'English', langCode: 'en' },
  { text: 'Hola', englishVersion: 'hola', language: 'Spanish', langCode: 'es' },
  { text: 'Olá', englishVersion: 'ola', language: 'Portuguese', langCode: 'pt' },
  { text: 'Ciao', englishVersion: 'ciao', language: 'Italian', langCode: 'it' },
  { text: 'Hallo', englishVersion: 'hallo', language: 'German', langCode: 'de' },
  { text: 'Bonjour', englishVersion: 'bonjour', language: 'French', langCode: 'fr' },
  { text: 'வணக்கம்', englishVersion: 'vanakkam', language: 'Tamil', langCode: 'ta' },
  { text: 'こんにちは', englishVersion: 'konnichiwa', language: 'Japanese', langCode: 'ja' },
  { text: 'നമസ്കാരം', englishVersion: 'namaskaram', language: 'Malayalam', langCode: 'ml' },
  { text: 'ನಮಸ್ಕಾರ', englishVersion: 'namaskara', language: 'Kannada', langCode: 'kn' },
  { text: 'नमस्ते', englishVersion: 'namaste', language: 'Hindi', langCode: 'hi' },
  { text: 'నమస్కారం', englishVersion: 'namaskaram', language: 'Telugu', langCode: 'te' },
] as const;

export type AboutReadingMode = 'story' | 'tldr';

export interface AboutStorySegment {
  readonly text: string;
  readonly keepInTldr: boolean;
}

export interface AboutStoryParagraph {
  readonly id: string;
  readonly segments: readonly AboutStorySegment[];
}

export const ABOUT_STORY_PARAGRAPHS: readonly AboutStoryParagraph[] = [
  {
    id: 'origins-2015',
    segments: [
      {
        text: 'It all started in 2015, when my dad bought our first Android phone. ',
        keepInTldr: false,
      },
      {
        text: 'I was just a curious kid who went down a rabbit hole of apps',
        keepInTldr: true,
      },
      {
        text: ', launchers, widgets, and icon packs. While everyone else used their phones, I was busy redesigning mine every week. ',
        keepInTldr: false,
      },
      {
        text: 'Looking back, I was probably doing UI exploration before I even knew what UI was.',
        keepInTldr: true,
      },
    ],
  },
  {
    id: 'college-days',
    segments: [
      {
        text: 'In my college days, I was heavily into fine arts, dance, and photography, doing everything I could to get an OD and bunk classes. On a random day, I somehow won a Photoshop competition despite knowing little more than the Pen Tool — a victory that still surprises me.',
        keepInTldr: false,
      },
    ],
  },
  {
    id: 'ddc-lockdown',
    segments: [
      {
        text: 'After graduation, I joined DDC as a UI Developer. But while building products, I found myself far more interested in the screens than the code behind them. During the lockdown, I finally connected the dots. ',
        keepInTldr: false,
      },
      {
        text: 'I realized that building digital products combined everything I loved: how things work, how they look, and how they make people feel.',
        keepInTldr: true,
      },
    ],
  },
  {
    id: 'sciflare-switch',
    segments: [
      {
        text: 'That realization eventually led me to switch careers and join Sciflare as a UI UX Designer.',
        keepInTldr: true,
      },
    ],
  },
  {
    id: 'today-craft',
    segments: [
      {
        text: 'Today, I design digital products for the same reason I spent hours customizing Android phones as a kid.',
        keepInTldr: false,
      },
    ],
  },
] as const;

export function getFullAboutText(
  paragraphs: readonly AboutStoryParagraph[] = ABOUT_STORY_PARAGRAPHS,
): string {
  return paragraphs
    .map((p) => p.segments.map((s) => s.text).join(''))
    .join('\n\n');
}

export function getTldrAboutText(
  paragraphs: readonly AboutStoryParagraph[] = ABOUT_STORY_PARAGRAPHS,
): string {
  return paragraphs
    .map((p) =>
      p.segments
        .filter((s) => s.keepInTldr)
        .map((s) => s.text.trim())
        .join(' '),
    )
    .filter((line) => line.length > 0)
    .join('\n\n');
}

export type ProjectThumbnailVariant =
  | 'getset11'
  | 'sciflare'
  | 'invictus11'
  | 'deductiveclouds';

export interface SelectedWorkProject {
  readonly id: string;
  readonly company: string;
  readonly displayName: string;
  readonly brandMonogram: string;
  readonly brandBgClass: string;
  readonly title: string;
  readonly summary: string;
  readonly highlightBadge: string;
  readonly badges: readonly [string, string];
  readonly ctaLabel: string;
  readonly role: string;
  readonly timeline: string;
  readonly deliverables: readonly string[];
  readonly caseStudyPoints: readonly string[];
  readonly thumbnailVariant: ProjectThumbnailVariant;
}

export const SELECTED_WORK_PROJECTS: readonly SelectedWorkProject[] = [
  {
    id: 'getset11',
    company: 'GETSET11',
    displayName: 'GetSet11',
    brandMonogram: 'G11',
    brandBgClass: 'bg-[#111827] text-white',
    title: 'Designing 0-to-1 fantasy football & wallet flows',
    summary:
      'A fantasy football platform I designed end to end across product, web, and marketing — contests, multi-currency wallets, and launch assets in one cohesive system. Crafted 80+ screens across 12 core flows from concept to developer handoff.',
    highlightBadge: '80+ Screens · 12 End-to-End Flows',
    badges: ['80+ Screens Shipped', '12 End-to-End Flows'],
    ctaLabel: 'View Case Study',
    role: 'Freelance Product Designer',
    timeline: 'Oct 2025 — Sep 2026',
    deliverables: ['Product Design', 'Design System', 'Web & Marketing'],
    caseStudyPoints: [
      'Designed 80+ screens across 12 end-to-end user flows from 0-to-1 concepts through interactive prototyping and developer handoff.',
      'Structured core contest entry, multi-currency wallet, rake, fee transparency, and prize distribution experiences for clarity and trust.',
      'Optimized the marketing website and LCCP-compliant launch creatives across Meta, Google PMax, email, and in-app promotions.',
    ],
    thumbnailVariant: 'getset11',
  },
  {
    id: 'sciflare',
    company: 'SCIFLARE',
    displayName: 'Sciflare',
    brandMonogram: 'SF',
    brandBgClass: 'bg-[#5B47E0] text-white',
    title: 'Sports API monitoring & white-label fantasy suite',
    summary:
      'Redesigned the company brand, website, and positioning while crafting white-label fantasy sports products (Krazy11, Scorecard) across web and mobile. Introduced an API monitoring dashboard that boosted B2B client retention.',
    highlightBadge: '+20% Client Retention · 4 Inbound Clients',
    badges: ['+20% Client Retention', '4 Inbound Clients'],
    ctaLabel: 'View Case Study',
    role: 'UI/UX Designer',
    timeline: 'Nov 2024 — Sep 2025',
    deliverables: ['B2B Dashboard', 'White-Label Apps', 'Brand Redesign'],
    caseStudyPoints: [
      'Introduced a live API monitoring dashboard for sports API clients that contributed to a 20% increase in client retention.',
      'Redesigned the company website, logo, and positioning, helping drive 4 major inbound clients including Dream11.',
      'Designed cross-platform white-label fantasy sports products including Krazy11 and Scorecard, plus the InnovateX visual system for 200+ attendees.',
    ],
    thumbnailVariant: 'sciflare',
  },
  {
    id: 'invictus11',
    company: 'INVICTUS11',
    displayName: 'Invictus11',
    brandMonogram: 'I11',
    brandBgClass: 'bg-[#0F766E] text-white',
    title: 'Design engineering web app & launch site',
    summary:
      'Embedded in the core product team handling both visual design and front-end engineering for the web app and marketing website. Built modular, production-ready interfaces rapidly using Figma MCP and Claude Code.',
    highlightBadge: 'Design + Front-End Engineering',
    badges: ['Design + Front-End', 'Figma MCP Workflow'],
    ctaLabel: 'View Case Study',
    role: 'Freelance Design Engineer',
    timeline: 'Aug 2026 — Oct 2026',
    deliverables: ['Web App UI', 'Front-End Code', 'Marketing Website'],
    caseStudyPoints: [
      'Owned visual design and responsive front-end implementation for both the Invictus11 web application and public marketing site.',
      'Accelerated design-to-production handoff using AI-assisted workflows combining Figma MCP and Claude Code.',
      'Built reusable, accessible UI components with consistent typography, motion, and responsive layouts across viewports.',
    ],
    thumbnailVariant: 'invictus11',
  },
  {
    id: 'deductiveclouds',
    company: 'DEDUCTIVECLOUDS',
    displayName: 'Deductiveclouds',
    brandMonogram: 'DC',
    brandBgClass: 'bg-[#1D4ED8] text-white',
    title: 'Visualizing AI analytics for enterprise teams',
    summary:
      'Designed and built the front-end of X-ray, an AI-driven analytics platform in ReactJS. Turned raw CSV model outputs into clear interactive charts and accessible tables across 16+ data-heavy views for faster decisions.',
    highlightBadge: '16+ Data-Heavy Analytics Views',
    badges: ['16+ Analytics Views', 'ReactJS & Chart.js'],
    ctaLabel: 'View Case Study',
    role: 'UI Developer',
    timeline: 'Feb 2022 — Sep 2023',
    deliverables: ['ReactJS Front-End', 'Data Visualization', 'Enterprise UI'],
    caseStudyPoints: [
      'Designed and built 16+ data-intensive interfaces including filterable tables and KPI views for business stakeholders.',
      'Converted raw AI CSV outputs into clear, interactive visualizations using Highcharts and Chart.js.',
      'Improved scanability and decision speed across complex analytics workflows using HTML, CSS, JavaScript, and ReactJS.',
    ],
    thumbnailVariant: 'deductiveclouds',
  },
] as const;

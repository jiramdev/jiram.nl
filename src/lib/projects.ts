export interface MediaItem {
  url: string;
  /** Describes the media for people who cannot see it. Never reuse the caption for this. */
  alt: string;
  caption?: string;
  /** Still frame for videos. Also the poster shown to reduced-motion visitors. */
  poster?: string;
}

interface Cover extends MediaItem {
  type: "image" | "video";
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  /** Free-form year or range, e.g. "2025" or "2023 - 2024". */
  timeline: string;
  role: string;
  client?: string;
  websiteUrl?: string;
  websiteLabel?: string;
  /** One sentence. Used for meta descriptions and link previews. */
  summary: string;
  /** One or two sentences. Used as the lead paragraph on the project page. */
  description: string;
  /** Optional logo tile for the card badge. Falls back to initials. */
  logoUrl?: string;
  /** The grid card media. The project page renders gallery only. */
  cover: Cover;
  gallery: MediaItem[];
  /** Ascending. Drives grid order and the sitemap. */
  order: number;
  /** Shown in the grid, but no page is generated and the card is not a link. */
  comingSoon?: boolean;
}

export const projects: Project[] = [
  {
    slug: "repstr",
    name: "Repstr",
    tagline: "Workout tracker & fitness application",
    timeline: "2026",
    role: "Design & Development",
    client: "Freelance",
    websiteUrl: "https://repstr.vercel.app/",
    websiteLabel: "repstr.app",
    logoUrl: "/projects/repstr/repstr-mark.svg",
    summary:
      "A minimalist, high-performance workout companion and progression tracker built for friction-free exercise logging and volume analysis.",
    description:
      "Repstr removes the friction of workout tracking during training: a mobile-first interface optimized for rapid input, visual routine builders, and real-time exercise volume tracking.",
    order: 1,
    // Self-hosted and re-encoded. The original cover was a 989KB VP9 WebM, which
    // iOS Safari cannot decode at all, so this card could never render on iPhone.
    // The cover is now the mark loop rather than a screen recording, which is
    // what a portfolio grid should lead with.
    cover: {
      type: "video",
      url: "/projects/repstr/repstr-logo-loop-5x4.mp4",
      alt: "The Repstr mark assembling from two folded strokes",
      poster: "/projects/repstr/repstr-logo-poster-5x4.jpg",
    },
    // Just the head animation for now. Everything else that was here came from
    // framerusercontent, which was placeholder art rather than real Repstr
    // captures. Add the case study media here when there is some.
    gallery: [
      {
        url: "/projects/repstr/1.mp4",
        alt: "Close-up of the Repstr home screen on a phone showing a scheduled legs day with workout and weight stats",
        caption: "Home: today's session with workout and weight stats.",
        poster: "/projects/repstr/1-poster.jpg",
      },
      {
        url: "/projects/repstr/2.mp4",
        alt: "Angled iPhone showing the Repstr week schedule with push, pull, legs and rest days",
        caption: "Schedule: the training week and saved plans.",
        poster: "/projects/repstr/2-poster.jpg",
      },
      {
        url: "/projects/repstr/3.mp4",
        alt: "Close-up of the Repstr statistics screen showing body weight and completed workouts",
        caption: "Statistics: body weight and completed workouts at a glance.",
        poster: "/projects/repstr/3-poster.jpg",
      },
      {
        url: "/projects/repstr/4.mp4",
        alt: "Angled phone showing the Repstr exercise logging screen for hack squats with set inputs",
        caption: "Logging: sets, reps and weight entry during a session.",
        poster: "/projects/repstr/4-poster.jpg",
      },
      {
        url: "/projects/repstr/5.mp4",
        alt: "Close-up of the Repstr login screen with the wordmark, tagline and email and password fields",
        caption: "Sign in: the login screen with the Repstr wordmark.",
        poster: "/projects/repstr/5-poster.jpg",
      },
    ],
  },
  {
    slug: "jiram-brand",
    name: "Jiram",
    tagline: "Personal brand identity",
    timeline: "2026",
    role: "Brand Identity",
    client: "Personal",
    websiteUrl: "https://www.jiram.nl",
    websiteLabel: "jiram.nl",
    logoUrl: "/jiram-mark.svg",
    summary:
      "A personal brand identity built from a single geometric mark: a near-black and off-white system carried from favicon to portfolio.",
    description:
      "The identity is one mark and one palette, applied consistently everywhere it appears. Two folded shapes carry the name, and a near-black on warm off-white palette keeps every surface high contrast and legible. The same tokens that set the favicon set the portfolio, so brand and product are never out of step.",
    order: 2,
    comingSoon: true,
    // The 5:4 loop matches the card crop exactly, so nothing is letterboxed.
    cover: {
      type: "video",
      url: "/projects/jiram/jiram-logo-loop-5x4.mp4",
      poster: "/projects/jiram/jiram-logo-poster-5x4.jpg",
      alt: "The Jiram mark assembling from two folded shapes",
    },
    gallery: [
      {
        url: "/projects/jiram/jiram-logo-loop.mp4",
        poster: "/projects/jiram/jiram-logo-poster.jpg",
        alt: "The Jiram mark assembling from two folded shapes on a dark field",
        caption: "Primary mark, animated from its two folded halves.",
      },
      {
        url: "/projects/jiram/jiram-logo-poster.jpg",
        alt: "The completed Jiram mark in cream on near-black",
        caption: "Final mark: cream on near-black.",
      },
    ],
  },
  {
    slug: "levensgloed",
    name: "Levensgloed",
    tagline: "Holistic practice",
    timeline: "2025",
    role: "Brand Identity",
    client: "Levensgloed",
    logoUrl: "/projects/levensgloed/levensgloed-mark.svg",
    summary:
      "A calm, botanical identity for a holistic practice: a lotus mark and a sage palette built to feel grounded rather than clinical.",
    description:
      "The identity needed to read as care, not as a medical brand. A lotus built from three stroked petals sits under three gold dots, drawn in white over a muted sage field, and the same palette carries every touchpoint. Rounded forms and generous space keep the practice approachable while the high-contrast mark stays legible at favicon size.",
    order: 3,
    comingSoon: true,
    // The 5:4 loop matches the card crop exactly, so nothing is letterboxed.
    cover: {
      type: "video",
      url: "/projects/levensgloed/levensgloed-logo-loop-5x4.mp4",
      poster: "/projects/levensgloed/levensgloed-logo-poster-5x4.jpg",
      alt: "The Levensgloed lotus mark blooming on a sage green field",
    },
    gallery: [
      {
        url: "/projects/levensgloed/levensgloed-logo-loop.mp4",
        poster: "/projects/levensgloed/levensgloed-logo-poster.jpg",
        alt: "The Levensgloed lotus mark blooming on a sage green field",
        caption: "Primary mark, animated as the petals open.",
      },
      {
        url: "/projects/levensgloed/levensgloed-logo-poster.jpg",
        alt: "The completed Levensgloed lotus mark in white on sage green",
        caption: "Final mark: white lotus and gold dots on sage.",
      },
    ],
  },
];

const byOrder = [...projects].sort((a, b) => a.order - b.order);

/** Everything, coming soon included. For the grid. */
export async function getProjects(): Promise<Project[]> {
  return byOrder;
}

/** Only published work. For routes, the sitemap and navigation. */
export async function getPublishedProjects(): Promise<Project[]> {
  return byOrder.filter((p) => !p.comingSoon);
}

/** Null for a coming soon project, so its page 404s. */
export async function getProjectBySlug(
  slug: string
): Promise<Project | null> {
  return byOrder.find((p) => p.slug === slug && !p.comingSoon) ?? null;
}
import { IssueCategory, IssueStatus } from '@prisma/client';

// ─── Upvote threshold to promote issue PENDING → VALIDATED ───────────────────
export const UPVOTE_THRESHOLD = 5;

// ─── Photo upload limits ──────────────────────────────────────────────────────
// Kept here rather than in lib/cloudinary.ts so the browser can read them
// without pulling in the Node-only Cloudinary SDK.
export const ALLOWED_IMAGE_FORMATS = 'jpg,jpeg,png,webp';
export const ALLOWED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

// ─── Issue categories with display metadata ───────────────────────────────────
// Each colour carries a light-mode shade plus a dark: override. The 300-level
// tints are only legible on a dark surface, so light mode uses 700-level text.
export const CATEGORY_META: Record<
  IssueCategory,
  { label: string; icon: string; color: string; hint: string }
> = {
  POTHOLE: {
    label: 'Pothole',
    icon: '🕳️',
    hint: 'Holes and sunken patches in the road surface',
    color:
      'bg-orange-500/15 text-orange-700 border-orange-500/30 dark:bg-orange-500/20 dark:text-orange-300',
  },
  GARBAGE: {
    label: 'Garbage',
    icon: '🗑️',
    hint: 'Uncollected waste or overflowing bins',
    color: 'bg-red-500/15 text-red-700 border-red-500/30 dark:bg-red-500/20 dark:text-red-300',
  },
  WATER_LEAK: {
    label: 'Water leak',
    icon: '💧',
    hint: 'Burst pipes, leaking mains or wasted water',
    color: 'bg-blue-500/15 text-blue-700 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-300',
  },
  STREETLIGHT: {
    label: 'Streetlight',
    icon: '💡',
    hint: 'Lights that are dead, flickering or on all day',
    color:
      'bg-yellow-500/15 text-yellow-800 border-yellow-500/30 dark:bg-yellow-500/20 dark:text-yellow-300',
  },
  TRAFFIC_SIGNAL: {
    label: 'Traffic signal',
    icon: '🚦',
    hint: 'Signals stuck, dark or facing the wrong way',
    color:
      'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300',
  },
  BLOCKED_DRAIN: {
    label: 'Blocked drain',
    icon: '🌊',
    hint: 'Clogged drains, sewage backup or standing water',
    color: 'bg-cyan-500/15 text-cyan-700 border-cyan-500/30 dark:bg-cyan-500/20 dark:text-cyan-300',
  },
  ILLEGAL_DUMPING: {
    label: 'Illegal dumping',
    icon: '🚯',
    hint: 'Rubble, waste or debris dumped where it should not be',
    color: 'bg-rose-500/15 text-rose-700 border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-300',
  },
  BROKEN_FOOTPATH: {
    label: 'Broken footpath',
    icon: '🧱',
    hint: 'Cracked paving, missing slabs or blocked walkways',
    color:
      'bg-stone-500/15 text-stone-700 border-stone-500/30 dark:bg-stone-500/20 dark:text-stone-300',
  },
  FALLEN_TREE: {
    label: 'Tree hazard',
    icon: '🌳',
    hint: 'Fallen branches or trees leaning over the road',
    color:
      'bg-lime-500/15 text-lime-800 border-lime-500/30 dark:bg-lime-500/20 dark:text-lime-300',
  },
  DAMAGED_PROPERTY: {
    label: 'Public property',
    icon: '🪧',
    hint: 'Damaged benches, bus stops, railings or signage',
    color:
      'bg-violet-500/15 text-violet-700 border-violet-500/30 dark:bg-violet-500/20 dark:text-violet-300',
  },
  STRAY_ANIMALS: {
    label: 'Stray animals',
    icon: '🐕',
    hint: 'Stray or injured animals needing attention',
    color:
      'bg-amber-500/15 text-amber-700 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300',
  },
  OTHER: {
    label: 'Something else',
    icon: '📌',
    hint: 'Anything that does not fit the categories above',
    color:
      'bg-slate-500/15 text-slate-700 border-slate-500/30 dark:bg-slate-500/20 dark:text-slate-300',
  },
};

// ─── Issue statuses with display metadata ─────────────────────────────────────
export const STATUS_META: Record<
  IssueStatus,
  { label: string; color: string; step: number }
> = {
  PENDING: {
    label: 'Pending',
    color: 'bg-slate-500/15 text-slate-700 border-slate-500/30 dark:bg-slate-500/20 dark:text-slate-300',
    step: 0,
  },
  VALIDATED: {
    label: 'Validated',
    color: 'bg-amber-500/15 text-amber-700 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300',
    step: 1,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'bg-sky-500/15 text-sky-700 border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-300',
    step: 2,
  },
  RESOLVED: {
    label: 'Resolved',
    color: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300',
    step: 3,
  },
};

// ─── Badge metadata ───────────────────────────────────────────────────────────
/** Display order for the badge grid, so it never reshuffles as badges are earned. */
export const BADGE_ORDER = ['REPORTER_1', 'SUPPORTER_10', 'RESOLVER_1'] as const;

export const BADGE_META = {
  REPORTER_1: {
    name: 'First Responder',
    description: 'Filed your first report',
    /** Shown while the badge is still locked. */
    hint: 'File your first report to earn this',
  },
  SUPPORTER_10: {
    name: 'Community Pillar',
    description: 'Backed ten reports from other people',
    hint: 'Back ten reports from your neighbours',
  },
  RESOLVER_1: {
    name: 'Impact Hero',
    description: 'Something you reported was repaired',
    hint: 'Get one of your reports fixed',
  },
} as const;

// ─── Mapbox default center (India) ────────────────────────────────────────────
export const MAP_DEFAULT_CENTER = { lng: 78.9629, lat: 20.5937, zoom: 4 };

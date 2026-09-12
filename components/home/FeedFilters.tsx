import Link from 'next/link';
import { TrendingUp, Clock } from 'lucide-react';
import { CATEGORY_META, STATUS_META } from '@/lib/constants';
import { cn } from '@/lib/utils';

export interface FeedQuery {
  sort: string;
  status?: string;
  category?: string;
}

/** Builds a feed URL, dropping empty params so links stay readable. */
function feedHref(next: FeedQuery) {
  const params = new URLSearchParams();
  if (next.sort && next.sort !== 'newest') params.set('sort', next.sort);
  if (next.status) params.set('status', next.status);
  if (next.category) params.set('category', next.category);
  const qs = params.toString();
  return `${qs ? `/?${qs}` : '/'}#feed`;
}

const SORTS = [
  { value: 'newest', label: 'Newest', icon: Clock },
  { value: 'most_upvoted', label: 'Most voted', icon: TrendingUp },
];

const STATUSES = ['PENDING', 'VALIDATED', 'IN_PROGRESS', 'RESOLVED'] as const;

/** Segmented-control item, for the small fixed-size groups. */
function segment(active: boolean) {
  return cn(
    'px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap',
    active ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
  );
}

/** Standalone chip, used for categories since there are now twelve of them. */
function chip(active: boolean) {
  return cn(
    'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-colors',
    active
      ? 'border-primary/50 bg-primary/15 text-primary'
      : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
  );
}

export function FeedFilters({ query }: { query: FeedQuery }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Sort */}
        <div className="flex rounded-xl border border-border overflow-hidden">
          {SORTS.map(({ value, label, icon: Icon }) => (
            <Link
              key={value}
              href={feedHref({ ...query, sort: value })}
              className={cn(segment(query.sort === value), 'flex items-center gap-1.5')}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          ))}
        </div>

        {/* Status */}
        <div className="flex rounded-xl border border-border overflow-hidden">
          <Link href={feedHref({ ...query, status: undefined })} className={segment(!query.status)}>
            Any status
          </Link>
          {STATUSES.map((value) => (
            <Link
              key={value}
              href={feedHref({ ...query, status: value })}
              className={segment(query.status === value)}
            >
              {STATUS_META[value].label}
            </Link>
          ))}
        </div>
      </div>

      {/* Categories: separate chips that wrap cleanly. Packing twelve of these into
          one bordered segmented control broke as soon as it wrapped. */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Link href={feedHref({ ...query, category: undefined })} className={chip(!query.category)}>
          All types
        </Link>
        {Object.entries(CATEGORY_META).map(([value, meta]) => (
          <Link
            key={value}
            href={feedHref({ ...query, category: value })}
            className={chip(query.category === value)}
            title={meta.hint}
          >
            <span aria-hidden>{meta.icon}</span>
            {meta.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

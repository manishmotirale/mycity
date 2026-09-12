import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, ChevronUp, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RoleBadge } from '@/components/RoleBadge';
import { CATEGORY_META, STATUS_META } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface IssueCardProps {
  issue: {
    id: string;
    title: string;
    description: string;
    category: string;
    address: string;
    photoUrl: string;
    status: string;
    createdAt: Date | string;
    author: { name: string | null; image: string | null; role?: string | null };
    _count: { upvotes: number };
    upvotes: { userId: string }[];
  };
  currentUserId?: string;
}

export function IssueCard({ issue, currentUserId }: IssueCardProps) {
  const categoryMeta = CATEGORY_META[issue.category as keyof typeof CATEGORY_META];
  const statusMeta = STATUS_META[issue.status as keyof typeof STATUS_META];
  const hasVoted = currentUserId ? issue.upvotes.some((u) => u.userId === currentUserId) : false;

  return (
    <Link href={`/issue/${issue.id}`} className="block">
      <article className="glass-hover rounded-2xl overflow-hidden group animate-fade-in">
        {/* Issue Photo */}
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={issue.photoUrl}
            alt={issue.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          {/* Floating Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge
              variant={issue.status.toLowerCase() as any}
              className="text-xs font-semibold backdrop-blur-sm"
            >
              {statusMeta?.label ?? issue.status}
            </Badge>
          </div>

          {/* Category chip */}
          <div className="absolute bottom-3 left-3">
            <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm', categoryMeta?.color)}>
              {categoryMeta?.icon} {categoryMeta?.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {issue.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {issue.description}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="line-clamp-1">{issue.address}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {issue.author.image ? (
                <Image
                  src={issue.author.image}
                  alt={issue.author.name ?? 'User'}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
              )}
              <span className="text-xs text-muted-foreground">
                {issue.author.name ?? 'Anonymous'}
              </span>
              {/* Only badge staff, so citizen reports stay visually neutral. */}
              {issue.author.role && issue.author.role !== 'CITIZEN' && (
                <RoleBadge role={issue.author.role} showLabel={false} className="px-1 py-0" />
              )}
              <span className="text-xs text-muted-foreground/50">·</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
              </span>
            </div>

            {/* Vote count */}
            <div className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
              hasVoted
                ? 'bg-sky-500/15 text-sky-700 border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-300'
                : 'bg-foreground/5 text-muted-foreground border-foreground/10'
            )}>
              <ChevronUp className="w-3.5 h-3.5" />
              {issue._count.upvotes}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

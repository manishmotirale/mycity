import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, User, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RoleBadge } from '@/components/RoleBadge';
import { UpvoteButton } from '@/components/UpvoteButton';
import { StatusTracker } from '@/components/StatusTracker';
import { BadgeDisplay } from '@/components/BadgeDisplay';
import { CATEGORY_META, STATUS_META, UPVOTE_THRESHOLD } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';

// Next 16 delivers params as a Promise.
interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const issue = await prisma.issue
    .findUnique({ where: { id }, select: { title: true, description: true } })
    .catch(() => null);

  if (!issue) return { title: 'Report not found — MyCity' };
  return {
    title: `${issue.title} — MyCity`,
    description: issue.description.slice(0, 160),
  };
}

export default async function IssueDetailPage({ params }: PageProps) {
  const [session, { id }] = await Promise.all([getServerSession(authOptions), params]);

  const issue = await prisma.issue.findUnique({
    where: { id },
    include: {
      author: {
        select: { name: true, image: true, role: true, badges: true, reputationScore: true },
      },
      upvotes: { select: { userId: true } },
      _count: { select: { upvotes: true } },
    },
  });

  if (!issue) notFound();

  const hasVoted = session ? issue.upvotes.some((u) => u.userId === session.user.id) : false;
  const categoryMeta = CATEGORY_META[issue.category as keyof typeof CATEGORY_META];
  const statusMeta = STATUS_META[issue.status as keyof typeof STATUS_META];
  const progressPct = Math.min(100, (issue._count.upvotes / UPVOTE_THRESHOLD) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to reports
      </Link>

      {/* Hero image */}
      <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-foreground/10">
        <Image src={issue.photoUrl} alt={issue.title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 768px" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className={cn('inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border backdrop-blur-sm', categoryMeta?.color)}>
            {categoryMeta?.icon} {categoryMeta?.label}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant={issue.status.toLowerCase() as any} className="backdrop-blur-sm">
            {statusMeta?.label}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="glass-card p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-3">{issue.title}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" />{issue.address}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-muted-foreground" />{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</span>
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed">{issue.description}</p>

        {/* Upvote section */}
        {issue.status === 'PENDING' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
              {issue._count.upvotes} of {UPVOTE_THRESHOLD} votes needed before this is sent on
            </span>
              <span className="text-primary font-medium">{Math.round(progressPct)}%</span>
            </div>
            <div className="h-2 bg-foreground/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-blue-400 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <UpvoteButton issueId={issue.id} initialCount={issue._count.upvotes} initiallyVoted={hasVoted} />
          {!session && (
            <Link href="/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Sign in to upvote →
            </Link>
          )}
        </div>
      </div>

      {/* Status Timeline */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Progress</h2>
        <StatusTracker status={issue.status} />
        {issue.status === 'RESOLVED' && issue.proofPhotoUrl && (
          <div className="mt-6 space-y-2">
            <p className="text-sm font-medium text-emerald-400">Photo of the completed work</p>
            <div className="relative h-48 rounded-xl overflow-hidden">
              <Image src={issue.proofPhotoUrl} alt="Proof of resolution" fill className="object-cover" sizes="768px" />
            </div>
          </div>
        )}
      </div>

      {/* Reporter info */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Filed by</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
            {issue.author.image ? (
              <Image src={issue.author.image} alt={issue.author.name ?? ''} width={48} height={48} className="rounded-full" />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{issue.author.name ?? 'Anonymous Citizen'}</p>
              <RoleBadge role={issue.author.role} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {issue.author.reputationScore} reputation
            </p>
          </div>
        </div>
        {issue.author.badges.length > 0 && (
          <BadgeDisplay badges={issue.author.badges} compact />
        )}
      </div>
    </div>
  );
}

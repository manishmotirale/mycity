'use client';

import { useState } from 'react';
import { ChevronUp, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface UpvoteButtonProps {
  issueId: string;
  initialCount: number;
  initiallyVoted: boolean;
}

export function UpvoteButton({ issueId, initialCount, initiallyVoted }: UpvoteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(initiallyVoted);
  const [loading, setLoading] = useState(false);

  async function handleUpvote(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push('/login');
      return;
    }

    if (voted || loading) return;

    setLoading(true);
    // Optimistic UI
    setCount((c) => c + 1);
    setVoted(true);

    try {
      const res = await fetch(`/api/issues/${issueId}/upvote`, { method: 'POST' });
      const data = await res.json();

      if (res.status === 409) {
        // The vote already exists, so the optimistic state was right about `voted`
        // and only the count was speculative. Rolling back here used to leave the
        // button clickable at one below the true count, and every retry dropped it
        // further. Keep it marked as voted and let the server number win.
        setVoted(true);
        setCount((c) => c - 1);
        router.refresh();
      } else if (!res.ok) {
        setCount((c) => c - 1);
        setVoted(false);
        toast({ title: 'Could not vote', description: data.error, variant: 'destructive' });
      } else {
        setCount(data.voteCount);
        toast({ title: 'Vote counted', variant: 'success' });
        router.refresh();
      }
    } catch {
      setCount((c) => c - 1);
      setVoted(false);
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleUpvote}
      disabled={voted || loading || !session}
      id={`upvote-btn-${issueId}`}
      className={cn(
        'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-95',
        voted
          ? 'bg-sky-500/15 text-sky-700 border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-300 cursor-default'
          : !session
          ? 'bg-foreground/5 text-muted-foreground border-foreground/10 cursor-pointer hover:bg-foreground/10'
          : 'bg-foreground/5 text-foreground border-foreground/10 hover:bg-sky-500/15 hover:text-primary hover:border-sky-500/30 cursor-pointer'
      )}
      title={!session ? 'Sign in to upvote' : voted ? 'Already upvoted' : 'Upvote this issue'}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <ChevronUp className={cn('w-4 h-4 transition-transform', voted && 'text-primary')} />
      )}
      <span>{count}</span>
      <span className="hidden sm:inline text-xs opacity-70">{voted ? 'Upvoted' : 'Upvote'}</span>
    </button>
  );
}

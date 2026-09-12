'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Clock, ChevronUp, Wrench, CheckCircle2, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CATEGORY_META, STATUS_META } from '@/lib/constants';
import { toast } from '@/hooks/use-toast';
import { uploadImage } from '@/lib/upload-client';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface AuthorityCardProps {
  issue: {
    id: string;
    title: string;
    description: string;
    category: string;
    address: string;
    photoUrl: string;
    status: string;
    createdAt: Date | string;
    author: { name: string | null };
    _count: { upvotes: number };
  };
  onUpdate: () => void;
}

export function AuthorityCard({ issue, onUpdate }: AuthorityCardProps) {
  const [loading, setLoading] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [proofUrl, setProofUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const categoryMeta = CATEGORY_META[issue.category as keyof typeof CATEGORY_META];
  const statusMeta = STATUS_META[issue.status as keyof typeof STATUS_META];

  async function handleAction(action: 'start' | 'resolve') {
    if (action === 'resolve' && !proofUrl) {
      toast({
        title: 'Photo needed',
        description: 'Attach a photo of the completed work before closing this.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/issues/${issue.id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, proofPhotoUrl: proofUrl }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      } else {
        toast({
          title: action === 'start' ? 'Marked in progress' : 'Closed as fixed',
          description:
            action === 'start'
              ? 'The reporter can see that work has started.'
              : 'Your proof photo is now on the public report.',
          variant: 'success',
        });
        setResolveOpen(false);
        onUpdate();
      }
    } catch {
      toast({ title: 'Error', description: 'Request failed. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function handleProofUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      setProofUrl(await uploadImage(file, 'proof'));
    } catch (err) {
      toast({
        title: 'Upload failed',
        description: err instanceof Error ? err.message : 'Could not upload that photo.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <div className="glass-card p-5 flex gap-4">
        {/* Thumbnail */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
          <Image src={issue.photoUrl} alt={issue.title} fill className="object-cover" sizes="96px" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-sm line-clamp-1">{issue.title}</h3>
            <Badge variant={issue.status.toLowerCase() as any} className="flex-shrink-0 text-xs">
              {statusMeta?.label}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mb-3">
            <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full border', categoryMeta?.color)}>
              {categoryMeta?.icon} {categoryMeta?.label}
            </span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {issue.address}</span>
            <span className="flex items-center gap-1"><ChevronUp className="w-3 h-3" /> {issue._count.upvotes} votes</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {issue.status === 'VALIDATED' && (
              <Button
                size="sm"
                variant="warning"
                onClick={() => handleAction('start')}
                loading={loading}
                className="gap-1.5 text-xs"
                id={`authority-start-${issue.id}`}
              >
                <Wrench className="w-3.5 h-3.5" />
                Start Resolution
              </Button>
            )}
            {issue.status === 'IN_PROGRESS' && (
              <Button
                size="sm"
                variant="success"
                onClick={() => setResolveOpen(true)}
                className="gap-1.5 text-xs"
                id={`authority-resolve-${issue.id}`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark Resolved
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Resolve dialog */}
      <Dialog open={resolveOpen} onOpenChange={setResolveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Photo of the completed work</DialogTitle>
            <DialogDescription>
              This goes on the public report, so the person who filed it can see what was done.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="relative border-2 border-dashed border-foreground/20 rounded-xl p-8 text-center hover:border-foreground/40 transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleProofUpload}
                id="proof-upload-input"
              />
              {uploading ? (
                <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" />
              ) : proofUrl ? (
                <div className="space-y-2">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
                  <p className="text-xs text-emerald-400">Photo attached</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Choose a photo</p>
                </div>
              )}
            </div>

            {proofUrl && (
              <Image src={proofUrl} alt="Proof preview" width={400} height={200} className="w-full rounded-xl object-cover max-h-48" />
            )}

            <Button
              className="w-full gap-2"
              variant="success"
              onClick={() => handleAction('resolve')}
              loading={loading}
              disabled={!proofUrl}
              id="authority-confirm-resolve-btn"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Resolution
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

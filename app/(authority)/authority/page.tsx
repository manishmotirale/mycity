'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, TrendingUp, Wrench, CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import { AuthorityCard } from '@/components/AuthorityCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TabType = 'VALIDATED' | 'IN_PROGRESS' | 'RESOLVED';

interface QueueIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  address: string;
  photoUrl: string;
  status: string;
  createdAt: string;
  author: { name: string | null };
  _count: { upvotes: number };
}

export default function AuthorityPage() {
  const [issues, setIssues] = useState<QueueIssue[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('VALIDATED');
  const [loading, setLoading] = useState(true);
  // Bumped to force a refetch without duplicating the fetch logic.
  const [reloadKey, setReloadKey] = useState(0);

  // The fetch lives entirely inside the effect. Setting state synchronously in an
  // effect makes React 19 warn about cascading renders, so `loading` is switched
  // on by the event handlers below and only switched off once a response lands.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/issues?status=${activeTab}`);
        const data = await res.json();
        if (!cancelled) setIssues(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setIssues([]);
      } finally {
        // Guarding on `cancelled` also stops a slow response for an abandoned
        // tab from overwriting the one the user is now looking at.
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeTab, reloadKey]);

  const refresh = useCallback(() => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  function selectTab(tab: TabType) {
    if (tab === activeTab) return;
    setLoading(true);
    setActiveTab(tab);
  }

  const tabs: { value: TabType; label: string; icon: React.ElementType; color: string }[] = [
    { value: 'VALIDATED', label: 'Awaiting Action', icon: TrendingUp, color: 'text-amber-400' },
    { value: 'IN_PROGRESS', label: 'In Progress', icon: Wrench, color: 'text-primary' },
    { value: 'RESOLVED', label: 'Resolved', icon: CheckCircle2, color: 'text-emerald-400' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Authority queue</h1>
            <p className="text-sm text-muted-foreground">
              Reports that passed the vote threshold, and the ones you are working on
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          className="gap-2"
          id="authority-refresh-btn"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl border border-foreground/10 overflow-hidden p-1 gap-1 bg-foreground/[0.02]">
        {tabs.map(({ value, label, icon: Icon, color }) => (
          <button
            key={value}
            onClick={() => selectTab(value)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              activeTab === value
                ? 'bg-foreground/10 text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
            )}
            id={`authority-tab-${value.toLowerCase()}`}
          >
            <Icon className={cn('w-4 h-4', activeTab === value ? color : '')} />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{value === 'VALIDATED' ? 'Pending' : value === 'IN_PROGRESS' ? 'Active' : 'Done'}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card h-28 skeleton" />
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-semibold">Nothing in this tab</p>
          <p className="text-sm text-muted-foreground mt-1">
            {activeTab === 'VALIDATED'
              ? 'No reports have crossed the vote threshold yet.'
              : activeTab === 'IN_PROGRESS'
              ? 'Nothing is being worked on right now.'
              : 'No reports have been closed yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{issues.length} issue{issues.length !== 1 ? 's' : ''}</p>
          {issues.map((issue) => (
            <AuthorityCard key={issue.id} issue={issue} onUpdate={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}

import { User, Shield, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROLE_META = {
  CITIZEN: {
    label: 'Citizen',
    icon: User,
    className: 'bg-slate-500/15 text-slate-700 border-slate-500/30 dark:bg-slate-500/20 dark:text-slate-300',
  },
  AUTHORITY: {
    label: 'Authority',
    icon: ShieldCheck,
    className: 'bg-amber-500/15 text-amber-700 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300',
  },
  ADMIN: {
    label: 'Admin',
    icon: Shield,
    className: 'bg-purple-500/15 text-purple-700 border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-300',
  },
} as const;

type RoleName = keyof typeof ROLE_META;

export function RoleBadge({
  role,
  showLabel = true,
  className,
}: {
  role: string;
  showLabel?: boolean;
  className?: string;
}) {
  const meta = ROLE_META[role as RoleName];
  if (!meta) return null;

  const Icon = meta.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-medium',
        meta.className,
        className
      )}
      title={`Signed in as ${meta.label}`}
    >
      <Icon className="w-3 h-3" />
      {showLabel && meta.label}
    </span>
  );
}

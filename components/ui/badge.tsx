import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      // Light mode needs 700-level text on a soft tint; dark mode keeps the
      // 300-level tints that read well on a dark surface.
      variant: {
        default: 'bg-sky-500/15 text-sky-700 border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-300',
        secondary: 'bg-foreground/10 text-foreground border-foreground/10',
        destructive: 'bg-red-500/15 text-red-700 border-red-500/30 dark:bg-red-500/20 dark:text-red-300',
        outline: 'border-foreground/20 text-foreground',
        success:
          'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300',
        warning:
          'bg-amber-500/15 text-amber-700 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300',
        pending:
          'bg-slate-500/15 text-slate-700 border-slate-500/30 dark:bg-slate-500/20 dark:text-slate-300',
        validated:
          'bg-amber-500/15 text-amber-700 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300',
        in_progress:
          'bg-sky-500/15 text-sky-700 border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-300',
        resolved:
          'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

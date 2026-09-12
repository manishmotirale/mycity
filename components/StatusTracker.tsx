import { Check, Wrench, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const STAGES = [
  { label: 'Submitted', icon: Shield, color: 'text-muted-foreground', activeColor: 'text-primary', bgActive: 'bg-sky-500', ring: 'ring-sky-500/30' },
  { label: 'Validated', icon: Check, color: 'text-muted-foreground', activeColor: 'text-amber-400', bgActive: 'bg-amber-500', ring: 'ring-amber-500/30' },
  { label: 'In Progress', icon: Wrench, color: 'text-muted-foreground', activeColor: 'text-primary', bgActive: 'bg-sky-500', ring: 'ring-sky-500/30' },
  { label: 'Resolved', icon: Check, color: 'text-muted-foreground', activeColor: 'text-emerald-400', bgActive: 'bg-emerald-500', ring: 'ring-emerald-500/30' },
];

const STATUS_TO_STEP: Record<string, number> = {
  PENDING: 0,
  VALIDATED: 1,
  IN_PROGRESS: 2,
  RESOLVED: 3,
};

interface StatusTrackerProps {
  status: string;
}

export function StatusTracker({ status }: StatusTrackerProps) {
  const currentStep = STATUS_TO_STEP[status] ?? 0;

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        {/* Connecting line */}
        <div className="absolute top-5 left-0 right-0 h-px bg-foreground/10 z-0" />
        {/* Progress line */}
        <div
          className="absolute top-5 left-0 h-px bg-gradient-to-r from-sky-500 to-emerald-500 z-0 transition-all duration-700"
          style={{ width: `${(currentStep / (STAGES.length - 1)) * 100}%` }}
        />

        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;

          return (
            <div key={stage.label} className="relative z-10 flex flex-col items-center gap-2">
              {/* Step circle */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500',
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-500'
                    : isActive
                    ? `${stage.bgActive} border-transparent ring-4 ${stage.ring} animate-pulse-slow`
                    : 'bg-muted border-foreground/10'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isCompleted || isActive ? 'text-white' : 'text-muted-foreground'
                  )}
                />
              </div>

              {/* Step label */}
              <span
                className={cn(
                  'text-xs font-medium whitespace-nowrap transition-colors',
                  isCompleted ? 'text-emerald-400' : isActive ? stage.activeColor : 'text-muted-foreground'
                )}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

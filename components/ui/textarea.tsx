import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[120px] w-full rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 resize-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/30 focus-visible:border-sky-500/50',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };

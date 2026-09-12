'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Which icon shows is decided purely by CSS via the `dark:` variant, keyed off the
 * class next-themes puts on <html> before first paint. That avoids the usual
 * `mounted` flag: reading the theme during render would be wrong on the server and
 * cause a visible icon swap on hydration (and React 19 flags the setState-in-effect
 * pattern that guard relies on).
 *
 * `resolvedTheme` is only read inside the click handler, which always runs after
 * hydration, so it is safe there.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'relative w-9 h-9 rounded-lg border border-border text-muted-foreground',
        'hover:text-foreground hover:bg-foreground/5 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'flex items-center justify-center',
        className
      )}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      id="theme-toggle-btn"
    >
      {/* Both icons stay mounted and cross-fade, so there is no layout shift. */}
      <Sun
        className={cn(
          'absolute w-4 h-4 transition-all duration-300',
          'opacity-100 rotate-0 scale-100',
          'dark:opacity-0 dark:rotate-90 dark:scale-50'
        )}
        aria-hidden
      />
      <Moon
        className={cn(
          'absolute w-4 h-4 transition-all duration-300',
          'opacity-0 -rotate-90 scale-50',
          'dark:opacity-100 dark:rotate-0 dark:scale-100'
        )}
        aria-hidden
      />
    </button>
  );
}

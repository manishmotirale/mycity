import Image from 'next/image';
import { cn } from '@/lib/utils';

/** Single source of truth for the logo file, so swapping the artwork is a one-line change. */
const LOGO_SRC = '/mycity.png';

interface LogoProps {
  /** Rendered pixel size of the square mark. */
  size?: number;
  /** Show the "MyCity" wordmark next to the mark. */
  withWordmark?: boolean;
  /** Set on the largest above-the-fold instance only. */
  priority?: boolean;
  className?: string;
}

/**
 * The artwork already includes its own rounded blue tile, so it is deliberately
 * not wrapped in the app's gradient square — that would double up the background.
 */
export function LogoMark({
  size = 32,
  priority = false,
  className,
}: Omit<LogoProps, 'withWordmark'>) {
  return (
    <Image
      src={LOGO_SRC}
      alt=""
      width={size}
      height={size}
      priority={priority}
      className={cn('rounded-[22%] object-contain', className)}
      // The tile is a flat colour at the edges, so a subtle ring reads better than
      // a shadow against both themes.
      style={{ width: size, height: size }}
    />
  );
}

export function Logo({ size = 32, withWordmark = true, priority = false, className }: LogoProps) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark size={size} priority={priority} />
      {withWordmark && <span className="wordmark text-xl">MyCity</span>}
    </span>
  );
}

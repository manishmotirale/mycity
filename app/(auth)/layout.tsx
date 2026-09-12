import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogoMark } from '@/components/Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* No navbar on these pages, so the toggle needs its own anchor. */}
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Background glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-3 mb-8 transition-transform hover:scale-[1.03]"
        aria-label="MyCity home"
      >
        <LogoMark size={44} priority />
        <span className="wordmark text-3xl">MyCity</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md glass-card p-8">
        {children}
      </div>

      <p className="mt-6 text-xs text-muted-foreground text-center">
        &copy; {new Date().getFullYear()} MyCity
      </p>
    </div>
  );
}

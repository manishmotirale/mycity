import { LogoMark } from '@/components/Logo';

/**
 * Root loading UI. Next wraps the root layout's children in a Suspense boundary
 * using this file, so it covers every route that does not define its own
 * loading.tsx. Pure CSS animation — no client JS, so it can stream immediately.
 */
export default function Loading() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      role="status"
      aria-live="polite"
    >
      {/* Background glows, matching the auth pages */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Logo with expanding rings and an orbiting dot */}
      <div className="relative w-32 h-32 flex items-center justify-center mb-8" aria-hidden>
        <span className="absolute w-16 h-16 rounded-2xl border border-sky-500/40 animate-ripple" />
        <span className="absolute w-16 h-16 rounded-2xl border border-sky-500/40 animate-ripple anim-delay-700" />
        <span className="absolute w-16 h-16 rounded-2xl border border-emerald-500/30 animate-ripple anim-delay-1000" />

        <div className="absolute inset-0 animate-orbit">
          <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_12px_2px_rgba(56,189,248,0.7)]" />
        </div>

        <div className="relative shadow-lg shadow-sky-500/30 rounded-[22%]">
          <LogoMark size={64} priority />
        </div>
      </div>

      <p className="wordmark text-xl mb-1">MyCity</p>

      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-7">
        Loading
        <span className="flex gap-1" aria-hidden>
          <span className="w-1 h-1 rounded-full bg-sky-400 animate-hop" />
          <span className="w-1 h-1 rounded-full bg-sky-400 animate-hop anim-delay-100" />
          <span className="w-1 h-1 rounded-full bg-sky-400 animate-hop anim-delay-200" />
        </span>
      </p>

      {/* Indeterminate bar — we cannot know real progress, so do not fake a percentage */}
      <div
        className="w-52 h-1 rounded-full bg-foreground/5 overflow-hidden relative"
        aria-hidden
      >
        <div className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-sweep" />
      </div>

      <span className="sr-only">Loading, please wait.</span>
    </div>
  );
}

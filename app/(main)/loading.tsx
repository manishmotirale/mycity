/**
 * Loading UI for the signed-in area. This exists so in-app navigation does not
 * fall through to the root app/loading.tsx, which sits above (main)/layout.tsx
 * and would blank out the navbar on every click. Shape mirrors the feed so the
 * layout does not jump when real content arrives.
 */
export default function MainLoading() {
  return (
    <div className="space-y-10" role="status" aria-live="polite">
      {/* Panel placeholder */}
      <div className="glass-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-48 rounded-lg skeleton" />
            <div className="h-4 w-72 rounded skeleton" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-40 rounded-xl skeleton" />
            <div className="h-10 w-32 rounded-xl skeleton" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-foreground/10 bg-foreground/[0.03] p-4 space-y-2 animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="h-4 w-4 rounded skeleton" />
              <div className="h-6 w-12 rounded skeleton" />
              <div className="h-3 w-16 rounded skeleton" />
            </div>
          ))}
        </div>
      </div>

      {/* Feed heading and filter placeholders */}
      <div>
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
          <div className="space-y-2">
            <div className="h-6 w-56 rounded-lg skeleton" />
            <div className="h-4 w-64 rounded skeleton" />
          </div>
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="h-9 w-44 rounded-xl skeleton" />
              <div className="h-9 w-56 rounded-xl skeleton" />
            </div>
            <div className="h-9 w-72 rounded-xl skeleton" />
          </div>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="glass-card overflow-hidden animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="h-44 w-full skeleton" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 rounded skeleton" />
                <div className="h-3 w-full rounded skeleton" />
                <div className="h-3 w-2/3 rounded skeleton" />
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full skeleton" />
                    <div className="h-3 w-24 rounded skeleton" />
                  </div>
                  <div className="h-7 w-14 rounded-full skeleton" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only">Loading reports.</span>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoMark } from '@/components/Logo';

export const metadata: Metadata = {
  title: 'Page not found — MyCity',
};

// Decorative pins scattered behind the card, each drifting on its own delay.
const PINS = [
  { top: '12%', left: '14%', tone: 'text-primary/30', delay: '', tilt: '-12deg' },
  { top: '22%', left: '82%', tone: 'text-emerald-400/25', delay: 'anim-delay-500', tilt: '9deg' },
  { top: '70%', left: '10%', tone: 'text-amber-400/25', delay: 'anim-delay-300', tilt: '6deg' },
  { top: '78%', left: '76%', tone: 'text-primary/20', delay: 'anim-delay-1000', tilt: '-8deg' },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        {PINS.map((pin, i) => (
          <MapPin
            key={i}
            className={`absolute w-10 h-10 animate-drift ${pin.tone} ${pin.delay}`}
            style={
              { top: pin.top, left: pin.left, ['--tilt' as string]: pin.tilt } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="glass-card p-10 sm:p-12 max-w-md w-full space-y-6">
        <div className="w-16 h-16 mx-auto shadow-lg shadow-sky-500/25 rounded-[22%] float">
          <LogoMark size={64} />
        </div>

        {/* Digits drop in one after another */}
        <div className="flex items-center justify-center gap-1" aria-hidden>
          {['4', '0', '4'].map((digit, i) => (
            <span
              key={i}
              className={`text-6xl font-bold gradient-text animate-drop-in ${
                ['', 'anim-delay-100', 'anim-delay-200'][i]
              }`}
            >
              {digit}
            </span>
          ))}
        </div>

        <div className="animate-fade-in anim-delay-300">
          <h1 className="text-xl font-semibold mb-2">No such page</h1>
          <p className="text-muted-foreground text-sm">
            The link may be out of date, or the report was removed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 animate-fade-in anim-delay-500">
          <Link href="/" className="flex-1">
            <Button className="gap-2 w-full">
              <ArrowLeft className="w-4 h-4" />
              Back to reports
            </Button>
          </Link>
          <Link href="/report" className="flex-1">
            <Button variant="outline" className="gap-2 w-full">
              <Plus className="w-4 h-4" />
              Report a problem
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

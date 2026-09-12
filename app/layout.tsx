import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

// Self-hosted by next/font: no external request, no layout shift from a late
// webfont, and it removes the render-blocking Google Fonts <link>.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

// Outfit is geometric and wide at heavy weights, which gives the MyCity wordmark
// more presence than Space Grotesk did.
const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
});

const description =
  'Report potholes, uncollected garbage, dead streetlights and water leaks in your area. Issues with enough neighbourhood votes get passed to the local authority, and you can follow each one until it is fixed.';

export const metadata: Metadata = {
  title: { default: 'MyCity', template: '%s | MyCity' },
  description,
  keywords: ['civic issues', 'pothole reporting', 'municipal complaints', 'local government'],
  // All of these resolve to the single logo file in /public, so replacing the
  // artwork only means swapping that one image.
  icons: {
    icon: [{ url: '/mycity.png', type: 'image/png' }],
    shortcut: ['/mycity.png'],
    apple: [{ url: '/mycity.png' }],
  },
  openGraph: {
    title: 'MyCity',
    description:
      'Report a problem in your area, back the reports your neighbours file, and follow the repair through to completion.',
    type: 'website',
    images: [{ url: '/mycity.png', width: 1024, height: 1024, alt: 'MyCity' }],
  },
  twitter: {
    card: 'summary',
    title: 'MyCity',
    description:
      'Report a problem in your area, back the reports your neighbours file, and follow the repair through to completion.',
    images: ['/mycity.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: next-themes sets the theme class on <html> from a
    // blocking script before React hydrates.
    // data-scroll-behavior: Next 16 stopped overriding scroll behaviour during
    // navigation, so this opts back in now that html has scroll-behavior: smooth.
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${outfit.variable}`}
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

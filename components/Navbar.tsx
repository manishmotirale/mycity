'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  MapPin,
  LayoutDashboard,
  Plus,
  ShieldCheck,
  Shield,
  LogOut,
  LogIn,
  UserPlus,
  Trophy,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RoleBadge } from '@/components/RoleBadge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  /** Which roles see this link. Undefined means everyone, signed in or not. */
  roles?: string[];
  activeClass: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'Reports',
    icon: MapPin,
    activeClass: 'bg-sky-500/15 text-primary border border-sky-500/20',
  },
  {
    href: '/dashboard',
    label: 'Your reports',
    icon: LayoutDashboard,
    roles: ['CITIZEN', 'AUTHORITY', 'ADMIN'],
    activeClass: 'bg-sky-500/15 text-primary border border-sky-500/20',
  },
  {
    href: '/leaderboard',
    label: 'Leaderboard',
    icon: Trophy,
    activeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  },
  {
    href: '/authority',
    label: 'Queue',
    icon: ShieldCheck,
    roles: ['AUTHORITY', 'ADMIN'],
    activeClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  },
  {
    href: '/admin',
    label: 'Admin',
    icon: Shield,
    roles: ['ADMIN'],
    activeClass: 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
  },
];

interface NavbarUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
}

/**
 * The signed-in user is passed down from the server rather than read with
 * useSession(). useSession() is empty during SSR, which made the navbar render
 * its signed-out state on every request and flash "Sign in" at logged-in users
 * before hydration.
 */
export function Navbar({ user }: { user: NavbarUser | null }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const role = user?.role;
  const visibleItems = NAV_ITEMS.filter((item) => !item.roles || (role && item.roles.includes(role)));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-foreground/5 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group transition-transform hover:scale-[1.03]"
            aria-label="MyCity home"
          >
            <Logo size={32} priority />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {visibleItems.map(({ href, label, icon: Icon, activeClass }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === href
                    ? activeClass
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <>
                <Link href="/report">
                  <Button size="sm" className="gap-2" id="nav-report-btn">
                    <Plus className="w-4 h-4" />
                    Report
                  </Button>
                </Link>
                <div className="flex items-center gap-2 pl-1">
                  <RoleBadge role={role ?? ''} />
                  <Link
                    href="/profile"
                    title="Your profile"
                    className="rounded-full ring-offset-2 ring-offset-background hover:ring-2 hover:ring-primary/50 transition-all"
                    id="nav-profile-link"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
                      <AvatarFallback className="text-xs">
                        {user.name?.slice(0, 2).toUpperCase() ?? 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="Sign out"
                    id="nav-signout-btn"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm" className="gap-2" id="nav-login-btn">
                    <LogIn className="w-4 h-4" />
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="gradient" size="sm" className="gap-2" id="nav-signup-btn">
                    <UserPlus className="w-4 h-4" />
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="text-muted-foreground hover:text-foreground p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              id="nav-mobile-menu-btn"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-foreground/5 glass-card rounded-none p-4 space-y-2">
          {user && (
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 pb-3 mb-1 border-b border-foreground/5"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
                <AvatarFallback className="text-xs">
                  {user.name?.slice(0, 2).toUpperCase() ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">View your profile</p>
              </div>
              <RoleBadge role={role ?? ''} />
            </Link>
          )}

          {visibleItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}

          {user ? (
            <>
              <Link href="/report" onClick={() => setMenuOpen(false)}>
                <Button size="sm" className="w-full gap-2 mt-2">
                  <Plus className="w-4 h-4" />
                  Report a problem
                </Button>
              </Link>
              <button
                onClick={() => {
                  signOut({ callbackUrl: '/' });
                  setMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign in
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)}>
                <Button variant="gradient" size="sm" className="w-full gap-2">
                  <UserPlus className="w-4 h-4" />
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { toast } from '@/hooks/use-toast';

export function LoginForm({
  google,
  github,
  initialError,
}: {
  google: boolean;
  github: boolean;
  initialError: string | null;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn('credentials', { email, password, redirect: false });

    if (result?.error) {
      setError('The email or password is wrong.');
      setLoading(false);
      return;
    }

    toast({ title: 'Signed in', variant: 'success' });
    router.push('/');
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-1">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          You need an account to file a report or vote on one.
        </p>
      </div>

      {/* Without this, a failed OAuth round trip silently dumps you back here. */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 px-4 py-3 mb-5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-200"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-xs leading-relaxed">{error}</p>
        </div>
      )}

      <OAuthButtons google={google} github={github} label="or use your email" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
        </div>

        <Button type="submit" className="w-full gap-2" loading={loading} id="login-submit-btn">
          <LogIn className="w-4 h-4" />
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-primary hover:opacity-80 font-medium transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
}

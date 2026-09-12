'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Mail, Lock, User, UserPlus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { registerUser } from '@/lib/actions';
import { toast } from '@/hooks/use-toast';

export function RegisterForm({ google, github }: { google: boolean; github: boolean }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await registerUser({ name, email, password });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    const signInResult = await signIn('credentials', { email, password, redirect: false });
    if (signInResult?.ok) {
      toast({ title: 'Account created', description: 'You are signed in.', variant: 'success' });
      router.push('/');
      router.refresh();
      return;
    }

    setError('Account created, but automatic sign-in failed. Try signing in.');
    setLoading(false);
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-1">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Takes a minute. You only need it to file reports and vote.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 px-4 py-3 mb-5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-200"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-xs leading-relaxed">{error}</p>
        </div>
      )}

      <OAuthButtons google={google} github={github} label="or sign up with email" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              className="pl-10"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              autoComplete="name"
            />
          </div>
        </div>

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
              placeholder="At least 8 characters"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Needs 8 characters or more, one capital letter and one number.
          </p>
        </div>

        <Button type="submit" className="w-full gap-2 mt-2" loading={loading} id="register-submit-btn">
          <UserPlus className="w-4 h-4" />
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:opacity-80 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}

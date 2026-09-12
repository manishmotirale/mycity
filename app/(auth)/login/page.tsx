import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';
import { enabledOAuthProviders } from '@/lib/auth';
import { describeAuthError } from '@/lib/auth-errors';

export const metadata: Metadata = {
  title: 'Sign in — MyCity',
};

// Read on the server so an OAuth failure code in the URL is rendered straight
// away, rather than needing useSearchParams in a client component.
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <LoginForm
      google={enabledOAuthProviders.google}
      github={enabledOAuthProviders.github}
      initialError={describeAuthError(error)}
    />
  );
}

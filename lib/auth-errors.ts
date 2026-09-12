/**
 * NextAuth reports failures by redirecting to /login?error=<code>. Without a
 * lookup like this the user just lands back on the sign-in form with no
 * explanation, which makes OAuth problems very hard to debug.
 * Codes: https://next-auth.js.org/configuration/pages#error-codes
 */
const AUTH_ERRORS: Record<string, string> = {
  OAuthAccountNotLinked:
    'That email already has a password-based account here. Sign in with your password first, or use a different provider account.',
  OAuthSignin: 'Could not start sign-in with that provider. Check the provider keys in .env.',
  OAuthCallback:
    'The provider rejected the callback. Usually the redirect URI registered with the provider does not match NEXTAUTH_URL.',
  OAuthCreateAccount: 'Could not create an account from that provider profile.',
  EmailCreateAccount: 'Could not create an account with that email address.',
  Callback: 'Something went wrong while completing sign-in.',
  CredentialsSignin: 'The email or password is wrong.',
  SessionRequired: 'Please sign in to continue.',
  AccessDenied: 'Access denied by the provider.',
  Configuration:
    'Server auth configuration problem. Check NEXTAUTH_SECRET and NEXTAUTH_URL in .env.',
  Verification: 'That sign-in link is no longer valid.',
};

export function describeAuthError(code?: string | null): string | null {
  if (!code) return null;
  return AUTH_ERRORS[code] ?? 'Sign-in failed. Please try again.';
}

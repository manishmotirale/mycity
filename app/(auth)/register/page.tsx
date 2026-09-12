import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { enabledOAuthProviders } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Create an account — MyCity',
};

export default function RegisterPage() {
  return (
    <RegisterForm
      google={enabledOAuthProviders.google}
      github={enabledOAuthProviders.github}
    />
  );
}

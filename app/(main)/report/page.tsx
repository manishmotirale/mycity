import type { Metadata } from 'next';
import { ReportForm } from '@/components/ReportForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Report a problem — MyCity',
  description: 'Describe the problem, drop a pin where it is, and attach a photo.',
};

export default async function ReportPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">
          Report a <span className="gradient-text">problem</span>
        </h1>
        <p className="text-muted-foreground">
          Three steps: what it is, where it is, and a photo.
        </p>
      </div>
      <ReportForm />
    </div>
  );
}

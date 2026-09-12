import { getServerSession } from 'next-auth';
import { Navbar } from '@/components/Navbar';
import { authOptions } from '@/lib/auth';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen">
      <Navbar user={session?.user ?? null} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}

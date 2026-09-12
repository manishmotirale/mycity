import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import { UserRow } from '@/components/admin/UserRow';
import { PlatformStats } from '@/components/admin/PlatformStats';
import { getAverageResolutionDays, getIssueBreakdown } from '@/lib/home-data';
import { Shield, Users, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin — MyCity',
  description: 'Change who can act as an authority, and see how the platform is doing.',
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  const [users, breakdown, averageResolutionDays] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        reputationScore: true,
        createdAt: true,
        _count: { select: { issues: true, upvotes: true, badges: true } },
      },
    }),
    getIssueBreakdown(),
    getAverageResolutionDays(),
  ]);

  const counts = {
    total: users.length,
    citizens: users.filter((u) => u.role === 'CITIZEN').length,
    authorities: users.filter((u) => u.role === 'AUTHORITY').length,
    admins: users.filter((u) => u.role === 'ADMIN').length,
  };

  return (
    <div className="min-h-screen">
      <Navbar user={session?.user ?? null} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin</h1>
            <p className="text-sm text-muted-foreground">
              Who is on the platform and how reports are moving
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Users', value: counts.total, icon: Users, color: 'text-primary' },
            { label: 'Citizens', value: counts.citizens, icon: Users, color: 'text-muted-foreground' },
            { label: 'Authorities', value: counts.authorities, icon: CheckCircle2, color: 'text-amber-400' },
            { label: 'Admins', value: counts.admins, icon: Shield, color: 'text-purple-400' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-5 text-center">
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Report analytics */}
        <PlatformStats breakdown={breakdown} averageResolutionDays={averageResolutionDays} />

        {/* User table */}
        <div className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-foreground/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-semibold text-sm">All users</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Roles are set in the database. Run{' '}
              <code className="bg-foreground/10 px-1 rounded">npx prisma studio</code> to change one.
            </p>
          </div>

          <div className="divide-y divide-foreground/5">
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { RoleBadge } from '@/components/RoleBadge';

interface UserRowProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string;
    reputationScore: number;
    createdAt: Date;
    _count: { issues: number; upvotes: number; badges: number };
  };
}

/**
 * Read-only. Roles are changed directly in the database (Prisma Studio), and the
 * JWT callback re-reads the role from the User row on each request, so a change
 * takes effect without the person signing out.
 */
export function UserRow({ user }: UserRowProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 py-4 hover:bg-foreground/[0.03] transition-colors">
      <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex-shrink-0 flex items-center justify-center overflow-hidden">
        {user.image ? (
          <Image src={user.image} alt={user.name ?? ''} fill className="object-cover" sizes="40px" />
        ) : (
          <span className="text-sm font-bold text-white">
            {(user.name ?? user.email ?? '?').slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{user.name ?? 'No name'}</p>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
          <span>{user._count.issues} reports</span>
          <span>·</span>
          <span>{user._count.upvotes} votes</span>
          <span>·</span>
          <span>{user._count.badges} badges</span>
          <span>·</span>
          <span>{user.reputationScore} reputation</span>
          <span>·</span>
          <span>joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span>
        </div>
      </div>

      <RoleBadge role={user.role} className="flex-shrink-0" />
    </div>
  );
}

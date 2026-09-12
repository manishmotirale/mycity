import { Prisma, PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// ─── Error helpers ────────────────────────────────────────────────────────────
// Prisma surfaces failures as typed errors with stable codes. Match on those
// rather than on error message text, which changes between versions/providers.
// https://www.prisma.io/docs/orm/reference/error-reference

export const DB_UNREACHABLE_MESSAGE =
  'Cannot reach the database. Check DATABASE_URL in .env and confirm your Neon project is not suspended.';

/** P1xxx = connection/initialization failures. P2002 = unique constraint violation. */
const UNREACHABLE_CODES = new Set(['P1000', 'P1001', 'P1002', 'P1008', 'P1010', 'P1011', 'P1017']);

function prismaErrorCode(err: unknown): string | undefined {
  if (err instanceof Prisma.PrismaClientKnownRequestError) return err.code;
  if (err instanceof Prisma.PrismaClientInitializationError) return err.errorCode;
  return undefined;
}

export function isDbUnreachable(err: unknown): boolean {
  if (err instanceof Prisma.PrismaClientInitializationError) return true;
  const code = prismaErrorCode(err);
  return code !== undefined && UNREACHABLE_CODES.has(code);
}

export function isUniqueConstraintError(err: unknown): boolean {
  return prismaErrorCode(err) === 'P2002';
}

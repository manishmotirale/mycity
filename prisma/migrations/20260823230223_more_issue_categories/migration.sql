-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "IssueCategory" ADD VALUE 'TRAFFIC_SIGNAL';
ALTER TYPE "IssueCategory" ADD VALUE 'BLOCKED_DRAIN';
ALTER TYPE "IssueCategory" ADD VALUE 'ILLEGAL_DUMPING';
ALTER TYPE "IssueCategory" ADD VALUE 'BROKEN_FOOTPATH';
ALTER TYPE "IssueCategory" ADD VALUE 'FALLEN_TREE';
ALTER TYPE "IssueCategory" ADD VALUE 'DAMAGED_PROPERTY';
ALTER TYPE "IssueCategory" ADD VALUE 'STRAY_ANIMALS';
ALTER TYPE "IssueCategory" ADD VALUE 'OTHER';


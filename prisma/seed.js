/**
 * Seed script — creates the three test accounts using Prisma.
 * Run with: npx prisma db seed
 *
 * Accounts created:
 *   CITIZEN   → citizen@mycity.dev   / Citizen@123
 *   AUTHORITY → authority@mycity.dev / Authority@123
 *   ADMIN     → admin@mycity.dev     / Admin@1234
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const users = [
  { name: 'Test Citizen',   email: 'citizen@mycity.dev',   password: 'Citizen@123',   role: 'CITIZEN' },
  { name: 'Test Authority', email: 'authority@mycity.dev', password: 'Authority@123', role: 'AUTHORITY' },
  { name: 'Test Admin',     email: 'admin@mycity.dev',     password: 'Admin@1234',    role: 'ADMIN' },
];

async function main() {
  console.log('🌱  Seeding database\n');

  for (const user of users) {
    const password = await bcrypt.hash(user.password, 12);

    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, password, role: user.role },
      create: { name: user.name, email: user.email, password, role: user.role },
    });

    console.log(`  ✅  ${user.role.padEnd(12)} → ${record.email}  (password: ${user.password})`);
  }

  console.log('\n✨  Seed complete! Log in with:');
  console.log('   Citizen   → citizen@mycity.dev   / Citizen@123');
  console.log('   Authority → authority@mycity.dev / Authority@123');
  console.log('   Admin     → admin@mycity.dev     / Admin@1234');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e.message ?? e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

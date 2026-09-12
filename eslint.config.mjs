import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

// ESLint 9 uses flat config, and Next 16 removed `next lint` (run `npm run lint`).
// eslint-config-next 16 already publishes flat config, so no FlatCompat needed.
const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'prisma/seed.js'],
  },
  ...nextCoreWebVitals,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];

export default config;

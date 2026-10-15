// @ts-check
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default [
  {
    ignores: [
      'dist/',
      '.astro/',
      'node_modules/',
      'test-results/',
      'playwright-report/',
      '.lighthouseci/',
      'docs/',
      'specs/',
      'history/',
      '.specify/',
      '.agents/',
      '.claude/',
    ],
  },
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    rules: {
      // `_`-prefixed names are intentionally unused (e.g. `catch (_)` in the CSP-hashed inline theme script).
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },
];

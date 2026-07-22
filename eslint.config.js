import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'

export default defineConfig(
  globalIgnores([
    'dist/',
    'coverage/',
    'node_modules/',
    'playground/dist/',
    'test-results/',
    'playwright-report/',
    '.pw-browsers/',
    'pw-browsers/',
    '**/__screenshots__/',
  ]),
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      // A zero-dependency library ships no console noise.
      'no-console': 'error',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}', 'playground/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    // Build/verify tooling is plain ESM JavaScript, outside the TS program.
    files: ['scripts/**/*.mjs'],
    languageOptions: { globals: globals.node, sourceType: 'module' },
    rules: { 'no-console': 'off' },
  },
  {
    files: ['**/__tests__/**', 'e2e/**', 'playground/**', '*.config.ts'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      'no-console': 'off',
    },
  },
)

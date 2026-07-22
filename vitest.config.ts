import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        // Pure logic. No DOM needed, so no browser cost — this is the project
        // the pre-push hook runs.
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.ts'],
        },
      },
      {
        // Everything about this component is geometry, clipping, hover and
        // focus. jsdom has no layout engine, so a jsdom assertion about a
        // partial fill would be asserting a string, not a rendering.
        extends: true,
        test: {
          name: 'browser',
          include: ['src/**/*.browser.test.tsx'],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.*', 'src/index.ts', 'src/types.ts'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        // math.ts is pure and it is the product; it gets no slack.
        'src/math.ts': { lines: 100, functions: 100, branches: 100, statements: 100 },
      },
    },
  },
})

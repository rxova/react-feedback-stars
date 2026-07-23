import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// A private workspace app. It aliases the library to source so it runs — dev,
// `vite build` for the E2E preview, and typecheck — without a prior library
// build. The `react-feedback-stars` workspace dependency makes pnpm link the
// package; this alias (and the matching tsconfig path) point resolution at the
// source rather than the unbuilt `dist`.
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react()],
  resolve: {
    alias: {
      'react-feedback-stars': fileURLToPath(
        new URL('../../packages/react-feedback-stars/src/index.ts', import.meta.url),
      ),
    },
  },
  build: { outDir: 'dist', emptyOutDir: true },
  server: { port: 5173 },
  preview: { port: 4173 },
})

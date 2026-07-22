import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// The playground lives inside the root package rather than a workspace: this
// project is deliberately not a monorepo, so it reuses the root's react and
// react-dom devDependencies and aliases the library to source.
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react()],
  resolve: {
    alias: {
      'react-feedback-stars': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
    },
  },
  build: { outDir: 'dist', emptyOutDir: true },
  server: { port: 5173 },
  preview: { port: 4173 },
})

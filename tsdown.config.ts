import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  // §9.3 — dual ESM + CJS. ESM-only would lock out the CJS/Jest long tail
  // that a drop-in rating component lives in.
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  treeshake: true,
  // §9.1 — rolldown preserves the `use client` directive already present in
  // src/index.ts, so adding an output banner here would emit it twice.
  deps: { neverBundle: ['react', 'react/jsx-runtime'] },
})

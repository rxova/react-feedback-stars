# react-feedback-stars

## 0.1.1

### Patch Changes

- [#7](https://github.com/rxova/react-feedback-stars/pull/7) [`cddcfd4`](https://github.com/rxova/react-feedback-stars/commit/cddcfd43f167b70cb98552d1f2900c72b745d924) Thanks [@jonatankruszewski](https://github.com/jonatankruszewski)! - Documentation and developer-experience release. The published package (`dist`) is unchanged from
  0.1.0 — this refreshes what ships alongside it on npm and the new docs site.

  - New documentation site (Docusaurus) with guides, live editable examples, generated
    screenshots/GIFs, and an API reference generated from source.
  - Migration guides from `react-rating`, `react-stars`, and hand-rolled radio widgets.
  - Copy-paste form recipes, now including **TanStack Form** as a tested integration alongside
    React Hook Form, Formik, and React Final Form.
  - README refresh: leads with the canonical positioning and links to the docs and live examples.
  - `homepage` now points to the documentation site (https://rxova.github.io/react-feedback-stars/) so
    npm and package managers link to the product surface; `repository` and `bugs` still point to GitHub.

## 0.1.0

### Minor Changes

- [`919abfa`](https://github.com/rxova/react-feedback-stars/commit/919abfa8ff2ad1fb8694c9ae7c48bf22f3114e1d) - First release. A headless, zero-dependency React rating component: bring your own
  icon, choose your own precision, accessible by construction.

  **Rendering**

  - Any `ReactNode` as an icon — inline SVG, emoji (including ZWJ sequences), or
    arbitrary JSX. A render function receives per-icon state for conditional icons.
  - Continuous partial fills. `4.3` renders a real 30% fifth icon, not a rounded one.
  - Right-to-left support: the fill origin flips via CSS logical properties.
  - Respects `prefers-reduced-motion`.

  **Rounding**

  Two orthogonal props rather than one overloaded mode: `precision` sets the grid
  (continuous, tenths, halves, whole) and `rounding` sets the direction
  (`nearest` / `down` / `up` / `none`). Out-of-range, `NaN` and `Infinity` values
  clamp instead of throwing — a display component should never crash a page over a
  data value. Snapping is display-only and never rounds a value back into your state.

  **Interaction and forms**

  - Read-only by default. Providing `onChange` upgrades it to a `radiogroup` of real
    radios, so keyboard navigation, focus and form participation come from the
    platform. `disabled` stays a disabled radiogroup rather than degrading to an
    image, so the field remains discoverable to screen readers.
  - One tab stop per rating, including when nothing is selected yet.
  - Keyboard: arrows, digit keys to jump, Backspace/Delete to clear.
  - `onBlur` fires when focus leaves the whole group, not while moving between
    icons, so validation doesn't fire mid-interaction. With `invalid`,
    `aria-describedby` and `name`, it drops into React Hook Form, Formik, React
    Final Form, or a plain `<form>`.

  **Styling**

  No stylesheet to import. Only layout-critical CSS is inlined; everything visual is
  a `--rfs-*` custom property or a `data-*` hook, both covered by semver.

  **Packaging**

  Zero runtime dependencies, `react >= 18` as the only peer, dual ESM/CJS with
  correct types in both, and `useRating` exported separately for fully custom
  renderers (~900 B on its own).

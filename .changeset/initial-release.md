---
'react-feedback-stars': minor
---

First release. A headless, zero-dependency React rating component: bring your own
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

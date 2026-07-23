---
sidebar_position: 2
---

# From `react-stars`

[`react-stars`](https://www.npmjs.com/package/react-stars) is a compact star-rating component with
styling props. This guide maps those props to the component API and CSS custom properties used by
`react-feedback-stars`.

:::note Research date
This API mapping was verified against `react-stars` **2.2.5** on 2026-07-23. Re-verify the mapping if
you use a different version.
:::

## Prop mapping

| `react-stars`         | `react-feedback-stars`          | Notes                                        |
| --------------------- | ------------------------------- | -------------------------------------------- |
| `count={5}`           | `max={5}`                       | Number of icons                              |
| `value={3.5}`         | `value={3.5}`                   | Same prop name                               |
| `half={true}`         | `precision={0.5}`               | `half={false}` → `precision={1}`             |
| `edit={false}`        | `readOnly` (or omit `onChange`) | Read-only equivalent                         |
| `char="●"`            | `icon="●"`                      | Any `ReactNode` — string, emoji, SVG, or JSX |
| `color1` (inactive)   | `--rfs-color-empty`             | A CSS custom property                        |
| `color2` (active)     | `--rfs-color-filled`            | A CSS custom property                        |
| `size="24px"`         | `--rfs-size: 24px`              | A CSS custom property, any unit              |
| `className`           | `className`                     | Same                                         |
| `onChange={(v) => …}` | `onChange={(v) => …}`           | Both emit a **`number`** — no change needed  |

## Before / after

```tsx
// Before — react-stars
<ReactStars
  count={5}
  value={3.5}
  half
  char="★"
  color1="#e0e0e0"
  color2="#f5a623"
  size={24}
  onChange={setScore}
/>
```

```tsx
// After — react-feedback-stars
<Rating
  max={5}
  value={3.5}
  precision={0.5}
  onChange={setScore}
  style={{
    ['--rfs-size' as string]: '24px',
    ['--rfs-color-empty' as string]: '#e0e0e0',
    ['--rfs-color-filled' as string]: '#f5a623',
  }}
/>
```

The default icon is already a star, so `char="★"` usually needs no `icon` at all. For a different
glyph, pass `icon="●"` (or any node).

## Features available after migration

- **Built-in accessibility semantics.** Interactive ratings use native radios in a `radiogroup`;
  read-only ratings use `role="img"`.
- **Flexible icon content.** Icons can be SVGs, images, emoji (including ZWJ sequences), or render
  functions.
- **Exact continuous fills** with explicit `precision` and `rounding` controls.
- **A stable styling contract** through semver-covered `--rfs-*` variables and `data-*` hooks.

## Migration notes

- **Map editability to read-only state.** `edit={false}` becomes `readOnly` (or omit `onChange`).
- **Colors move to CSS.** `color1`/`color2`/`size` become `--rfs-color-empty` /
  `--rfs-color-filled` / `--rfs-size` — set them via `style`, a `className`, or your theme.
- **Emoji keep their own colors.** When using a colored emoji as the icon, see
  [Custom icons](../recipes/custom-icons.md) for styling options.

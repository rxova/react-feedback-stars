---
sidebar_position: 2
---

# From `react-stars`

[`react-stars`](https://www.npmjs.com/package/react-stars) is a small, styling-via-props star rating.
It is easy to drop in, but it renders `<span>`s with **no ARIA, no `tabIndex`, and no keyboard
handling** — mouse only — and its icon is limited to a single character.

:::note Research date
Verified against `react-stars` **2.2.5** (latest; published 2017-11-06) on 2026-07-23. It bundles
`prop-types` and requires no stylesheet (styling is via `color1` / `color2` / `size` / `char`).
Re-verify before relying on these details.
:::

## Prop mapping

| `react-stars`         | `react-feedback-stars`          | Notes                                        |
| --------------------- | ------------------------------- | -------------------------------------------- |
| `count={5}`           | `max={5}`                       | Number of icons                              |
| `value={3.5}`         | `value={3.5}`                   | Same prop name                               |
| `half={true}`         | `precision={0.5}`               | `half={false}` → `precision={1}`             |
| `edit={false}`        | `readOnly` (or omit `onChange`) | **Inverted:** `edit` false = locked          |
| `char="●"`            | `icon="●"`                      | Any `ReactNode` — string, emoji, SVG, or JSX |
| `color1` (inactive)   | `--rfs-color-empty`             | A CSS custom property                        |
| `color2` (active)     | `--rfs-color-filled`            | A CSS custom property                        |
| `size="24px"`         | `--rfs-size: 24px`              | A CSS custom property, any unit              |
| `className`           | `className`                     | Same                                         |
| `onChange={(v) => …}` | `onChange={(v) => …}`           | Both emit a **`number`** — no change needed  |

## Before / after

```tsx
// Before — react-stars
import ReactStars from 'react-stars'
;<ReactStars
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
import { Rating } from 'react-feedback-stars'
;<Rating
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

## What you gain

- **Real accessibility.** Native radios in a `radiogroup` when interactive; `role="img"` when not.
- **Any icon, not one character.** SVG, images, emoji (including ZWJ sequences), and render
  functions — not just a single `char`.
- **Exact continuous fills** and explicit `precision` × `rounding`, instead of whole/half only.
- **A stable styling contract** (semver-covered `--rfs-*` variables and `data-*` hooks) rather than
  a fixed set of color/size props.

## Watch out for

- **`edit` is inverted.** `edit={false}` becomes `readOnly` (or just drop `onChange`).
- **Colors move to CSS.** `color1`/`color2`/`size` become `--rfs-color-empty` /
  `--rfs-color-filled` / `--rfs-size` — set them via `style`, a `className`, or your theme.
- **Emoji ignore `--rfs-color-filled`.** If you used a colored emoji `char`, recolor no longer
  applies; see [Custom icons](../recipes/custom-icons.md).

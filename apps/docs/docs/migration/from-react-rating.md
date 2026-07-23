---
sidebar_position: 1
---

# From `react-rating`

[`react-rating`](https://www.npmjs.com/package/react-rating) (by dreyescat) uses a flexible,
symbol-based range model. This guide maps that API to the icon-count and precision model used by
`react-feedback-stars`.

:::note Research date
This API mapping was verified against `react-rating` **2.0.5** on 2026-07-23. Re-verify the mapping
if you use a different version.
:::

## Prop mapping

| `react-rating`                            | `react-feedback-stars`                | Notes                                                    |
| ----------------------------------------- | ------------------------------------- | -------------------------------------------------------- |
| `initialRating={4}`                       | `value={4}` (or `defaultValue`)       | Controlled `value`, not an initial seed                  |
| `stop={5}` (with `start`/`step`)          | `max={5}`                             | `max` is the icon count directly, not a numeric range    |
| `start` / `step`                          | —                                     | No range model; `max` icons of one unit each             |
| `fractions={2}`                           | `precision={0.5}`                     | `fractions={n}` → `precision={1/n}` (e.g. `4` → `0.25`)  |
| `readonly`                                | `readOnly` (or omit `onChange`)       | Omitting `onChange` is the idiomatic read-only           |
| `direction="rtl"`                         | `dir="rtl"` (or inherit from the DOM) |                                                          |
| `fullSymbol` / `emptySymbol`              | `icon` / `emptyIcon`                  | A `ReactNode` or render function                         |
| `placeholderRating` / `placeholderSymbol` | —                                     | Use `value` + `emptyIcon`; no separate placeholder layer |
| `onChange={(v) => …}`                     | `onChange={(v) => …}`                 | Both emit a **`number`** — no change needed              |
| `onHover={(v) => …}`                      | `onHoverChange={(v) => …}`            | Emits `null` (not `undefined`) when the hover ends       |
| `quiet`                                   | `--rfs-transition`                    | Control motion via CSS instead of a prop                 |

## Before / after

```tsx
// Before — react-rating
<Rating
  initialRating={3.5}
  stop={5}
  fractions={2}
  readonly
  emptySymbol={<span className="icon-star-empty" />}
  fullSymbol={<span className="icon-star-full" />}
  onChange={setScore}
/>
```

```tsx
// After — react-feedback-stars
<Rating
  value={3.5}
  max={5}
  precision={0.5}
  readOnly
  emptyIcon={<StarEmpty />}
  icon={<StarFull />}
  onChange={setScore}
/>
```

## Features available after migration

- **Built-in accessibility semantics.** Interactive ratings use a `radiogroup` of native radios;
  read-only ratings use `role="img"`. Keyboard, focus-visible, and screen-reader behavior is included.
- **Exact continuous fills.** `precision={0}` can render any fractional value, such as `4.28`.
- **Defensive value handling.** Out-of-range, `NaN`, and `Infinity` values are clamped.

## Migration notes

- **Convert subdivisions to a step size.** `fractions` is a count of subdivisions; `precision` is
  the step size.
  `fractions={2}` → `precision={0.5}`, `fractions={4}` → `precision={0.25}`.
- **Represent the displayed score with `value`.** A score previously supplied as a placeholder can
  be passed as `value`.
- **Interactive input needs `precision >= 0.5`.** The radiogroup exposes discrete options, so
  continuous _input_ has no steps to select. Continuous _display_ works at any precision.

---
sidebar_position: 1
---

# From `react-rating`

[`react-rating`](https://www.npmjs.com/package/react-rating) (by dreyescat) is a flexible symbol-based
rating with a range model. Its symbols are configurable, but it renders plain `<span>`s with **no
ARIA roles, no keyboard support, and no focus management** — so it is neither keyboard- nor
screen-reader-operable.

:::note Research date
Verified against `react-rating` **2.0.5** (latest; published 2020-03-25) on 2026-07-23. That release
has no runtime dependencies and requires no stylesheet. Re-verify before relying on these details.
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
import Rating from 'react-rating'
;<Rating
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
import { Rating } from 'react-feedback-stars'
;<Rating
  value={3.5}
  max={5}
  precision={0.5}
  readOnly
  emptyIcon={<StarEmpty />}
  icon={<StarFull />}
  onChange={setScore}
/>
```

## What you gain

- **Real accessibility.** A `radiogroup` of native radios when interactive, `role="img"` when not —
  keyboard, focus-visible, and screen-reader support included.
- **Exact continuous fills.** `precision={0}` renders any fractional value (e.g. `4.28`), not just
  the `1/fractions` grid.
- **No throwing on bad data.** Out-of-range / `NaN` / `Infinity` values clamp instead of erroring.

## Watch out for

- **`fractions` is inverted math.** It is a count of subdivisions; `precision` is the step size.
  `fractions={2}` → `precision={0.5}`, `fractions={4}` → `precision={0.25}`.
- **No `placeholderRating`.** If you used the placeholder purely to show a current score, that is
  just `value`.
- **Interactive input needs `precision >= 0.5`.** `react-rating` let you set very fine `fractions`
  for input; here continuous _input_ is not supported yet (continuous _display_ is).

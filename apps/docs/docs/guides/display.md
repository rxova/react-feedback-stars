---
sidebar_position: 1
---

# Displaying a score

Without an `onChange`, `Rating` is a read-only display: `role="img"` with an accessible label, no tab
stop, and icons hidden from assistive technology. This is the mode for review summaries, listing
scores, and dashboards.

```tsx
import { Rating } from 'react-feedback-stars'

<Rating value={4.3} />                       // continuous — a real 30% fifth star
<Rating value={4.3} precision={1} />         // 4 stars
<Rating value={4.3} precision={0.5} />       // 4.5 stars
<Rating value={4.3} icon="⭐" />              // emoji
<Rating value={3} max={10} icon={<Heart />} emptyIcon={<HeartOutline />} />
```

## Precision and rounding

Two orthogonal props: **`precision`** is the grid a value snaps to, **`rounding`** is the direction
it snaps.

| Intent                       | `precision` | `rounding`  | `4.3` → | `4.7` → |
| ---------------------------- | ----------- | ----------- | ------- | ------- |
| Exact / continuous (default) | `0`         | `'none'`    | `4.3`   | `4.7`   |
| Round to whole               | `1`         | `'nearest'` | `4`     | `5`     |
| Floor / truncate             | `1`         | `'down'`    | `4`     | `4`     |
| Ceil                         | `1`         | `'up'`      | `5`     | `5`     |
| Half stars                   | `0.5`       | `'nearest'` | `4.5`   | `4.5`   |
| Half stars, never inflate    | `0.5`       | `'down'`    | `4`     | `4.5`   |
| Tenths                       | `0.1`       | `'nearest'` | `4.3`   | `4.7`   |

Snapping is **display-only**. A `value` of `4.28` shown as whole stars renders `4`, but is never
rounded back into your state — the component never calls `onChange` to “correct” a value.

:::note Never crashes on bad data
Out-of-range, `NaN`, and `Infinity` values clamp to `[0, max]` rather than throwing. A display
component must not crash a page over a data value from an API.
:::

## Icon count

`max` sets how many icons render (a positive integer, default `5`). It is independent of the value —
`value={3} max={10}` is three of ten.

```tsx
<Rating value={7.5} max={10} />
```

## Custom icons

Any `ReactNode` is a valid icon: an inline SVG, an emoji string, an `<img>`, or arbitrary JSX. Pass
`emptyIcon` for a distinct empty/track icon; omit it and the empty layer is the same icon dimmed via
a filter.

```tsx
<Rating value={3.5} icon={<HeartFilled />} emptyIcon={<HeartOutline />} />
```

An `icon` (or `emptyIcon`) can also be a **function** that receives per-icon state and returns a
node — useful for conditional rendering per position:

```tsx
<Rating value={2.5} icon={(s) => <span>{s.partial ? '◐' : s.filled ? '●' : '○'}</span>} />
```

The state object is `{ index, fill, filled, empty, partial, active }`. See
[Custom icons](../recipes/custom-icons.md) for the full pattern and the emoji color-font caveat.

## Sizing

Size is a single custom property, in any unit, set wherever is convenient:

```tsx
<Rating value={3.7} style={{ ['--rfs-size' as string]: '2.5rem' }} />
```

More visual knobs — colors, gap, the empty-layer filter — are in [Styling](./styling.md).

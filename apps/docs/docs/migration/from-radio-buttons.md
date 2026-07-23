---
sidebar_position: 3
---

# From hand-rolled radio buttons

A well-built rating input is usually a group of radio buttons under the hood — which is exactly what
`react-feedback-stars` renders in interactive mode. If you have a bespoke radio-based star widget,
this is less a migration than a consolidation: you keep the semantics you already got right and drop
the CSS gymnastics.

## The pattern you probably have

```tsx
// Before — a hand-rolled radiogroup
<fieldset role="radiogroup" aria-label="Rating">
  {[1, 2, 3, 4, 5].map((n) => (
    <label key={n}>
      <input
        type="radio"
        name="rating"
        value={n}
        checked={score === n}
        onChange={() => setScore(n)}
      />
      <span className="sr-only">{n} stars</span>
      <StarIcon filled={n <= score} />
    </label>
  ))}
</fieldset>
```

This is the right foundation, but by hand you still have to solve: partial/half fills, hover
preview, arrow-key semantics that match a radiogroup, RTL fill direction, the focus ring not being
clipped by the fill layer, `prefers-reduced-motion`, and `onBlur` that fires on group exit rather
than between icons.

## After

```tsx
// After — react-feedback-stars
<Rating name="rating" value={score} onChange={setScore} max={5} precision={0.5} label="Rating" />
```

Same DOM contract — a `radiogroup` of native radios, one tab stop, submits under `name` — with the
hard parts handled.

## Mapping your building blocks

| Your hand-rolled piece                       | `react-feedback-stars`                       |
| -------------------------------------------- | -------------------------------------------- |
| `role="radiogroup"` + `<input type="radio">` | Rendered for you when `onChange` is set      |
| `name` on each input                         | `name` prop (posts natively)                 |
| `checked` / `onChange` wiring                | `value` / `onChange`                         |
| `aria-label` on the group                    | `label` (or `formatLabel`)                   |
| Per-option `sr-only` text                    | `formatOptionLabel(value, max)`              |
| `.sr-only` visually-hidden CSS               | Built in                                     |
| Manual half-fill CSS                         | `precision={0.5}` + exact fill geometry      |
| `aria-invalid` / error `aria-describedby`    | `invalid` + `aria-describedby`               |
| Hover state bookkeeping                      | `onHoverChange` (or nothing — it just works) |

## Keep your validation

Because `name`, `onBlur`, `invalid`, `required`, and `aria-describedby` are all first-class, your
existing form wiring ports directly — see [Forms](../guides/forms.md) and the per-library
[recipes](../recipes/react-hook-form.md). If you were validating on blur, note that `onBlur` here
fires when focus leaves the **whole group**, not between icons, which is usually what you wanted
anyway.

## When to keep rolling your own

If your widget is genuinely bespoke — a non-linear scale, per-option custom content, an entirely
different interaction — reach for `useRating` instead of `Rating`. It gives you the same state
machine (value, hover, focus, fills, steps, group blur) in ~900 B, and you render the DOM. See the
[API reference](/api).

# react-feedback-stars

<p align="center">
  <img src="./assets/react-feedback-stars.png" alt="react-feedback-stars logo" width="180" />
</p>

<p align="center">
  <a href="https://github.com/jonakrusze/react-feedback-stars/actions/workflows/ci.yml"><img src="https://github.com/jonakrusze/react-feedback-stars/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI status" /></a>
  <img src="https://img.shields.io/badge/brotli-%E2%89%A4%203%20kB-f5a623" alt="Brotli size at most 3 kB" />
  <img src="https://img.shields.io/badge/coverage%20threshold-95%25-brightgreen" alt="Coverage threshold: 95% per file" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white" alt="TypeScript strict mode" />
  <img src="https://img.shields.io/badge/dependencies-0-44cc11" alt="Zero runtime dependencies" />
  <img src="https://img.shields.io/badge/React-%E2%89%A518-61dafb?logo=react&logoColor=white" alt="React 18 or newer" />
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT license" /></a>
</p>

Headless, zero-dependency React rating component. **Any icon, any precision, accessible.**

```bash
pnpm add react-feedback-stars
```

- **Bring your own icon** — SVG, emoji, image, arbitrary JSX
- **Any precision** — continuous `4.3`, halves, tenths, or whole stars, with the rounding
  direction you choose
- **Accessible** — real radios in a radiogroup when interactive, `role="img"` when not
- **Zero runtime dependencies**, ~2.3 kB brotli, no stylesheet to import
- **Form-ready** — first-class React Hook Form / Formik / React Final Form integration

## Display

```tsx
import { Rating } from 'react-feedback-stars'

<Rating value={4.3} />                       // continuous — a real 30% fifth star
<Rating value={4.3} precision={1} />         // 4 stars
<Rating value={4.3} precision={0.5} />       // 4.5 stars
<Rating value={4.3} icon="⭐" />              // emoji
<Rating value={3} max={10} icon={<Heart />} emptyIcon={<HeartOutline />} />
```

## Rounding

Two orthogonal props: `precision` is the grid, `rounding` is the direction.

| Intent                       | `precision` | `rounding`  | `4.3` → | `4.7` → |
| ---------------------------- | ----------- | ----------- | ------- | ------- |
| Exact / continuous (default) | `0`         | `'none'`    | `4.3`   | `4.7`   |
| Round to whole               | `1`         | `'nearest'` | `4`     | `5`     |
| Floor / truncate             | `1`         | `'down'`    | `4`     | `4`     |
| Ceil                         | `1`         | `'up'`      | `5`     | `5`     |
| Half stars                   | `0.5`       | `'nearest'` | `4.5`   | `4.5`   |
| Half stars, never inflate    | `0.5`       | `'down'`    | `4`     | `4.5`   |
| Tenths                       | `0.1`       | `'nearest'` | `4.3`   | `4.7`   |

Snapping is **display-only**. A `value` of `4.28` shown as whole stars renders `4` but is never
rounded back into your state. Out-of-range, `NaN` and `Infinity` clamp to `[0, max]` rather than
throwing — a display component must never crash a page over a data value.

## Interactive

Providing `onChange` makes it an input. Nothing else changes.

```tsx
const [score, setScore] = useState(0)

<Rating value={score} onChange={setScore} precision={0.5} label="Rate your meal" />
```

Renders a `radiogroup` of visually-hidden native radios, so arrow keys, form participation,
focus-visible and screen-reader announcements all come from the platform rather than from
hand-rolled JavaScript.

> Interactive mode requires `precision >= 0.5`. Continuous input needs `role="slider"`, which is
> planned for v2.

## Forms

`onChange` emits a **`number`, not an event**, so `{...register('rating')}` will not work. Every
library below has a controlled adapter — that is the supported path, and it is one line longer.

<details>
<summary><b>React Hook Form</b></summary>

```tsx
<Controller
  name="rating"
  control={control}
  rules={{ min: { value: 1, message: 'Please rate' } }}
  render={({ field, fieldState }) => (
    <>
      <Rating
        {...field} // value, onChange, onBlur, name, ref all line up
        precision={0.5}
        invalid={fieldState.invalid}
        aria-describedby={fieldState.error ? 'rating-err' : undefined}
      />
      {fieldState.error && <p id="rating-err">{fieldState.error.message}</p>}
    </>
  )}
/>
```

</details>

<details>
<summary><b>Formik</b></summary>

```tsx
const [field, meta, helpers] = useField('rating')

<Rating
  name="rating"
  value={field.value}
  onChange={helpers.setValue}
  onBlur={field.onBlur}
  invalid={meta.touched && !!meta.error}
/>
```

</details>

<details>
<summary><b>React Final Form</b></summary>

```tsx
<Field name="rating">
  {({ input, meta }) => (
    <Rating
      value={typeof input.value === 'number' ? input.value : 0} // RFF uses '' when empty
      onChange={input.onChange}
      onBlur={input.onBlur}
      invalid={meta.touched && !!meta.error}
    />
  )}
</Field>
```

</details>

`onBlur` fires only when focus leaves the **whole group**, never when arrowing between icons —
so validation doesn't fire while the user is still choosing.

With a plain `<form>`, just pass `name` and the value posts natively.

## Styling

No stylesheet to import. Only layout-critical CSS is inlined; everything visual is a custom
property.

```css
[data-rfs-root] {
  --rfs-size: 1.25rem;
  --rfs-gap: 0.125rem;
  --rfs-color-filled: #f5a623;
  --rfs-color-empty: #d8d8d8;
  --rfs-color-hover: var(--rfs-color-filled);
  --rfs-empty-filter: grayscale(1) opacity(0.35);
  --rfs-transition: 120ms;
  --rfs-focus-ring: 2px solid Highlight;
}
```

Stable selector hooks, covered by semver: `[data-rfs-root]`, `[data-rfs-item]`,
`[data-rfs-layer="fill"|"empty"]`, `[data-state="full"|"partial"|"empty"]`, `[data-active]`,
`[data-readonly]`, `[data-disabled]`, `[data-invalid]`.

### Emoji

Emoji work anywhere an icon does, with one caveat worth knowing: they render from a colour font,
so `--rfs-color-filled` has **no effect** on them. That is why the implicit empty layer is dimmed
with `--rfs-empty-filter` (a `grayscale`/`opacity` filter) rather than with colour — filters work
on emoji and SVG alike. Pass an explicit `emptyIcon` and no filter is applied.

## Props

See [`src/types.ts`](./src/types.ts) for the full annotated interface — every prop carries a
TSDoc comment explaining what it does and why it exists.

## Headless

`useRating` exposes the state machine — value, hover preview, focus, group blur, fills and steps
— if you want to render the whole thing yourself. ~864 B on its own.

## Accessibility

| Mode        | Semantics                                                         |
| ----------- | ----------------------------------------------------------------- |
| Read-only   | `role="img"` with an `aria-label`; icons hidden; not a tab stop   |
| Interactive | `role="radiogroup"` of native radios; one tab stop; arrow-key nav |

Also handled: visible focus ring that the fill layer's `overflow: hidden` cannot clip,
`prefers-reduced-motion`, RTL (the fill origin flips via CSS logical properties), and
`aria-invalid` / `aria-describedby` wiring for form errors.

**Known limitation:** at `precision={0.5}` each half-star target is narrower than the WCAG 2.2
§2.5.8 24×24 px minimum. That is inherent to half-star input. Use `precision={1}` or a larger
`--rfs-size` where that matters.

## License

MIT

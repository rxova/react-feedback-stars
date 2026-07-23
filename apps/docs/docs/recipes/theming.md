---
sidebar_position: 5
---

# Theming

Everything visual is a `--rfs-*` custom property (see [Styling](../guides/styling.md) for the full
list). That means you can theme the component with whatever styling tool you already use — no wrapper
component, no `!important`, no reaching into internals.

## Plain CSS

```css
.rating-brand {
  --rfs-size: 1.5rem;
  --rfs-gap: 0.25rem;
  --rfs-color-filled: #6d28d9;
  --rfs-color-empty: #e5e7eb;
}
```

```tsx
<Rating className="rating-brand" value={4.3} />
```

## CSS Modules

```css title="Rating.module.css"
.brand {
  --rfs-color-filled: #6d28d9;
  --rfs-color-hover: #7c3aed;
}
```

```tsx
import styles from './Rating.module.css'

;<Rating className={styles.brand} value={4.3} />
```

## Tailwind CSS

Set the custom properties with arbitrary properties, no plugin required:

```tsx
<Rating value={4.3} className="[--rfs-color-filled:theme(colors.violet.600)] [--rfs-size:1.5rem]" />
```

Or map them to your design tokens in a component layer:

```css
@layer components {
  .rating {
    --rfs-color-filled: theme(colors.violet.600);
    --rfs-color-empty: theme(colors.gray.200);
  }
}
```

## styled-components / Emotion

Because the knobs are custom properties, a styled wrapper only needs to _set variables_ — it never
has to know the component's internals:

```tsx
import styled from 'styled-components'
import { Rating } from 'react-feedback-stars'

const BrandRating = styled(Rating)`
  --rfs-color-filled: ${(p) => p.theme.colors.brand};
  --rfs-color-empty: ${(p) => p.theme.colors.subtle};
  --rfs-size: 1.5rem;
`
```

None of these add a runtime dependency to `react-feedback-stars` — they are entirely your styling
layer setting variables the component reads.

## Per-state theming

Target the semver-stable `data-*` hooks to theme states — for example, a red error look driven only
by the `invalid` prop:

```css
[data-rfs-root][data-invalid] {
  --rfs-color-filled: #dc2626;
  --rfs-color-empty: #fecaca;
}
```

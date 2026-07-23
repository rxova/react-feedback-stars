---
sidebar_position: 4
---

# Styling

There is no stylesheet to import. Only layout-critical CSS is inlined by the component; everything
visual is a **CSS custom property** or a **`data-*` hook** you target from your own styles.

## Custom properties

Set these on `[data-rfs-root]` (or any ancestor — they cascade):

```css
[data-rfs-root] {
  --rfs-size: 1.25rem; /* icon size, any unit */
  --rfs-gap: 0.125rem; /* space between icons */
  --rfs-color-filled: #f5a623; /* filled icon color */
  --rfs-color-empty: #d8d8d8; /* empty icon color */
  --rfs-color-hover: var(--rfs-color-filled); /* hover preview color */
  --rfs-empty-filter: grayscale(1) opacity(0.35); /* implicit empty layer */
  --rfs-transition: 120ms; /* fill/hover transition */
  --rfs-focus-ring: 2px solid Highlight; /* keyboard focus ring */
}
```

Because they are custom properties, you can scope them per instance with `style`, per theme with a
class, or globally on `:root`.

## Data-attribute hooks

These selectors are **stable and covered by semver** — safe to target from a design system:

| Selector                                  | What it marks                                  |
| ----------------------------------------- | ---------------------------------------------- |
| `[data-rfs-root]`                         | The root element                               |
| `[data-rfs-item]`                         | One icon slot                                  |
| `[data-rfs-layer="fill"\|"empty"]`        | The fill layer vs. the empty/track layer       |
| `[data-state="full"\|"partial"\|"empty"]` | Per-icon fill state                            |
| `[data-active]`                           | Icons under the current hover/keyboard preview |
| `[data-readonly]`                         | Present in read-only mode                      |
| `[data-disabled]`                         | Present when disabled                          |
| `[data-invalid]`                          | Present when `invalid`                         |

```css
/* Tint the error state without touching component internals. */
[data-rfs-root][data-invalid] {
  --rfs-color-empty: #f3c2c2;
  --rfs-color-filled: #d64545;
}
```

## Emoji and color fonts

Emoji render from a **color font**, so `--rfs-color-filled` has no effect on them — you cannot
recolor an emoji with CSS `color`. That is exactly why the implicit empty layer is dimmed with
`--rfs-empty-filter` (a `grayscale`/`opacity` filter) rather than with color: filters work on emoji
and SVG alike.

If you pass an explicit `emptyIcon`, no filter is applied — you are supplying the empty look
yourself.

## Motion and focus

- The fill/hover transition uses `--rfs-transition` and is dropped automatically under
  `prefers-reduced-motion: reduce`.
- The focus ring (`--rfs-focus-ring`) is drawn so the fill layer's `overflow: hidden` cannot clip it.

More theming patterns — Tailwind, CSS Modules, styled-components — are in
[Theming recipes](../recipes/theming.md).

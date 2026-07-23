---
sidebar_position: 2
---

# Why this exists

Most React “star rating” widgets make three assumptions that fall apart in production:

1. **Stars are hardcoded.** You get a star, maybe a color, maybe a size. The moment design asks for
   hearts, an emoji, or your own SVG, you are forking the library.
2. **Precision is a boolean.** `half={true}` is the ceiling. A backend that returns `4.28` has
   nowhere to go — it is either rounded away or it throws.
3. **Accessibility is absent.** Bare `<div>`s with `onClick`. No role, no keyboard, invisible to a
   screen reader.

`react-feedback-stars` treats a rating as a **primitive**, not a widget. It owns exactly two things —
_geometry_ and _semantics_ — and hands appearance entirely to you.

## Exact fractional geometry

A score like `4.3` is drawn as four full icons and a fifth icon clipped to **30% width** with a CSS
overflow layer. The fill is a real measurement, not one of a few baked-in states, so any value in
`[0, max]` renders precisely. Because the fill is a width clip over whatever icon you pass, it works
identically for SVG, emoji, an `<img>`, or arbitrary JSX.

Rounding is a separate, explicit decision (see [Displaying a score](../guides/display.md)): two
orthogonal props, `precision` (the grid) and `rounding` (the direction). Snapping is **display-only**
and never writes a rounded value back into your state.

:::note A display component must never crash a page
Out-of-range values, `NaN`, and `Infinity` clamp to `[0, max]` rather than throwing. A score is
data; rendering it should never take down the page around it.
:::

## Accessibility by construction

| Mode        | Semantics                                                         |
| ----------- | ----------------------------------------------------------------- |
| Read-only   | `role="img"` with an `aria-label`; icons hidden; not a tab stop   |
| Interactive | `role="radiogroup"` of native radios; one tab stop; arrow-key nav |

Providing `onChange` is the _only_ thing that flips read-only into interactive. Because interactive
mode renders **real, visually-hidden radio inputs**, keyboard navigation, focus-visible, form
participation, and screen-reader announcements come from the browser — not from JavaScript that has
to reimplement them (imperfectly). Details in [Accessibility](../guides/accessibility.md).

## Small, honest packaging

- **Zero runtime dependencies.** `react` is the only peer.
- **No stylesheet.** Only layout-critical CSS is inlined; everything visual is a `--rfs-*` custom
  property or a `data-*` hook, both covered by semver.
- **~2.5 kB brotli** for the full component; `useRating` is ~900 B on its own for a fully custom
  renderer.
- Dual ESM/CJS with correct types in both, verified in CI by `publint` and
  `@arethetypeswrong/cli`, plus a real pack-and-import smoke test.

The result is a component you can adopt in a design system without inheriting a design, and drop
into a production form without auditing it for accessibility first.

---
sidebar_position: 1
slug: /
---

# Getting started

**react-feedback-stars** is a headless React rating component. _Any icon, any precision,
accessible._ It renders a score as a row of repeated icons — stars, hearts, emoji, or any
`ReactNode` — with exact partial fills, and upgrades to a fully accessible input the moment you
give it an `onChange`.

:::tip What makes it different

1. **Accessibility is built in** — native radios in a radiogroup, keyboard support, RTL, form-error
   wiring, and tested screen-reader semantics.
2. **Fractional display is exact and icon-agnostic** — `4.3` renders a real 30% fifth icon, with
   SVG, emoji, images, or custom JSX.
3. **Zero runtime dependencies** and no stylesheet to import.
4. It works as **both a read-only score and an interactive form control** — same component.
5. The public API is small, typed, and backed by browser, SSR, packaging, and accessibility tests.
   :::

## Install

```bash
pnpm add react-feedback-stars     # or: npm i / yarn add / bun add
```

`react` (>= 18) is the only peer dependency. There is nothing else to install and no CSS to import.

## Show a score

The default is a read-only, **continuous** display — no rounding, no interaction. **Edit the code
below** — every `live` example on this site renders for real (`Rating` is already imported):

```tsx live
<Rating value={4.3} /> // a real 30%-filled fifth star
```

That renders `role="img"` with an accessible label like _“4.3 out of 5”_, and it is not a tab stop.
See [Displaying a score](../guides/display.md) for precision, rounding, and custom icons.

## Take a rating

Provide `onChange` and the same component becomes an input — a `radiogroup` of real, keyboard-driven
radios:

```tsx live
function RateYourMeal() {
  const [score, setScore] = useState(0)
  return <Rating value={score} onChange={setScore} precision={0.5} label="Rate your meal" />
}
```

Arrow keys, focus-visible, and screen-reader announcements all come from the platform rather than
from hand-rolled JavaScript. See [Taking a rating](../guides/interactive.md).

## Drop it into a form

`onChange` emits a **`number`, not an event**, so it pairs with the controlled adapter of every
major form library — one line longer than a native input, and fully validated:

- [React Hook Form](../recipes/react-hook-form.md)
- [Formik](../recipes/formik.md)
- [React Final Form](../recipes/react-final-form.md)
- [A plain `<form>`](../recipes/native-forms.md)

## Where to next

- [Why this exists](./why.md) — the geometry and accessibility decisions behind the component.
- [Guides](../guides/display.md) — display, interaction, forms, styling, and accessibility in depth.
- [Recipes](../recipes/theming.md) — copy-paste theming and custom-icon patterns.
- [Migrating](../migration/from-react-rating.md) — coming from `react-rating`, `react-stars`, or a
  hand-rolled radio widget.
- [API reference](/api) — generated from the source on every build.

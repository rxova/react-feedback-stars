---
sidebar_position: 5
---

# Accessibility

Accessibility is the reason this component renders the DOM it does. It is not a prop you turn on — it
is how the component is built.

## Two modes, two correct semantics

| Mode        | Semantics                                                         |
| ----------- | ----------------------------------------------------------------- |
| Read-only   | `role="img"` with an `aria-label`; icons hidden; not a tab stop   |
| Interactive | `role="radiogroup"` of native radios; one tab stop; arrow-key nav |

A **display** is an image of a score — one labelled thing, not a list of focusable stars. An
**input** is a set of mutually exclusive choices — exactly a radio group. The component picks the
right one based on whether you passed `onChange`.

## Native radios, not fake ones

Interactive mode renders **visually-hidden native `<input type="radio">`** elements inside a
`radiogroup`. This is deliberate: keyboard navigation, `:focus-visible`, form participation, and
screen-reader announcements are provided by the browser. Reimplementing them in JavaScript is where
most rating widgets get accessibility subtly wrong.

## Labels

- `label` sets the group's accessible name (_“Rate your meal”_).
- Without `label`, the name is generated as `"${value} out of ${max}"`; customize it with
  `formatLabel(value, max)`.
- `formatOptionLabel(value, max)` names each individual option (each radio), e.g. _“3 of 5”_.

```tsx
<Rating
  value={score}
  onChange={setScore}
  label="Overall satisfaction"
  formatOptionLabel={(v, max) => `${v} of ${max} stars`}
/>
```

## Form errors

`invalid` sets `aria-invalid` (and a `data-invalid` styling hook), and `aria-describedby` wires the
group to your external error text so it is announced:

```tsx
<>
  <Rating
    value={value}
    onChange={onChange}
    invalid={hasError}
    aria-describedby={hasError ? 'rating-error' : undefined}
  />
  {hasError && <p id="rating-error">Please choose a rating.</p>}
</>
```

## Also handled

- **RTL** — the fill origin flips via CSS logical properties; arrow-key direction follows text
  direction.
- **`prefers-reduced-motion`** — the fill/hover transition is dropped.
- **Focus ring** — drawn so the fill layer's `overflow: hidden` cannot clip it.
- **`onBlur` timing** — fires when focus leaves the whole group, not between icons, so validation
  does not fire mid-interaction.

## Known limitation: half-star targets

At `precision={0.5}`, each half-star hit target is narrower than the WCAG 2.2 §2.5.8 minimum of
24×24 px. This is inherent to half-star input — two targets share one icon's width. Where that
matters, use `precision={1}` or increase `--rfs-size`.

Every claim on this page is covered by the automated accessibility suite (axe scans of the full
page, in LTR, RTL, and error states) that runs in CI.

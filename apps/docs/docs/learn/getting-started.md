---
sidebar_position: 1
sidebar_label: Getting started
slug: /
---

# react-feedback-stars

**Any icon, any precision, accessible.** A headless, zero-dependency React rating component. It
renders a score as a row of icons with exact partial fills — and becomes a fully accessible input
the moment you add `onChange`.

## Try it

Change the precision, swap the icon, toggle interactive mode — or edit the code. It renders and runs
right here (`Rating` and `useState` are already in scope).

```tsx live
function TryIt() {
  const [value, setValue] = useState(3.5)
  const [precision, setPrecision] = useState(0.5)
  const [icon, setIcon] = useState('★')
  const [interactive, setInteractive] = useState(true)

  const chip = (on) => ({
    padding: '3px 11px',
    marginRight: 6,
    borderRadius: 999,
    cursor: 'pointer',
    border: '1px solid var(--ifm-color-emphasis-300)',
    background: on ? 'var(--ifm-color-primary)' : 'transparent',
    color: on ? '#fff' : 'inherit',
  })

  return (
    <div>
      <div style={{ fontSize: '2.75rem', lineHeight: 1, minHeight: '3rem' }}>
        <Rating
          value={value}
          onChange={interactive ? setValue : undefined}
          precision={precision}
          icon={icon}
          label="Try react-feedback-stars"
        />
      </div>
      <p style={{ margin: '0.5rem 0 1rem', color: 'var(--ifm-color-emphasis-700)' }}>
        value = <b>{value}</b>
        {interactive ? ' — click or use the arrow keys' : ' — read-only display'}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
        <span>
          precision{' '}
          <button style={chip(precision === 0)} onClick={() => setPrecision(0)}>
            continuous
          </button>
          <button style={chip(precision === 0.5)} onClick={() => setPrecision(0.5)}>
            half
          </button>
          <button style={chip(precision === 1)} onClick={() => setPrecision(1)}>
            whole
          </button>
        </span>
        <span>
          icon{' '}
          <button style={chip(icon === '★')} onClick={() => setIcon('★')}>
            ★
          </button>
          <button style={chip(icon === '⭐')} onClick={() => setIcon('⭐')}>
            ⭐
          </button>
          <button style={chip(icon === '❤️')} onClick={() => setIcon('❤️')}>
            ❤️
          </button>
        </span>
        <label style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={interactive}
            onChange={(e) => setInteractive(e.target.checked)}
          />{' '}
          interactive
        </label>
      </div>
    </div>
  )
}
```

## Install

```bash
pnpm add react-feedback-stars     # or: npm i / yarn add / bun add
```

`react` (>= 18) is the only peer dependency — nothing else to install, and no stylesheet to import.
Then it is one import: `import { Rating } from 'react-feedback-stars'`. A read-only score is
`<Rating value={4.3} />`; adding `onChange` is the only difference for an interactive input.

## Why this one, not another star widget

- **Accessibility is built in.** Native radios in a radiogroup when interactive, `role="img"` when
  not — keyboard, focus-visible, RTL, and form-error wiring, all tested.
- **Fractional display is exact and icon-agnostic.** `4.3` is a 30%-filled fifth icon — with SVG,
  emoji, images, or custom JSX, not one of a few baked-in half-steps.
- **Zero runtime dependencies**, ~2.5 kB brotli, and no CSS to import.
- **One component, two modes.** A read-only score and an interactive form control — adding `onChange`
  is the only difference.
- **Small, typed API**, backed by browser, SSR, packaging, and accessibility tests.

More on the geometry and accessibility decisions in [Why this exists](./why.md).

## Into a form in one line

`onChange` emits a **`number`, not an event**, so it drops into the controlled adapter of every major
form library:

[React Hook Form](../recipes/react-hook-form.md) · [Formik](../recipes/formik.md) ·
[React Final Form](../recipes/react-final-form.md) · [TanStack Form](../recipes/tanstack-form.md) ·
[plain `<form>`](../recipes/native-forms.md)

## Next

- [Displaying a score](../guides/display.md) — precision, rounding, and custom icons
- [Taking a rating](../guides/interactive.md) — interaction, keyboard, and hover
- [Accessibility](../guides/accessibility.md) · [Styling](../guides/styling.md)
- [Migrating](../migration/from-react-rating.md) from `react-rating`, `react-stars`, or a radio widget
- [API reference](/api) — generated from the source on every build

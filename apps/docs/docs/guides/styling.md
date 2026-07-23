---
sidebar_position: 4
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Styling

There is no stylesheet to import. `Rating` inlines only the handful of declarations that make the
layout work (the flex row, the two stacked layers, the clip that reveals a partial fill). Everything
_visual_ — size, spacing, colour, motion, focus — is exposed as either a **CSS custom property** you
set, or a **`data-*` hook** you target from your own CSS.

That means you style it the way you style your own components: no wrapper, no `!important`, no
reaching into internals, no class-name lottery. Every knob on this page is **live** — edit any demo
and watch the real component react.

:::tip Everything below is editable
The blocks marked **Live** render the actual component. Change a number or a colour and it updates
instantly.
:::

## The anatomy of one icon

Knowing what the properties _target_ makes the rest of the page obvious. Each icon slot is two
absolutely-stacked layers inside a sized box:

```
[data-rfs-root]                     ← the flex row; --rfs-gap separates items
 └─ [data-rfs-item]                 ← one icon slot; --rfs-size sets its font-size (the box)
     ├─ [data-rfs-layer="empty"]    ← the track, full width; --rfs-color-empty (+ --rfs-empty-filter)
     └─ [data-rfs-layer="fill"]     ← the fill, clipped to the value's %; --rfs-color-filled
```

The fill layer sits on top of the empty layer and is clipped to a percentage width, so a `4.3`
rating reveals 30% of the fifth icon. Because the box is sized by **`font-size`**, an emoji (which
scales by font-size, not `width`/`height`) sizes identically to an inline SVG.

## Interactive playground

Drag the sliders and pick colours — the box at the top is a real, interactive `Rating`, and the
panel underneath is the exact CSS you'd paste into your own stylesheet.

```tsx live
function StylingPlayground() {
  const [size, setSize] = useState(2.5)
  const [gap, setGap] = useState(0.25)
  const [filled, setFilled] = useState('#f5a623')
  const [empty, setEmpty] = useState('#d8d8d8')
  const [hover, setHover] = useState('#f5a623')
  const [transition, setTransition] = useState(120)
  const [score, setScore] = useState(3.5)

  const vars = {
    '--rfs-size': `${size}rem`,
    '--rfs-gap': `${gap}rem`,
    '--rfs-color-filled': filled,
    '--rfs-color-empty': empty,
    '--rfs-color-hover': hover,
    '--rfs-transition': `${transition}ms`,
  }

  const Row = ({ label, children }) => (
    <label
      style={{
        display: 'grid',
        gridTemplateColumns: '7rem 1fr auto',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      <span style={{ fontSize: '0.85rem' }}>{label}</span>
      {children}
    </label>
  )

  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      <div style={{ minHeight: `${size * 1.4}rem`, display: 'flex', alignItems: 'center' }}>
        <Rating value={score} onChange={setScore} precision={0.5} style={vars} label="Playground" />
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', maxWidth: 460 }}>
        <Row label="size">
          <input
            type="range"
            min={1}
            max={6}
            step={0.25}
            value={size}
            onChange={(e) => setSize(+e.target.value)}
          />
          <code>{size}rem</code>
        </Row>
        <Row label="gap">
          <input
            type="range"
            min={0}
            max={1.5}
            step={0.05}
            value={gap}
            onChange={(e) => setGap(+e.target.value)}
          />
          <code>{gap}rem</code>
        </Row>
        <Row label="transition">
          <input
            type="range"
            min={0}
            max={800}
            step={20}
            value={transition}
            onChange={(e) => setTransition(+e.target.value)}
          />
          <code>{transition}ms</code>
        </Row>
        <Row label="filled">
          <input type="color" value={filled} onChange={(e) => setFilled(e.target.value)} />
          <code>{filled}</code>
        </Row>
        <Row label="empty">
          <input type="color" value={empty} onChange={(e) => setEmpty(e.target.value)} />
          <code>{empty}</code>
        </Row>
        <Row label="hover">
          <input type="color" value={hover} onChange={(e) => setHover(e.target.value)} />
          <code>{hover}</code>
        </Row>
      </div>

      <pre style={{ margin: 0 }}>
        {`[data-rfs-root] {\n${Object.entries(vars)
          .map(([k, v]) => `  ${k}: ${v};`)
          .join('\n')}\n}`}
      </pre>
    </div>
  )
}
```

## Every custom property

The complete set. Every one has a fallback baked in, so you only override what you care about.

| Property                  | Default                      | Controls                                                       |
| ------------------------- | ---------------------------- | -------------------------------------------------------------- |
| `--rfs-size`              | `1.25rem`                    | Icon size. Any unit — it's a `font-size`, so `em`/`%` cascade. |
| `--rfs-gap`               | `0.125rem`                   | Horizontal space between icons.                                |
| `--rfs-color-filled`      | `#f5a623`                    | Colour of the filled (fill-layer) icon.                        |
| `--rfs-color-empty`       | `#d8d8d8`                    | Colour of the empty (track) icon.                              |
| `--rfs-color-hover`       | `var(--rfs-color-filled)`    | Colour of the hover/keyboard preview fill.                     |
| `--rfs-empty-filter`      | `grayscale(1) opacity(0.35)` | CSS `filter` on the _implicit_ empty layer (see below).        |
| `--rfs-transition`        | `120ms`                      | Duration of the fill/preview width transition.                 |
| `--rfs-focus-ring`        | `2px solid Highlight`        | `outline` shorthand drawn on the focused icon.                 |
| `--rfs-focus-ring-offset` | `2px`                        | `outline-offset` of the focus ring.                            |
| `--rfs-focus-ring-radius` | `2px`                        | `border-radius` of the focus ring.                             |

Because they're custom properties, they **cascade**. Set them on `[data-rfs-root]`, on the element's
`style` prop, on a wrapper `class`, or on `:root` for the whole app — whatever scope you want.

### Size — `--rfs-size`

Size is a single property, in any unit. Set it inline for one instance, or on an ancestor to size a
whole group. Since it's a `font-size`, relative units (`em`, `%`) inherit naturally.

```tsx live
<div style={{ display: 'grid', gap: '0.75rem' }}>
  <Rating value={3.5} style={{ '--rfs-size': '1rem' }} />
  <Rating value={3.5} style={{ '--rfs-size': '1.75rem' }} />
  <Rating value={3.5} style={{ '--rfs-size': '3rem' }} />
</div>
```

### Gap — `--rfs-gap`

The space between icons. `0` packs them flush; larger values give an airier row.

```tsx live
<div style={{ display: 'grid', gap: '0.75rem', fontSize: '1.75rem' }}>
  <Rating value={3.5} style={{ '--rfs-gap': '0' }} />
  <Rating value={3.5} style={{ '--rfs-gap': '0.25rem' }} />
  <Rating value={3.5} style={{ '--rfs-gap': '0.75rem' }} />
</div>
```

### Colours — filled, empty, hover

Three independent colours. `--rfs-color-hover` defaults to `--rfs-color-filled`, so a rating with no
hover colour set previews in its fill colour; override it for a distinct “I'm about to pick this”
tint. **Hover over the interactive one** to see the hover colour.

```tsx live
function Colours() {
  const [score, setScore] = useState(3)
  const brand = {
    '--rfs-color-filled': '#6d28d9',
    '--rfs-color-empty': '#e5e7eb',
    '--rfs-color-hover': '#c026d3',
    '--rfs-size': '2rem',
  }
  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <Rating value={3.5} style={brand} />
      <Rating value={score} onChange={setScore} precision={0.5} style={brand} label="Pick" />
    </div>
  )
}
```

:::caution Colour is a no-op on emoji
Emoji render from a **colour font** (COLR/CBDT), so `--rfs-color-filled` and `--rfs-color-empty` have
no effect on them — you cannot recolour 🌟 with CSS `color`. That's exactly why the empty layer is
dimmed with a **filter** instead. See the next section.
:::

### The empty layer — `--rfs-empty-filter`

When you don't pass an `emptyIcon`, the track is the _same_ glyph as the fill, dimmed by a CSS
`filter` so it reads as “empty”. A filter — unlike `color` — works on emoji and SVG alike, which is
why the default is `grayscale(1) opacity(0.35)` rather than a grey colour.

```tsx live
<div style={{ display: 'grid', gap: '0.75rem', fontSize: '2rem' }}>
  <Rating value={2.5} icon="⭐" />
  <Rating value={2.5} icon="⭐" style={{ '--rfs-empty-filter': 'grayscale(1) opacity(0.2)' }} />
  <Rating value={2.5} icon="⭐" style={{ '--rfs-empty-filter': 'sepia(1) opacity(0.5)' }} />
  <Rating value={2.5} icon="⭐" style={{ '--rfs-empty-filter': 'none' }} />
</div>
```

If you pass an explicit `emptyIcon`, **no filter is applied** — that artwork is your own empty look,
so the component leaves it alone.

```tsx live
<Rating
  value={2.5}
  style={{ '--rfs-size': '2rem' }}
  icon={<span>●</span>}
  emptyIcon={<span style={{ color: '#cbd5e1' }}>○</span>}
/>
```

### Motion — `--rfs-transition`

The fill width animates when the value or hover preview changes; `--rfs-transition` is its duration.
Crank it up here and hover slowly to watch the fill glide.

```tsx live
function Motion() {
  const [score, setScore] = useState(2)
  return (
    <Rating
      value={score}
      onChange={setScore}
      precision={0.5}
      label="Slow fill"
      style={{
        '--rfs-size': '2.5rem',
        '--rfs-transition': '450ms',
        '--rfs-color-hover': '#22c55e',
      }}
    />
  )
}
```

<img src={useBaseUrl('/img/examples/styling-hover.gif')} alt="Hovering a rating with a slow transition and a distinct green hover colour" width="260" />

:::note Respects `prefers-reduced-motion`
The transition is dropped automatically when the user has **Reduce motion** turned on — no
configuration needed. Set `--rfs-transition: 0ms` to disable it for everyone.
:::

### Focus ring — `--rfs-focus-ring`

When a rating is operated by keyboard, a focus ring is drawn on the focused icon. It's an `outline`
(so the fill layer's `overflow: hidden` can't clip it), with a matching offset and corner radius. Tab
into the rating below and use the arrow keys.

```tsx live
function Focus() {
  const [score, setScore] = useState(0)
  return (
    <Rating
      value={score}
      onChange={setScore}
      precision={1}
      label="Focus me with Tab, then arrow keys"
      style={{
        '--rfs-size': '2.5rem',
        '--rfs-focus-ring': '3px solid #2563eb',
        '--rfs-focus-ring-offset': '4px',
        '--rfs-focus-ring-radius': '6px',
      }}
    />
  )
}
```

| Property                  | Maps to          | Default               |
| ------------------------- | ---------------- | --------------------- |
| `--rfs-focus-ring`        | `outline`        | `2px solid Highlight` |
| `--rfs-focus-ring-offset` | `outline-offset` | `2px`                 |
| `--rfs-focus-ring-radius` | `border-radius`  | `2px`                 |

`Highlight` is the system focus colour, so the default ring matches the user's OS accent out of the
box. Override the shorthand for a branded ring.

## Data-attribute hooks

For anything a custom property doesn't cover, target these attributes from your own CSS. They are
**stable and covered by semver** — safe to build a design system on.

| Selector                                  | Marks                                           |
| ----------------------------------------- | ----------------------------------------------- |
| `[data-rfs-root]`                         | The root element.                               |
| `[data-rfs-item]`                         | One icon slot (its value is the 0-based index). |
| `[data-rfs-layer="fill"\|"empty"]`        | The fill layer vs. the empty/track layer.       |
| `[data-state="full"\|"partial"\|"empty"]` | Per-icon fill state.                            |
| `[data-active]`                           | Icons under the current hover/keyboard preview. |
| `[data-readonly]`                         | Present in read-only (display) mode.            |
| `[data-disabled]`                         | Present when `disabled`.                        |
| `[data-invalid]`                          | Present when `invalid`.                         |

### Per-state theming

Because the state lives in the DOM, you can restyle a whole state by _setting a variable_ from a
selector — no per-instance props. A red error look driven only by the `invalid` prop:

```css
[data-rfs-root][data-invalid] {
  --rfs-color-filled: #dc2626;
  --rfs-color-empty: #fecaca;
}

/* Fade the control while it's unavailable. */
[data-rfs-root][data-disabled] {
  opacity: 0.5;
}
```

The same states, side by side:

```tsx live
<div style={{ display: 'grid', gap: '0.75rem', fontSize: '1.75rem' }}>
  <Rating
    value={3}
    invalid
    style={{ '--rfs-color-filled': '#dc2626', '--rfs-color-empty': '#fecaca' }}
  />
  <Rating value={3} onChange={() => {}} disabled style={{ opacity: 0.5 }} />
  <Rating value={3.5} />
</div>
```

You can also reach past variables into structure — e.g. a rule that targets only partially-filled
icons, or only the icons under the pointer:

```css
/* Nudge the icon currently being previewed. */
[data-rfs-item][data-active] {
  transform: scale(1.15);
}

/* Give the fill layer a subtle glow. */
[data-rfs-layer='fill'] {
  filter: drop-shadow(0 0 2px currentColor);
}
```

## Where to set the variables

The same three scopes as any custom property — pick per use:

```tsx
// Per instance — inline style:
<Rating value={4.3} style={{ '--rfs-size': '2rem', '--rfs-color-filled': '#6d28d9' }} />

// Per theme — a class you control:
<Rating value={4.3} className="brand-rating" />

// App-wide — on :root, so every rating inherits it:
```

```css
:root {
  --rfs-color-filled: #6d28d9;
  --rfs-color-empty: #e5e7eb;
}
.brand-rating {
  --rfs-size: 2rem;
}
```

Tailwind, CSS Modules, and styled-components all work the same way — they only ever _set variables_.
Those patterns are in [Theming recipes](../recipes/theming.md).

## Gallery

Every image below is captured from the real component, never hand-drawn:

<img src={useBaseUrl('/img/examples/styling-gallery.png')} alt="A gallery of ratings styled with different sizes, gaps, colours, and empty-layer filters" width="520" />

## See also

- [Theming recipes](../recipes/theming.md) — Tailwind, CSS Modules, styled-components, per-state.
- [Custom icons](../recipes/custom-icons.md) — swapping the glyph and the render-function API.
- [Displaying a score](./display.md) — sizing in context, precision and rounding.

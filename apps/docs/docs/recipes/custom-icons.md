---
sidebar_position: 6
---

# Custom icons

The library owns geometry; you own appearance. An `icon` (and optional `emptyIcon`) can be any
`ReactNode`, or a **function** of per-icon state.

## An SVG

Any SVG works. Size it in `em` so it scales with `--rfs-size`, and give it `fill="currentColor"` so
it picks up the fill color the component sets from `--rfs-color-filled`:

```tsx
function Heart() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M12 21s-8-4.9-8-10.4A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 3.6C20 16.1 12 21 12 21z" />
    </svg>
  )
}

;<Rating value={3.5} max={5} icon={<Heart />} style={{ '--rfs-color-filled': 'crimson' }} />
```

Provide a distinct outline for the empty state, or omit `emptyIcon` to reuse the same icon dimmed:

```tsx
<Rating value={3.5} icon={<HeartFilled />} emptyIcon={<HeartOutline />} />
```

## An emoji

An emoji string is a valid icon, including ZWJ sequences (the component never clips mid-sequence):

```tsx
<Rating value={3.5} icon="⭐" />
<Rating value={2.5} icon="👩‍🍳" />
```

:::caution Emoji ignore `--rfs-color-filled`
Emoji render from a **color font**, so CSS `color` cannot recolor them. The implicit empty layer is
therefore dimmed with `--rfs-empty-filter` (a `grayscale`/`opacity` filter), which works on emoji and
SVG alike. Pass an explicit `emptyIcon` to control the empty look yourself.
:::

## An image

```tsx
<Rating value={4} icon={<img src="/badge.svg" alt="" width="24" height="24" />} />
```

## A render function

For conditional icons, pass a function. It receives per-icon state and returns a node:

```tsx
<Rating value={2.5} icon={(s) => <span>{s.partial ? '◐' : s.filled ? '●' : '○'}</span>} />
```

The state object:

| Field     | Meaning                                   |
| --------- | ----------------------------------------- |
| `index`   | 0-based position in the row               |
| `fill`    | Fill ratio for this icon, `0..1`          |
| `filled`  | `fill >= 1`                               |
| `empty`   | `fill <= 0`                               |
| `partial` | `0 < fill < 1`                            |
| `active`  | A hover/keyboard preview covers this icon |

Because the fill layer clips whatever you return by width, a render function still gets exact
partial fills — you are choosing the _glyph_, not reimplementing the geometry.

---
sidebar_position: 2
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Taking a rating

Providing `onChange` makes the component interactive. Nothing else changes about how you use it.
**Try it — click, or focus it and use the arrow keys:**

```tsx live
function Feedback() {
  const [score, setScore] = useState(0)
  return (
    <div style={{ fontSize: '2rem' }}>
      <Rating value={score} onChange={setScore} precision={0.5} label="Rate your meal" />
      <p style={{ fontSize: '1rem' }}>Selected: {score}</p>
    </div>
  )
}
```

Hovering previews the value; clicking commits it:

<img src={useBaseUrl('/img/examples/interactive-half.gif')} alt="Hovering and clicking a half-star rating" width="240" />

Internally this renders a `radiogroup` of visually-hidden **native radio inputs**, so arrow-key
navigation, form participation, focus-visible, and screen-reader announcements all come from the
platform rather than from hand-rolled JavaScript.

`onChange` receives a **`number`** — the newly selected value — not a DOM event. (That is what makes
it pair cleanly with form libraries; see [Forms](./forms.md).)

## Precision in interactive mode

Interactive mode requires **`precision >= 0.5`**. Half and whole steps are selectable; continuous
input is not — a radiogroup has discrete options, so a continuous _input_ has no discrete steps to
offer. Continuous _display_ is fully supported at any precision.

```tsx
<Rating value={score} onChange={setScore} precision={1} />    // whole-star input
<Rating value={score} onChange={setScore} precision={0.5} />  // half-star input
```

## Keyboard

| Key                    | Action                                   |
| ---------------------- | ---------------------------------------- |
| `←` / `→` (`↑` / `↓`)  | Move the selection by one step           |
| Digit keys             | Jump directly to that value              |
| `Backspace` / `Delete` | Clear the selection                      |
| `Tab`                  | Moves to the next control (one tab stop) |

Each rating is a **single tab stop**, including before anything is selected. Arrow direction follows
text direction, so it stays intuitive in RTL.

Arrow keys walking up the scale, then `Backspace` to clear:

<img src={useBaseUrl('/img/examples/interactive-keyboard.gif')} alt="Selecting a rating with the arrow keys, then clearing with Backspace" width="240" />

## Hover preview

`onHoverChange` reports the value currently previewed by pointer or keyboard, and `null` when the
preview ends. Use it to mirror the score in nearby UI:

```tsx
const [hover, setHover] = useState<number | null>(null)

<Rating value={score} onChange={setScore} onHoverChange={setHover} precision={0.5} />
<p>{hover ?? score} / 5</p>
```

Touch pointers are ignored for hover preview — on touch there is no hover, and a fake one would fight
the tap.

## Clearing

When interactive, re-selecting the current value clears it back to `0` (`allowClear`, on by default).
Set `allowClear={false}` to make a rating mandatory once set.

## Disabled vs. read-only

- **`disabled`** keeps the element a _disabled radiogroup_ — still announced, still discoverable,
  just not operable. Use it for a control that is temporarily unavailable.
- **`readOnly`** (or simply omitting `onChange`) renders the `role="img"` display. Use it to show a
  score that was never meant to be edited.

```tsx
<Rating value={3} onChange={setScore} disabled />   // disabled input
<Rating value={3} readOnly />                        // display
```

## Fully custom rendering

If you want to render the whole thing yourself, `useRating` exposes the state machine — value, hover
preview, focus, group blur, fills, and steps — in ~900 B. See the [API reference](/api).

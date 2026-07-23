---
sidebar_position: 5
---

# Native forms

No library needed. Pass `name` and the selected value posts natively, exactly like a group of radio
inputs — because that is what it renders.

## Uncontrolled

Give it a `name` and a `defaultValue`. The chosen value is submitted under that name:

```tsx
import { Rating } from 'react-feedback-stars'

function Feedback() {
  return (
    <form method="post" action="/feedback">
      <Rating name="score" defaultValue={0} onChange={() => {}} precision={1} label="Score" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

On submit, the form body includes `score=<value>`. Reading it back:

```tsx
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()
  const data = new FormData(event.currentTarget)
  const score = Number(data.get('score')) // the selected rating
}
```

:::note Why `onChange={() => {}}`
Providing `onChange` is what makes the component an interactive input (native radios that can be
submitted). If you truly need it uncontrolled, a no-op handler keeps it interactive while you let the
DOM hold the value via `defaultValue`. Prefer a controlled `value`/`onChange` pair whenever you have
state to hold it.
:::

## Controlled

Hold the value in React state and still submit natively — `name` works in both modes:

```tsx
function Feedback() {
  const [score, setScore] = useState(0)
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        console.log(new FormData(e.currentTarget).get('score'))
      }}
    >
      <Rating name="score" value={score} onChange={setScore} precision={1} label="Score" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Required

`required` marks the underlying radio group required, so the browser blocks submission of an unrated
field with its native validation message.

```tsx
<Rating name="score" required onChange={() => {}} label="Score" />
```

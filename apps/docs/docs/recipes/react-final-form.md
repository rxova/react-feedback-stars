---
sidebar_position: 3
---

# React Final Form

Use a `Field` render prop. The one thing to know: React Final Form represents an **empty field as
`''`** (an empty string), so guard the value into a number before handing it to `Rating`.

```tsx
import { Form, Field } from 'react-final-form'
import { Rating } from 'react-feedback-stars'

function ReviewForm() {
  return (
    <Form
      onSubmit={(values) => console.log(values)}
      validate={(v) => (Number(v.rating) >= 1 ? {} : { rating: 'Please rate before submitting' })}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Field name="rating">
            {({ input, meta }) => (
              <>
                <Rating
                  // RFF uses '' for an empty field, which is not a number.
                  value={typeof input.value === 'number' ? input.value : 0}
                  onChange={input.onChange}
                  onBlur={input.onBlur}
                  precision={1}
                  label="Overall"
                  invalid={meta.touched && !!meta.error}
                  aria-describedby={meta.touched && meta.error ? 'rating-error' : undefined}
                />
                {meta.touched && meta.error && (
                  <p id="rating-error" role="alert">
                    {meta.error}
                  </p>
                )}
              </>
            )}
          </Field>
          <button type="submit">Send review</button>
        </form>
      )}
    />
  )
}
```

## Notes

- **The `''` guard is the whole trick.** `typeof input.value === 'number' ? input.value : 0` keeps
  `Rating` on a numeric value even before the field has been touched.
- `input.onChange` accepts the emitted `number` directly.
- `input.onBlur` marks the field touched when focus leaves the whole group, so `meta.touched`-based
  errors appear only after the user finishes.

---
sidebar_position: 4
---

# TanStack Form

Bridge a [TanStack Form](https://tanstack.com/form) field to `Rating`'s controlled props.
`field.handleChange` takes the `number` that `onChange` emits directly, and `field.handleBlur` marks
the field touched when focus leaves the whole group.

```tsx
import { useForm } from '@tanstack/react-form'
import { Rating } from 'react-feedback-stars'

function ReviewForm() {
  const form = useForm({
    defaultValues: { rating: 0 },
    onSubmit: ({ value }) => console.log(value),
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.Field
        name="rating"
        validators={{
          onChange: ({ value }) => (value < 1 ? 'Please rate before submitting' : undefined),
        }}
      >
        {(field) => (
          <>
            <Rating
              name="rating"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              precision={0.5}
              label="Overall"
              invalid={!field.state.meta.isValid}
              aria-describedby={field.state.meta.isValid ? undefined : 'rating-error'}
            />
            {!field.state.meta.isValid && (
              <p id="rating-error" role="alert">
                {field.state.meta.errors.join(', ')}
              </p>
            )}
          </>
        )}
      </form.Field>
      <button type="submit">Send review</button>
    </form>
  )
}
```

## Notes

- **`field.handleChange` matches `onChange` exactly** — both speak `number`, so you can pass it
  straight through with no adapter.
- **`field.handleBlur` marks the field touched** when focus leaves the whole group, not while
  arrowing between icons — so blur-based validation does not fire mid-choice.
- **The `onChange` validator runs on change and again on submit**, so an unrated field (`0`) blocks
  submission and surfaces the message.
- **`field.state.meta.errors` is an array** and `!field.state.meta.isValid` is true whenever it is
  non-empty — drive both the message and the `invalid` prop from it.

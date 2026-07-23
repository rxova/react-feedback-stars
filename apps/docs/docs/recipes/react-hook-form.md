---
sidebar_position: 1
---

# React Hook Form

`onChange` emits a `number`, not an event, so use a `Controller`. Its `field` object already carries
`value`, `onChange`, `onBlur`, `name`, and `ref`, which line up one-to-one with `Rating`'s props.

```tsx
import { useForm, Controller } from 'react-hook-form'
import { Rating } from 'react-feedback-stars'

type Values = { rating: number }

function ReviewForm() {
  const { control, handleSubmit } = useForm<Values>({ defaultValues: { rating: 0 } })

  return (
    <form onSubmit={handleSubmit((values) => console.log(values))}>
      <Controller
        name="rating"
        control={control}
        rules={{ min: { value: 1, message: 'Please rate before submitting' } }}
        render={({ field, fieldState }) => (
          <>
            <Rating
              {...field} // value, onChange, onBlur, name, ref all line up
              precision={0.5}
              label="Overall"
              invalid={fieldState.invalid}
              aria-describedby={fieldState.error ? 'rating-error' : undefined}
            />
            {fieldState.error && (
              <p id="rating-error" role="alert">
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
      <button type="submit">Send review</button>
    </form>
  )
}
```

## Notes

- **`{...field}` is the whole adapter.** Because the prop names match, spreading `field` wires value,
  change, blur, name, and ref at once. Add `precision`, `label`, and error props alongside it.
- **Validation timing is correct for free.** `field.onBlur` fires when focus leaves the whole group,
  not while arrowing between icons, so an `onTouched`/`onBlur` validation mode does not fire
  mid-choice.
- **`min` is the “required” rule.** An unrated field is `0`; a `min: 1` rule rejects it with your
  message. For a stricter “must be set”, keep `allowClear={false}` so a chosen value cannot be
  cleared back to `0`.

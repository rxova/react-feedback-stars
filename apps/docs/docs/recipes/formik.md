---
sidebar_position: 2
---

# Formik

Bridge Formik's `useField` helpers to `Rating`'s controlled props. `helpers.setValue` takes the
`number` that `onChange` emits directly.

```tsx
import { Formik, Form, useField } from 'formik'
import { Rating } from 'react-feedback-stars'

function RatingField({ name, label }: { name: string; label: string }) {
  const [field, meta, helpers] = useField<number>(name)

  return (
    <>
      <Rating
        name={name}
        value={field.value}
        onChange={helpers.setValue}
        onBlur={field.onBlur}
        precision={0.5}
        label={label}
        invalid={meta.touched && !!meta.error}
        aria-describedby={meta.touched && meta.error ? `${name}-error` : undefined}
      />
      {meta.touched && meta.error && (
        <p id={`${name}-error`} role="alert">
          {meta.error}
        </p>
      )}
    </>
  )
}

function ReviewForm() {
  return (
    <Formik
      initialValues={{ rating: 0 }}
      validate={(v) => (v.rating < 1 ? { rating: 'Please rate before submitting' } : {})}
      onSubmit={(values) => console.log(values)}
    >
      <Form>
        <RatingField name="rating" label="Overall" />
        <button type="submit">Send review</button>
      </Form>
    </Formik>
  )
}
```

## Notes

- **`helpers.setValue` matches `onChange` exactly** — both speak `number`, so no adapter function is
  needed.
- **`field.onBlur` marks the field touched** at the right moment: when focus leaves the whole group.
  Combined with `meta.touched`, error text does not appear until the user has finished choosing.
- Pass `name` so the value also participates if the form is ever submitted natively.

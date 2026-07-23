---
sidebar_position: 3
---

# Forms

`onChange` emits a **`number`, not an event**, so `{...register('rating')}` will not work directly.
Every major form library has a controlled adapter — that is the supported path, and it is one line
longer than a plain input.

The props that make a rating a well-behaved form field:

| Prop                 | Purpose                                                        |
| -------------------- | -------------------------------------------------------------- |
| `name`               | Radio group name; also posts a value to a native `<form>`      |
| `value` / `onChange` | Controlled value in, `number` out                              |
| `onBlur`             | Fires when focus leaves the **whole group**, not between icons |
| `invalid`            | Sets `aria-invalid` and `data-invalid` for error styling       |
| `aria-describedby`   | Points the group at your external error / help text            |
| `required`           | Marks the field required                                       |

:::tip Validation fires at the right time
`onBlur` fires only when focus leaves the entire group — never while arrowing between icons — so
touched-based validation does not fire while the user is still choosing.
:::

## Copy-paste recipes

Each library has a dedicated, complete recipe:

- **[React Hook Form](../recipes/react-hook-form.md)** — `Controller` + `rules`
- **[Formik](../recipes/formik.md)** — `useField` + helpers
- **[React Final Form](../recipes/react-final-form.md)** — `Field` render prop
- **[Native `<form>`](../recipes/native-forms.md)** — no library, posts via `name`

## The shape they share

All three controlled adapters line up the same handful of props. React Hook Form is the shortest
because `field` already carries `value`, `onChange`, `onBlur`, `name`, and `ref`:

```tsx
<Controller
  name="rating"
  control={control}
  rules={{ min: { value: 1, message: 'Please rate' } }}
  render={({ field, fieldState }) => (
    <>
      <Rating
        {...field} // value, onChange, onBlur, name, ref all line up
        precision={0.5}
        invalid={fieldState.invalid}
        aria-describedby={fieldState.error ? 'rating-err' : undefined}
      />
      {fieldState.error && <p id="rating-err">{fieldState.error.message}</p>}
    </>
  )}
/>
```

## Native forms

With a plain `<form>`, no adapter is needed — pass `name` and the selected value posts natively under
that name:

```tsx
<form method="post">
  <Rating name="score" defaultValue={0} onChange={() => {}} precision={1} label="Score" />
  <button type="submit">Submit</button>
</form>
```

See [Native forms](../recipes/native-forms.md) for the uncontrolled and controlled variants.

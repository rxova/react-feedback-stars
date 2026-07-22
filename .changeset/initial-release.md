---
'react-feedback-stars': minor
---

Initial release. Headless, zero-dependency React rating component.

- Any `ReactNode` as an icon — SVG, emoji, or arbitrary JSX
- Orthogonal `precision` (grid) and `rounding` (direction) props covering continuous, tenths,
  half and whole stars
- Read-only renders `role="img"`; adding `onChange` upgrades it to a `radiogroup` of native radios
- Form-ready: group-level `onBlur`, `invalid`, `aria-describedby`, and native `<form>` submission
- RTL, `prefers-reduced-motion`, and a focus ring the fill layer cannot clip

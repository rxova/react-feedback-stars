---
'react-feedback-stars': patch
---

Keep disabled ratings exposed as a disabled radiogroup instead of collapsing to
`role="img"`, so screen-reader users filling a form still find the field. Also
strip float dust from the rendered fill width — `4.3` used to emit
`width:29.999999999999982%` into the markup.

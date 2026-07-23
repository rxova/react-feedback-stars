---
'react-feedback-stars': minor
---

Add development-only input diagnostics via a new `onWarn` prop.

Out-of-range props were already coerced to keep the component functional — a `value` above `max`
paints `max`, a negative or non-finite `value` becomes `0`, and an invalid `max` falls back to a
positive integer — but that coercion was silent, so mistakes like `value={7}` on a 5-star widget
went unnoticed. The component now surfaces each coercion in development with a structured
`RatingWarning` (`{ code, prop, received, used, message }`). Pass `onWarn` to route these into your
own logging, or leave it off for a deduped `console.warn`. The entire path is stripped from
production builds, and the value is clamped either way, so behavior is unchanged there.

Exports the `RatingWarning` and `RatingWarningCode` types.

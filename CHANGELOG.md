# react-feedback-stars

## 0.1.0

### Minor Changes

- [`919abfa`](https://github.com/rxova/react-feedback-stars/commit/919abfa8ff2ad1fb8694c9ae7c48bf22f3114e1d) Thanks [@jonatankruszewski](https://github.com/jonatankruszewski)! - Initial release. Headless, zero-dependency React rating component.

  - Any `ReactNode` as an icon — SVG, emoji, or arbitrary JSX
  - Orthogonal `precision` (grid) and `rounding` (direction) props covering continuous, tenths,
    half and whole stars
  - Read-only renders `role="img"`; adding `onChange` upgrades it to a `radiogroup` of native radios
  - Form-ready: group-level `onBlur`, `invalid`, `aria-describedby`, and native `<form>` submission
  - RTL, `prefers-reduced-motion`, and a focus ring the fill layer cannot clip

### Patch Changes

- [`ddb4740`](https://github.com/rxova/react-feedback-stars/commit/ddb4740b77d9e272eb3629e74960a95c90da55ba) Thanks [@jonatankruszewski](https://github.com/jonatankruszewski)! - Keep disabled ratings exposed as a disabled radiogroup instead of collapsing to
  `role="img"`, so screen-reader users filling a form still find the field. Also
  strip float dust from the rendered fill width — `4.3` used to emit
  `width:29.999999999999982%` into the markup.

- [`5046adc`](https://github.com/rxova/react-feedback-stars/commit/5046adc4bb6806ec95138345c9679e80fe92c17b) Thanks [@jonatankruszewski](https://github.com/jonatankruszewski)! - Add a roving tabindex so an unrated group is a single tab stop. Browsers only
  collapse a radio group once a radio is checked, so a `precision={0.5}` rating
  with no value previously cost keyboard users ten tab stops.

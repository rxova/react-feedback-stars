# Security Policy

Please report security issues privately.

## Supported Versions

Security fixes land on the latest minor of the current major line.

| Version | Supported                         |
| ------- | --------------------------------- |
| `0.x`   | Yes — latest minor receives fixes |
| `< 0.1` | No                                |

Once `1.0.0` ships, this table is updated and pre-1.0 versions stop receiving fixes.

## Response Targets

This is a volunteer-maintained project, so these are goals rather than contractual guarantees:

- Acknowledgement within 5 business days.
- An initial assessment, including whether the report is accepted, within 10 business days.
- Fixes for accepted high-severity reports released as soon as practical, coordinated with the
  reporter before public disclosure.

## How To Report

Use one of the following:

- [GitHub Security Advisory form](https://github.com/rxova/react-feedback-stars/security/advisories/new)
- Email the maintainer if the advisory form is unavailable.

Include:

- affected version
- minimal reproduction
- impact assessment

Public disclosure should happen after a fix is available.

## Threat Model

`react-feedback-stars` is a rendering component with **no runtime dependencies**, no network
access, no storage access, and no `eval`/`Function` construction. Its realistic exposure is
narrow, and it is worth being explicit about where it does and does not exist.

**Consumer-controlled input that reaches the DOM:**

- `icon` / `emptyIcon` accept a `ReactNode`. React escapes strings, so passing untrusted text is
  safe; passing untrusted **markup** is not, and that is true of any React prop. Do not build an
  icon with `dangerouslySetInnerHTML` from user input.
- `label`, `formatLabel`, and `formatOptionLabel` produce accessible names. They are set through
  React props and are escaped.
- `value`, `max`, and `precision` are numbers. Non-finite and out-of-range values are clamped
  rather than thrown, so hostile numeric input degrades to `0` or `max` instead of crashing the
  page or producing an unbounded loop. `max` is floored to a positive integer, so a huge `max`
  is a rendering-cost concern for the consumer, not a memory-safety one.

**Not applicable:** this package does not read or write cookies, `localStorage`, or the network;
it does not register global listeners outside its own subtree; and it registers exactly one
`matchMedia` listener, which is removed on unmount.

**Content Security Policy:** the component sets inline `style` attributes on the elements it
renders. Under a strict CSP this requires `style-src` to permit inline styles (via a nonce, hash,
or `'unsafe-inline'`). It does **not** require `script-src 'unsafe-inline'` or
`'unsafe-eval'`. If your policy forbids inline styles entirely, this component is not currently
compatible — please open an issue, as a class-based rendering mode is a plausible future option.

## Supply Chain

- Zero runtime dependencies; `react` is the only peer dependency.
- Releases publish from CI with [npm provenance](https://docs.npmjs.com/generating-provenance-statements)
  via OIDC trusted publishing, so there is no long-lived npm token to leak.
- `pnpm audit --audit-level=high` runs inside `pnpm run verify`, which gates both pull requests
  and the release path.
- CodeQL analysis runs via GitHub's default code-scanning setup, which keeps its own queries
  and CodeQL version current. There is deliberately no advanced workflow in this repository:
  GitHub rejects SARIF uploads when both are enabled.
- Dependency updates arrive through Dependabot and go through the same CI gate.

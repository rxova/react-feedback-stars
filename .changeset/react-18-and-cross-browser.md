---
'react-feedback-stars': patch
---

Fix `ref` on React 18. The component read `ref` from props, which only works on
React 19 — on React 18 the ref silently never populated, despite `react >=18.0.0`
being a declared peer. Now uses `forwardRef`, which works on both.

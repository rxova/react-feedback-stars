# react-feedback-stars — monorepo

> **Any icon, any precision, accessible.** A headless, zero-dependency React rating component.

This repository is a pnpm workspace. The published package lives in
[`packages/react-feedback-stars`](./packages/react-feedback-stars); everything else supports it.

| Path                            | Name                               | Published? | What it is                                                                         |
| ------------------------------- | ---------------------------------- | ---------- | ---------------------------------------------------------------------------------- |
| `packages/react-feedback-stars` | `react-feedback-stars`             | ✅ npm     | The component. Start with its [README](./packages/react-feedback-stars/README.md). |
| `apps/playground`               | `@react-feedback-stars/playground` | private    | Vite app the E2E suite drives; the manual QA surface.                              |
| `apps/docs`                     | `@react-feedback-stars/docs`       | private    | Docusaurus site published to GitHub Pages.                                         |

- **Package README:** [`packages/react-feedback-stars/README.md`](./packages/react-feedback-stars/README.md)
- **Documentation site:** https://rxova.github.io/react-feedback-stars/
- **npm:** https://www.npmjs.com/package/react-feedback-stars

## Working in the repo

```bash
pnpm install          # install every workspace project
pnpm dev              # run the playground (apps/playground)
pnpm docs             # run the docs site locally (apps/docs)
pnpm build            # build every package
pnpm test             # unit + browser tests with coverage
pnpm e2e              # Playwright against the built playground
pnpm verify           # the full release gate CI and the pre-push hook run
```

Scripts that target the library forward to it with `pnpm --filter react-feedback-stars <script>`.
See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full workflow.

## License

MIT

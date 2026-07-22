# Contributing

Thanks for taking the time to contribute.

## Architecture

A single published package. No monorepo, no build-time codegen.

| Path                             | What lives there                                                    |
| -------------------------------- | ------------------------------------------------------------------- |
| `src/math.ts`                    | Pure arithmetic: clamp, snap, fills, steps, percentage. No React.   |
| `src/useRating.ts`               | Headless state: value, hover, focus, group blur. Exported publicly. |
| `src/usePrefersReducedMotion.ts` | Media-query subscription, SSR-safe.                                 |
| `src/Rating.tsx`                 | Rendering: two-layer clip, radiogroup vs image semantics.           |
| `src/types.ts`                   | The public prop surface.                                            |
| `src/__tests__/`                 | `*.test.ts(x)` run in node, `*.browser.test.tsx` run in Chromium.   |
| `playground/`                    | Vite app used for manual QA and as the E2E target.                  |
| `e2e/`                           | Playwright specs against the built playground.                      |
| `scripts/`                       | `verify.mjs` (the release gate) and `pack-smoke.mjs`.               |

If you are unsure where a change belongs: arithmetic goes in `math.ts`, behaviour goes in
`useRating.ts`, and anything about how it looks goes in `Rating.tsx`.

`src/types.ts` is the public prop surface: every prop there is API, and so are the `data-*`
attributes listed in the README. Both are covered by semver.

## Setup

Requirements:

- **Developing this repo: Node `>= 22.13`** (see `.nvmrc`). This is a pnpm constraint, not ours —
  pnpm 11 imports `node:sqlite` and crashes on older Node.
- **Using the published package: Node `>= 20.19`** (`engines.node`). CI still runs the unit suite
  on Node 20 by installing under Node 22 and then invoking Vitest's binary directly, so the
  support claim stays tested rather than assumed.
- pnpm, pinned via `packageManager` in `package.json`.

```bash
pnpm install
pnpm exec playwright install chromium   # for the browser and E2E suites
pnpm dev                                # playground on :5173
```

## Commands

```bash
pnpm test              # both projects
pnpm test:unit         # node only — fast
pnpm test:browser      # Chromium via Vitest browser mode
pnpm test:coverage     # enforces 95% per file
pnpm e2e               # Playwright against the built playground
pnpm e2e:ui            # ...with the Playwright UI
pnpm lint / typecheck / format
pnpm verify            # everything CI runs, in order
```

### Which suite does a test belong in?

- **Pure arithmetic** → `src/__tests__/*.test.ts`, node project. Fast, no DOM.
- **Anything about geometry, clipping, hover, focus** → `*.browser.test.tsx`. jsdom has no
  layout engine, so a jsdom assertion about a partial fill is only re-reading the style string
  we just wrote. Never add jsdom here.
- **Server rendering** → `src/__tests__/ssr.test.tsx`, node project.
- **Anything that needs a whole page** — tab order across several components, a real form
  round-trip, page-level RTL, axe over the full document → `e2e/`. This layer exists because it
  catches things component tests structurally cannot: the roving-tabindex bug was invisible to
  the component suite and obvious in E2E.

## Pre-PR checklist

`pnpm verify` covers all of it, in the same order CI does:

1. `audit:check` · `dedupe:check`
2. `format:check` · `lint` · `typecheck`
3. `test:coverage` — **95% per file**, so a new file with thin tests fails even if the repo
   average is fine
4. `build` · `check:exports` (publint + attw) · `pack:smoke`
5. `size` · `e2e`

Also:

- **Add a changeset** for anything user-facing: `pnpm exec changeset`. Docs/CI-only PRs can carry
  the `skip-changeset` label instead.
- **If you changed behaviour, change the prose in the same PR.** Grep the README for the prop
  you touched. A fix that ships with docs still teaching the old behaviour ships invisible.

## Rules

- **Zero runtime dependencies.** `react` stays the only peer dependency. This is the constraint
  that makes the package easy to adopt; a PR adding a dependency needs a very good argument.
- **No stylesheet to import.** Only layout-critical CSS is inlined; everything visual is a CSS
  custom property or a `data-*` hook.
- **Accessibility is not optional.** Interactive mode is a `radiogroup` of real radios so the
  platform provides keyboard, focus and form semantics. If you find yourself reimplementing one
  of those in JavaScript, that is a signal the markup is wrong.
- The `data-*` attributes in the README are **public API** and covered by semver.
- Conventional Commits, enforced by `commitlint` locally and on PRs.

## Release

Automated with Changesets.

1. Merge to `main`.
2. The Release workflow opens or updates a version PR with the bump and changelog.
3. Merging that PR runs `pnpm verify`, then publishes to npm with provenance via OIDC trusted
   publishing — there is no npm token in the repo.

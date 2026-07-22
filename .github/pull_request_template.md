## Summary

<!-- What changes and why. Link the issue if there is one. -->

## Testing

- [ ] `pnpm verify` passes locally
- [ ] Added or updated tests in the layer that can actually catch this
      (node for arithmetic, browser for geometry/focus, e2e for whole-page behaviour)

## Docs

- [ ] Not needed
- [ ] Updated `README.md`
- [ ] Updated the TSDoc in `src/types.ts` for any prop change

## Checklist

- [ ] A changeset is included, or the PR carries `skip-changeset`
- [ ] No new runtime dependency
- [ ] No stylesheet added; new visual knobs are CSS custom properties
- [ ] Accessibility unaffected, or verified with the axe specs

## Breaking change

- [ ] None
- [ ] Yes — described above, with a migration note

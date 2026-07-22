import { spawnSync } from 'node:child_process'
import process from 'node:process'

/**
 * One ordered definition of "is this releasable", executed by CI, by the
 * pre-push hook, and by the release workflow.
 *
 * The point of a single list is that the publish path and the pull-request
 * path cannot drift: if the audit lived only in the CI workflow, a release
 * pushed to main could ship dependencies a PR would have been blocked on.
 *
 * Ordered cheapest-and-most-likely-to-fail first, so a broken build surfaces
 * in seconds rather than after the browser suite.
 */
export const steps = [
  { name: 'Audit dependencies', script: 'audit:check' },
  { name: 'Check dependency dedupe', script: 'dedupe:check' },
  { name: 'Check formatting', script: 'format:check' },
  { name: 'Check e2e browser list', script: 'check:browsers' },
  { name: 'Lint', script: 'lint' },
  { name: 'Typecheck', script: 'typecheck' },
  { name: 'Test with coverage', script: 'test:coverage' },
  { name: 'Build', script: 'build' },
  { name: 'Check package publishing metadata', script: 'check:exports' },
  { name: 'Smoke-test the package tarball', script: 'pack:smoke' },
  { name: 'Check bundle size budgets', script: 'size' },
  { name: 'End-to-end', script: 'e2e' },
]

const runPnpmScript = (script) => spawnSync('pnpm', ['run', script], { stdio: 'inherit' })

export function runVerify({
  log = console.log,
  error = console.error,
  runScript = runPnpmScript,
  only = null,
} = {}) {
  const selected = only ? steps.filter((s) => only.includes(s.script)) : steps

  for (const step of selected) {
    log(`\n==> ${step.name}`)
    const result = runScript(step.script)

    if (result.error) {
      error(result.error)
      return 1
    }
    if (result.status !== 0) {
      error(`\n✖ Failed: ${step.name} (pnpm run ${step.script})`)
      return result.status ?? 1
    }
  }

  log(`\n✔ ${String(selected.length)} checks passed`)
  return 0
}

const isEntrypoint = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())

if (isEntrypoint) {
  process.exit(runVerify())
}

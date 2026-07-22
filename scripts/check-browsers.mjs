import { readFileSync } from 'node:fs'
import process from 'node:process'

/**
 * Keeps the browser list in `e2e:install` in step with the projects Playwright
 * actually launches.
 *
 * These drifted once already: `playwright.config.ts` gained firefox and webkit
 * while the release workflow still installed only chromium, and the release job
 * died at launch with "Executable doesn't exist at .../webkit-2311/pw_run.sh".
 * That is a slow, expensive way to discover a one-word mismatch.
 */

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const install = pkg.scripts['e2e:install']
if (!install) {
  console.error('✖ package.json has no `e2e:install` script')
  process.exit(1)
}

const config = readFileSync('playwright.config.ts', 'utf8')
const projects = [...config.matchAll(/name:\s*'([a-z]+)'/g)].map((m) => m[1])

if (projects.length === 0) {
  console.error('✖ could not find any Playwright projects in playwright.config.ts')
  process.exit(1)
}

const missing = projects.filter((browser) => !install.includes(browser))

if (missing.length > 0) {
  console.error(
    `✖ playwright.config.ts launches [${projects.join(', ')}] but \`e2e:install\` only installs:\n` +
      `    ${install}\n` +
      `  Missing: ${missing.join(', ')}\n` +
      '  Add them to the `e2e:install` script; CI derives its browser set from it.',
  )
  process.exit(1)
}

console.log(`✔ e2e:install covers every Playwright project (${projects.join(', ')})`)

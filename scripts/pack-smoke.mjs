import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'

/**
 * Proves the published artifact, not the source tree.
 *
 * publint and attw read the manifest; this actually packs the tarball, installs
 * it into a scratch project, and imports it through both module systems. It is
 * the only check that would catch a `files` entry that silently dropped `dist`,
 * or an `exports` map that resolves for a bundler but not for plain Node.
 */

const REQUIRED = [
  'package/dist/index.mjs',
  'package/dist/index.cjs',
  'package/dist/index.d.mts',
  'package/dist/index.d.cts',
  'package/package.json',
  'package/README.md',
  'package/LICENSE',
]

// Shipping these would leak the whole source tree to every consumer.
const FORBIDDEN = [/^package\/src\//, /\.test\./, /^package\/e2e\//, /^package\/playground\//]

const workdir = mkdtempSync(join(tmpdir(), 'rfs-pack-'))
let failures = 0

const fail = (message) => {
  console.error(`  ✖ ${message}`)
  failures += 1
}

try {
  console.log('Packing…')
  const packOutput = execFileSync('pnpm', ['pack', '--pack-destination', workdir], {
    encoding: 'utf8',
  })
  const tarball = packOutput
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.endsWith('.tgz'))
    .pop()

  if (!tarball) {
    console.error(packOutput)
    throw new Error('could not determine the tarball path from `pnpm pack` output')
  }
  const tarballPath = tarball.startsWith('/') ? tarball : join(workdir, tarball)
  console.log(`  ${tarballPath}`)

  const entries = execFileSync('tar', ['-tf', tarballPath], { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean)
    .map((e) => e.replace(/\/$/, ''))

  console.log('\nChecking tarball contents…')
  for (const required of REQUIRED) {
    if (!entries.includes(required)) fail(`missing from tarball: ${required}`)
  }
  for (const entry of entries) {
    for (const pattern of FORBIDDEN) {
      if (pattern.test(entry)) fail(`should not be published: ${entry}`)
    }
  }
  console.log(`  ${String(entries.length)} entries`)

  console.log('\nInstalling into a scratch project…')
  const consumer = join(workdir, 'consumer')
  execFileSync('mkdir', ['-p', consumer])
  writeFileSync(
    join(consumer, 'package.json'),
    JSON.stringify(
      {
        name: 'rfs-pack-smoke',
        private: true,
        version: '1.0.0',
        type: 'module',
        dependencies: { 'react-feedback-stars': `file:${tarballPath}`, react: '^19.0.0' },
      },
      null,
      2,
    ),
  )
  execFileSync('npm', ['install', '--silent', '--no-audit', '--no-fund'], {
    cwd: consumer,
    stdio: 'inherit',
  })

  console.log('\nResolving through both module systems…')
  writeFileSync(
    join(consumer, 'esm.mjs'),
    `import { Rating, useRating } from 'react-feedback-stars'
if (typeof Rating !== 'function') throw new Error('ESM: Rating is not a function')
if (typeof useRating !== 'function') throw new Error('ESM: useRating is not a function')
console.log('  ✔ ESM import')
`,
  )
  writeFileSync(
    join(consumer, 'cjs.cjs'),
    `const { Rating, useRating } = require('react-feedback-stars')
if (typeof Rating !== 'function') throw new Error('CJS: Rating is not a function')
if (typeof useRating !== 'function') throw new Error('CJS: useRating is not a function')
console.log('  ✔ CJS require')
`,
  )
  execFileSync('node', ['esm.mjs'], { cwd: consumer, stdio: 'inherit' })
  execFileSync('node', ['cjs.cjs'], { cwd: consumer, stdio: 'inherit' })

  // The directive is what makes the package usable from a Next.js server
  // component tree; losing it in the build is silent until a consumer hits it.
  const built = readFileSync(
    join(consumer, 'node_modules/react-feedback-stars/dist/index.mjs'),
    'utf8',
  )
  if (!built.startsWith("'use client'") && !built.startsWith('"use client"')) {
    fail('dist/index.mjs does not begin with the "use client" directive')
  } else {
    console.log('  ✔ "use client" directive preserved')
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  failures += 1
} finally {
  rmSync(workdir, { recursive: true, force: true })
}

if (failures > 0) {
  console.error(`\n✖ pack smoke test failed with ${String(failures)} problem(s)`)
  process.exit(1)
}
console.log('\n✔ pack smoke test passed')

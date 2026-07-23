import { chromium } from 'playwright'
import { PNG } from 'pngjs'
import gifenc from 'gifenc'

const { GIFEncoder, quantize, applyPalette } = gifenc
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import process from 'node:process'

/**
 * Generates the images shown under the docs examples, straight from the real
 * component — never hand-drawn, so they cannot lie about what the component
 * renders. Static displays become PNGs; interactive states become GIFs of a
 * real pointer/keyboard interaction.
 *
 * Expects the playground dev server to be serving `/capture.html`:
 *   pnpm --filter @react-feedback-stars/playground dev   # http://localhost:5173
 *   node scripts/capture-examples.mjs
 */

const BASE = process.env.CAPTURE_URL ?? 'http://localhost:5173'

// Written to both: the docs serve from static/img; the package README ships with
// the package and references ./assets/examples relatively (npm rewrites those to
// the repo, so they resolve without being in the published `files`).
const OUT_DIRS = [
  fileURLToPath(new URL('../apps/docs/static/img/examples/', import.meta.url)),
  fileURLToPath(new URL('../packages/react-feedback-stars/assets/examples/', import.meta.url)),
]

const save = (name, buffer) => {
  for (const dir of OUT_DIRS) writeFileSync(`${dir}${name}`, buffer)
}

// Static displays → one PNG each.
const STILLS = [
  'continuous',
  'whole',
  'half',
  'emoji',
  'hearts',
  'max10',
  'render-fn',
  'styling-gallery',
]

const clipOf = (box) => ({
  x: Math.round(box.x),
  y: Math.round(box.y),
  width: Math.round(box.width),
  height: Math.round(box.height),
})

function encodeGif(frames) {
  const gif = GIFEncoder()
  for (const { buffer, delay } of frames) {
    const png = PNG.sync.read(buffer)
    const palette = quantize(png.data, 256)
    const index = applyPalette(png.data, palette)
    gif.writeFrame(index, png.width, png.height, { palette, delay })
  }
  gif.finish()
  return Buffer.from(gif.bytes())
}

async function shotBox(page, id) {
  const el = page.locator(`[data-shot="${id}"]`)
  await el.waitFor({ state: 'visible' })
  return clipOf(await el.boundingBox())
}

/** Pointer demo: hover left→right (fill preview grows), click to commit, settle. */
async function pointerGif(page, id) {
  await page.reload({ waitUntil: 'networkidle' })
  const clip = await shotBox(page, id)
  const root = page.locator(`[data-shot="${id}"] [data-rfs-root]`)
  const r = await root.boundingBox()
  const frames = []
  const grab = async (delay) => frames.push({ buffer: await page.screenshot({ clip }), delay })

  await grab(400) // empty, held
  const steps = 9
  for (let i = 1; i <= steps; i++) {
    const x = r.x + (r.width * i) / (steps + 1)
    await page.mouse.move(x, r.y + r.height / 2)
    await page.waitForTimeout(55)
    await grab(110)
  }
  // Commit near 70% of the row.
  await page.mouse.move(r.x + r.width * 0.7, r.y + r.height / 2)
  await page.mouse.down()
  await page.mouse.up()
  await page.waitForTimeout(80)
  await grab(120)
  // Move the pointer away so the committed value (not a hover preview) shows.
  await page.mouse.move(clip.x + clip.width + 40, clip.y)
  await page.waitForTimeout(120)
  await grab(1400) // final, held
  return encodeGif(frames)
}

/** Keyboard demo: focus, ArrowRight up the scale, then Backspace to clear. */
async function keyboardGif(page, id) {
  await page.reload({ waitUntil: 'networkidle' })
  const clip = await shotBox(page, id)
  await page.locator(`[data-shot="${id}"] input`).first().focus()
  const frames = []
  const grab = async (delay) => frames.push({ buffer: await page.screenshot({ clip }), delay })

  await grab(500)
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(90)
    await grab(320)
  }
  await page.keyboard.press('Backspace')
  await page.waitForTimeout(90)
  await grab(1400)
  return encodeGif(frames)
}

async function main() {
  for (const dir of OUT_DIRS) mkdirSync(dir, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ deviceScaleFactor: 2 })
  await page.goto(`${BASE}/capture.html`, { waitUntil: 'networkidle' })
  await page.locator('[data-shot="continuous"] [data-rfs-root]').waitFor({ state: 'visible' })

  for (const id of STILLS) {
    const clip = await shotBox(page, id)
    save(`${id}.png`, await page.screenshot({ clip }))
    console.log(`  ✔ ${id}.png`)
  }

  save('interactive-half.gif', await pointerGif(page, 'int-half'))
  console.log('  ✔ interactive-half.gif')
  save('interactive-keyboard.gif', await keyboardGif(page, 'int-whole'))
  console.log('  ✔ interactive-keyboard.gif')
  save('styling-hover.gif', await pointerGif(page, 'style-hover'))
  console.log('  ✔ styling-hover.gif')

  await browser.close()
  console.log(`\n✔ captured to:\n  ${OUT_DIRS.join('\n  ')}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

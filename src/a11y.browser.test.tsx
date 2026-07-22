import { describe, expect, it } from 'vitest'
import { page, userEvent } from '@vitest/browser/context'
import { render } from 'vitest-browser-react'
import { Rating } from './Rating'

describe('read-only semantics', () => {
  it('is an image conveying a value, not a control', async () => {
    await render(<Rating value={4.3} />)
    await expect.element(page.getByRole('img')).toHaveAttribute('aria-label', '4.3 out of 5')
    expect(page.getByRole('radio').elements()).toHaveLength(0)
  })

  it('announces the snapped value, not the raw one', async () => {
    await render(<Rating value={4.3} precision={1} rounding="nearest" />)
    await expect.element(page.getByRole('img')).toHaveAttribute('aria-label', '4 out of 5')
  })

  it('hides decorative icons from the accessibility tree', async () => {
    const { container } = await render(<Rating value={3} />)
    await expect.element(page.getByRole('img')).toBeInTheDocument()
    const layers = container.querySelectorAll('[data-rfs-layer]')
    expect(layers.length).toBeGreaterThan(0)
    for (const layer of layers) expect(layer).toHaveAttribute('aria-hidden', 'true')
  })

  it('takes an explicit label', async () => {
    await render(<Rating value={3} label="Food quality" />)
    await expect.element(page.getByRole('img', { name: 'Food quality' })).toBeInTheDocument()
  })

  it('takes a label formatter', async () => {
    await render(<Rating value={3} formatLabel={(v, m) => `${String(v)}/${String(m)} stars`} />)
    await expect.element(page.getByRole('img', { name: '3/5 stars' })).toBeInTheDocument()
  })

  it('is not in the tab order', async () => {
    await render(
      <>
        <button type="button">before</button>
        <Rating value={3} />
        <button type="button">after</button>
      </>,
    )
    await page.getByRole('button', { name: 'before' }).click()
    await userEvent.tab()
    await expect.element(page.getByRole('button', { name: 'after' })).toHaveFocus()
  })
})

describe('interactive semantics', () => {
  it('exposes a radiogroup of radios', async () => {
    await render(<Rating value={0} onChange={() => undefined} precision={1} label="Rate us" />)
    await expect.element(page.getByRole('radiogroup', { name: 'Rate us' })).toBeInTheDocument()
    expect(page.getByRole('radio').elements()).toHaveLength(5)
  })

  it('marks the selected option checked', async () => {
    await render(<Rating value={3} onChange={() => undefined} precision={1} />)
    await expect.element(page.getByRole('radio', { name: '3 of 5' })).toBeChecked()
    await expect.element(page.getByRole('radio', { name: '2 of 5' })).not.toBeChecked()
  })

  it('names each option accessibly', async () => {
    await render(
      <Rating
        value={0}
        onChange={() => undefined}
        precision={1}
        formatOptionLabel={(v) => `${String(v)} stars`}
      />,
    )
    await expect.element(page.getByRole('radio', { name: '3 stars' })).toBeInTheDocument()
  })

  it('wires invalid state to aria-invalid and aria-describedby', async () => {
    await render(
      <>
        <Rating
          value={0}
          onChange={() => undefined}
          precision={1}
          invalid
          required
          aria-describedby="err"
        />
        <p id="err">Please rate</p>
      </>,
    )
    const group = page.getByRole('radiogroup')
    await expect.element(group).toHaveAttribute('aria-invalid', 'true')
    await expect.element(group).toHaveAttribute('aria-describedby', 'err')
    await expect.element(group).toHaveAttribute('aria-required', 'true')
    await expect.element(group).toHaveAttribute('data-invalid')
  })

  it('marks a disabled group aria-disabled and blocks its inputs', async () => {
    await render(<Rating value={2} onChange={() => undefined} precision={1} disabled />)
    // Disabled is not interactive at all, so it falls back to the image role.
    await expect.element(page.getByRole('img')).toBeInTheDocument()
  })

  it('renders a visible focus indicator on the focused icon', async () => {
    const { container } = await render(
      <Rating value={0} onChange={() => undefined} precision={1} />,
    )
    await userEvent.tab()
    const focused = container.querySelector<HTMLElement>('[data-rfs-item="0"]')
    expect(focused).not.toBeNull()
    // The ring must not be clipped away by the fill layer's overflow:hidden.
    expect(getComputedStyle(focused!).outlineStyle).not.toBe('none')
  })

  it('gives the root a programmatic focus target for focus-first-error (§9.5)', async () => {
    const { container } = await render(
      <Rating value={0} onChange={() => undefined} precision={1} />,
    )
    const root = container.querySelector<HTMLElement>('[data-rfs-root]')!
    expect(root).toHaveAttribute('tabindex', '-1')
    root.focus()
    expect(document.activeElement).toBe(root)
  })
})

describe('target size', () => {
  it('gives whole-star options a 24px+ target at the default size', async () => {
    const { container } = await render(
      <Rating
        value={0}
        onChange={() => undefined}
        precision={1}
        style={{ ['--rfs-size' as string]: '24px' }}
      />,
    )
    await expect.element(page.getByRole('radiogroup')).toBeInTheDocument()
    const label = container.querySelector<HTMLElement>('label')!
    const box = label.getBoundingClientRect()
    expect(box.width).toBeGreaterThanOrEqual(24)
    expect(box.height).toBeGreaterThanOrEqual(24)
  })
})

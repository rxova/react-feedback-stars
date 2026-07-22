import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { renderHook } from 'vitest-browser-react'
import { act } from 'react'
import { useRating } from '../useRating'

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined
}

// These call setState directly rather than through a user interaction, so React
// needs to be told it is in an act environment or every call logs a warning.
beforeAll(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
})
afterAll(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = undefined
})

/**
 * `useRating` is exported from the package entry, so it is public API and
 * deserves direct tests rather than only being exercised through <Rating>.
 * These cover the guards that the component never reaches.
 */
describe('useRating', () => {
  it('is not interactive without onChange', async () => {
    const { result } = await renderHook(() => useRating({ value: 3 }))
    expect(result.current.interactive).toBe(false)
    expect(result.current.canChange).toBe(false)
  })

  it('is interactive but not changeable when disabled', async () => {
    const { result } = await renderHook(() =>
      useRating({ value: 3, onChange: () => undefined, disabled: true }),
    )
    expect(result.current.interactive).toBe(true)
    expect(result.current.canChange).toBe(false)
    expect(result.current.disabled).toBe(true)
  })

  it('ignores commit and select when not interactive', async () => {
    const onChange = vi.fn()
    const { result } = await renderHook(() => useRating({ value: 2, readOnly: true, onChange }))
    act(() => {
      result.current.commit(4)
      result.current.select(4)
    })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('ignores commit and select when disabled', async () => {
    const onChange = vi.fn()
    const { result } = await renderHook(() => useRating({ value: 2, onChange, disabled: true }))
    act(() => {
      result.current.commit(4)
      result.current.select(4)
    })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('ignores hover when not interactive', async () => {
    const onHoverChange = vi.fn()
    const { result } = await renderHook(() => useRating({ value: 2, onHoverChange }))
    act(() => {
      result.current.setHover(4)
    })
    expect(onHoverChange).not.toHaveBeenCalled()
    expect(result.current.hoverValue).toBeNull()
  })

  it('does not re-emit hover for an unchanged value', async () => {
    const onHoverChange = vi.fn()
    const { result } = await renderHook(() =>
      useRating({ value: 2, onChange: () => undefined, onHoverChange }),
    )
    act(() => {
      result.current.setHover(4)
    })
    act(() => {
      result.current.setHover(4)
    })
    expect(onHoverChange).toHaveBeenCalledTimes(1)
  })

  it('clamps and snaps the incoming value', async () => {
    const { result } = await renderHook(() =>
      useRating({ value: 99, max: 5, precision: 1, rounding: 'nearest' }),
    )
    expect(result.current.value).toBe(5)
    expect(result.current.max).toBe(5)
  })

  it('commits verbatim while select toggles to zero', async () => {
    const onChange = vi.fn()
    const { result } = await renderHook(() => useRating({ value: 3, onChange, precision: 1 }))

    act(() => {
      result.current.commit(3)
    })
    expect(onChange).toHaveBeenLastCalledWith(3)

    act(() => {
      result.current.select(3)
    })
    expect(onChange).toHaveBeenLastCalledWith(0)
  })

  it('does not toggle to zero when allowClear is false', async () => {
    const onChange = vi.fn()
    const { result } = await renderHook(() =>
      useRating({ value: 3, onChange, precision: 1, allowClear: false }),
    )
    act(() => {
      result.current.select(3)
    })
    expect(onChange).toHaveBeenLastCalledWith(3)
  })

  it('tracks an uncontrolled value internally', async () => {
    const { result } = await renderHook(() =>
      useRating({ defaultValue: 1, onChange: () => undefined, precision: 1 }),
    )
    act(() => {
      result.current.commit(4)
    })
    expect(result.current.value).toBe(4)
  })

  it('generates a stable group name when none is given', async () => {
    const { result } = await renderHook(() => useRating({ value: 1, onChange: () => undefined }))
    expect(result.current.name).toMatch(/^rfs-name-/)
    expect(result.current.baseId).toMatch(/^rfs-/)
  })

  it('emits blur without a hover to clear', async () => {
    const onBlur = vi.fn()
    const onHoverChange = vi.fn()
    const { result } = await renderHook(() =>
      useRating({ value: 1, onChange: () => undefined, onBlur, onHoverChange }),
    )
    act(() => {
      result.current.handleBlur({
        relatedTarget: null,
      } as unknown as React.FocusEvent<HTMLElement>)
    })
    expect(onBlur).toHaveBeenCalledTimes(1)
    // Nothing was hovered, so no spurious null hover event.
    expect(onHoverChange).not.toHaveBeenCalled()
  })

  it('swallows blur when focus stays inside the group', async () => {
    const onBlur = vi.fn()
    const { result } = await renderHook(() =>
      useRating({ value: 1, onChange: () => undefined, onBlur }),
    )

    const root = document.createElement('span')
    const inner = document.createElement('input')
    root.appendChild(inner)
    document.body.appendChild(root)
    result.current.rootRef.current = root

    act(() => {
      result.current.handleBlur({
        relatedTarget: inner,
      } as unknown as React.FocusEvent<HTMLElement>)
    })
    expect(onBlur).not.toHaveBeenCalled()
    root.remove()
  })
})

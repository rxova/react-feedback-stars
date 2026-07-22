import { useCallback, useId, useMemo, useRef, useState } from 'react'
import type { FocusEvent } from 'react'
import { clampValue, getFills, getSteps, normalizeMax, snap } from './math'
import type { RatingRounding } from './types'

export interface UseRatingOptions {
  value?: number
  defaultValue?: number
  max?: number
  precision?: number
  rounding?: RatingRounding
  onChange?: (value: number) => void
  onHoverChange?: (value: number | null) => void
  onBlur?: (event: FocusEvent<HTMLElement>) => void
  readOnly?: boolean
  disabled?: boolean
  allowClear?: boolean
  name?: string
  id?: string
}

export interface UseRatingResult {
  /** Icon count after normalization. */
  max: number
  /** The committed score, clamped and snapped. */
  value: number
  /** What should be painted right now — the hover preview if any, else `value`. */
  displayValue: number
  /** Per-icon fill ratios for `displayValue`. */
  fills: number[]
  /** Selectable grid values. */
  steps: number[]
  /** True when the component accepts input. */
  interactive: boolean
  hoverValue: number | null
  focusedValue: number | null
  name: string
  baseId: string
  rootRef: React.RefObject<HTMLSpanElement | null>
  select: (next: number) => void
  setHover: (next: number | null) => void
  setFocused: (next: number | null) => void
  handleBlur: (event: FocusEvent<HTMLElement>) => void
}

/**
 * Headless state for a rating: controlled/uncontrolled value, hover preview,
 * focus tracking, and group-level blur. Exported so consumers can build a
 * completely custom renderer without reimplementing the fiddly parts.
 */
export function useRating(options: UseRatingOptions): UseRatingResult {
  const {
    value: valueProp,
    defaultValue = 0,
    max: maxProp = 5,
    precision = 0,
    rounding = 'nearest',
    onChange,
    onHoverChange,
    onBlur,
    readOnly,
    disabled = false,
    allowClear = true,
    name: nameProp,
    id: idProp,
  } = options

  const max = normalizeMax(maxProp)
  const reactId = useId()
  const baseId = idProp ?? `rfs-${reactId}`
  const name = nameProp ?? `rfs-name-${reactId}`

  const isControlled = valueProp !== undefined
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const rawValue = isControlled ? valueProp : uncontrolled

  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const [focusedValue, setFocusedValue] = useState<number | null>(null)
  const rootRef = useRef<HTMLSpanElement | null>(null)

  const interactive = (readOnly === undefined ? onChange !== undefined : !readOnly) && !disabled

  const value = useMemo(
    () => snap(clampValue(rawValue, max), precision, rounding),
    [rawValue, max, precision, rounding],
  )

  const displayValue = hoverValue ?? value
  const fills = useMemo(() => getFills(displayValue, max), [displayValue, max])
  const steps = useMemo(() => getSteps(max, precision), [max, precision])

  const select = useCallback(
    (next: number) => {
      if (!interactive) return
      const requested = clampValue(next, max)
      // Re-selecting the current value clears. Lives here rather than in the
      // component so a custom renderer gets the affordance for free.
      const committed = allowClear && requested === value ? 0 : requested
      if (!isControlled) setUncontrolled(committed)
      onChange?.(committed)
    },
    [allowClear, interactive, isControlled, max, onChange, value],
  )

  const setHover = useCallback(
    (next: number | null) => {
      if (!interactive) return
      setHoverValue((prev) => {
        if (prev === next) return prev
        onHoverChange?.(next)
        return next
      })
    },
    [interactive, onHoverChange],
  )

  const setFocused = useCallback((next: number | null) => {
    setFocusedValue(next)
  }, [])

  /**
   * Only emit blur when focus genuinely leaves the group. Arrowing between
   * icons moves focus between sibling radios, and a naive per-input onBlur
   * marks the field touched mid-interaction — firing validation errors while
   * the user is still choosing.
   */
  const handleBlur = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      const next = event.relatedTarget
      if (next instanceof Node && rootRef.current?.contains(next)) return
      setFocusedValue(null)
      setHoverValue((prev) => {
        if (prev !== null) onHoverChange?.(null)
        return null
      })
      onBlur?.(event)
    },
    [onBlur, onHoverChange],
  )

  return {
    max,
    value,
    displayValue,
    fills,
    steps,
    interactive,
    hoverValue,
    focusedValue,
    name,
    baseId,
    rootRef,
    select,
    setHover,
    setFocused,
    handleBlur,
  }
}

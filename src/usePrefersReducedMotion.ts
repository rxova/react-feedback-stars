import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * `window.matchMedia` is typed as always present, but it genuinely is not:
 * jsdom omits it, and plenty of consumers still run their own suites there.
 * Reaching for it through an optional shape keeps the guard real without a
 * lint suppression.
 */
function getMatchMedia(): ((query: string) => MediaQueryList) | undefined {
  if (typeof window === 'undefined') return undefined
  const { matchMedia } = window as { matchMedia?: (query: string) => MediaQueryList }
  return matchMedia?.bind(window)
}

function subscribe(onChange: () => void): () => void {
  const mql = getMatchMedia()?.(QUERY)
  if (!mql) return () => undefined
  mql.addEventListener('change', onChange)
  return () => {
    mql.removeEventListener('change', onChange)
  }
}

function getSnapshot(): boolean {
  return getMatchMedia()?.(QUERY).matches ?? false
}

/**
 * The fill transition is the component's only animation, and it is decorative.
 * Inline styles cannot express a media query, so the preference is read in JS.
 * The server snapshot is `false` so SSR markup matches the no-preference
 * default and hydration stays quiet.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

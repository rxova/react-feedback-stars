import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Rating } from 'react-feedback-stars'

/**
 * A capture surface for the docs. Each example is isolated in a `[data-shot]`
 * box at a fixed, large size so `scripts/capture-examples.mjs` can screenshot it
 * (static displays) or drive it and record frames (interactive states). This is
 * not user-facing; it exists only so the images under the docs examples are
 * generated from the real component, never hand-drawn.
 */

function Heart() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M12 21s-8-4.9-8-10.4A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 3.6C20 16.1 12 21 12 21z" />
    </svg>
  )
}

function Shot({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div data-shot={id} className="shot">
      {children}
    </div>
  )
}

function Interactive({ precision }: { precision: number }) {
  const [score, setScore] = useState(0)
  return <Rating value={score} onChange={setScore} precision={precision} label="Rate" />
}

/** Interactive with a distinct hover colour and a slow transition, for the styling GIF. */
function StyleHover() {
  const [score, setScore] = useState(0)
  return (
    <Rating
      value={score}
      onChange={setScore}
      precision={0.5}
      label="Rate"
      style={{
        ['--rfs-color-hover' as string]: '#22c55e',
        ['--rfs-transition' as string]: '260ms',
      }}
    />
  )
}

function App() {
  return (
    <main style={{ ['--rfs-size' as string]: '2.25rem' }}>
      {/* Static displays → screenshots */}
      <Shot id="continuous">
        <Rating value={4.3} />
      </Shot>
      <Shot id="whole">
        <Rating value={4.3} precision={1} />
      </Shot>
      <Shot id="half">
        <Rating value={4.3} precision={0.5} />
      </Shot>
      <Shot id="emoji">
        <Rating value={3.5} icon="⭐" />
      </Shot>
      <Shot id="hearts">
        <Rating
          value={3}
          max={5}
          icon={<Heart />}
          style={{ ['--rfs-color-filled' as string]: 'crimson' }}
        />
      </Shot>
      <Shot id="max10">
        <Rating value={7.5} max={10} />
      </Shot>
      <Shot id="render-fn">
        <Rating value={2.5} icon={(s) => <span>{s.partial ? '◐' : s.filled ? '●' : '○'}</span>} />
      </Shot>

      {/* Styling gallery → one screenshot showing several visual knobs at once. */}
      <Shot id="styling-gallery">
        <div style={{ display: 'grid', gap: '0.55rem' }}>
          <Rating
            value={3.5}
            style={{
              ['--rfs-color-filled' as string]: '#6d28d9',
              ['--rfs-color-empty' as string]: '#e5e7eb',
            }}
          />
          <Rating
            value={3.5}
            icon={<Heart />}
            style={{
              ['--rfs-color-filled' as string]: 'crimson',
              ['--rfs-gap' as string]: '0.4rem',
            }}
          />
          <Rating value={3.5} icon="⭐" />
          <Rating
            value={3.5}
            style={{
              ['--rfs-size' as string]: '1.5rem',
              ['--rfs-color-filled' as string]: '#0ea5e9',
            }}
          />
        </div>
      </Shot>

      {/* Interactive → GIFs. Driven by the capture script. */}
      <Shot id="int-half">
        <Interactive precision={0.5} />
      </Shot>
      <Shot id="int-whole">
        <Interactive precision={1} />
      </Shot>
      <Shot id="style-hover">
        <StyleHover />
      </Shot>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

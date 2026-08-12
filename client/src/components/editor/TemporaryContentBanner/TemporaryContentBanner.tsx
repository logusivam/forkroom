import { useState } from 'react'

export function TemporaryContentBanner() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div
      style={{
        backgroundColor: 'rgba(206, 145, 120, 0.2)',
        borderColor: 'rgba(206, 145, 120, 0.3)',
      }}
      className="flex items-center justify-between px-4 py-2 border-b text-accent-amber text-xs font-medium select-none"
    >
      <span>
        ⚠️ Content is temporary. All code is lost when all collaborators leave the room. Copy your code before closing the tab.
      </span>
      <button
        onClick={() => setVisible(false)}
        className="ml-4 font-bold hover:text-text-primary focus:outline-none text-sm leading-none"
      >
        Dismiss
      </button>
    </div>
  )
}

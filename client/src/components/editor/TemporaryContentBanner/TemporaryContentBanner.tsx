import { useState } from 'react'

export function TemporaryContentBanner() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-accent-amber bg-opacity-20 border-b border-accent-amber border-opacity-30 text-accent-amber text-xs font-medium select-none">
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

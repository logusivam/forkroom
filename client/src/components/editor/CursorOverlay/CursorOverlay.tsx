import { useEffect, useState } from 'react'
import * as monaco from 'monaco-editor'
import { AwarenessState } from '../../../types/awareness'

interface CursorOverlayProps {
  editor: monaco.editor.IStandaloneCodeEditor | null
  awarenessStates: Map<number, AwarenessState>
}

interface FloatingCursor {
  clientId: number
  name: string
  colour: string
  x: number
  y: number
  visible: boolean
}

export function CursorOverlay({ editor, awarenessStates }: CursorOverlayProps) {
  const [floatingCursors, setFloatingCursors] = useState<FloatingCursor[]>([])

  useEffect(() => {
    if (!editor) return

    const updateCursorPositions = () => {
      const newCursors: FloatingCursor[] = []

      awarenessStates.forEach((state, clientId) => {
        if (!state.cursor || !state.cursor.head) return

        const pos = state.cursor.head
        const coords = editor.getScrolledVisiblePosition({
          lineNumber: pos.line,
          column: pos.column,
        })

        if (coords) {
          newCursors.push({
            clientId,
            name: state.name,
            colour: state.colour,
            x: coords.left,
            y: coords.top,
            visible: true,
          })
        }
      })

      setFloatingCursors(newCursors)
    }

    const scrollDisposable = editor.onDidScrollChange(updateCursorPositions)
    const contentDisposable = editor.onDidChangeModelContent(updateCursorPositions)

    updateCursorPositions()

    const interval = setInterval(updateCursorPositions, 100)

    return () => {
      scrollDisposable.dispose()
      contentDisposable.dispose()
      clearInterval(interval)
    }
  }, [editor, awarenessStates])

  if (!editor) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {floatingCursors.map((cursor) => (
        <div
          key={cursor.clientId}
          style={{
            position: 'absolute',
            left: `${cursor.x}px`,
            top: `${cursor.y}px`,
            transform: 'translateY(-100%)',
            zIndex: 100,
          }}
          className="flex flex-col items-start transition-all duration-75"
        >
          {/* Custom Cursor Line */}
          <div
            style={{ backgroundColor: cursor.colour, height: '18px', width: '2px' }}
            className="absolute left-0 top-[18px]"
          />
          {/* Name Tag Pill */}
          <div
            style={{ backgroundColor: cursor.colour }}
            className="px-1.5 py-0.5 rounded text-[10px] font-bold text-black whitespace-nowrap shadow select-none"
          >
            {cursor.name}
          </div>
        </div>
      ))}
    </div>
  )
}

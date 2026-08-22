import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { WebsocketProvider } from 'y-websocket'
import { useAwareness } from '../../../hooks/useAwareness'
import { CursorOverlay } from '../CursorOverlay'

interface MonacoPanelProps {
  provider: WebsocketProvider | null
  language: string
  onEditorMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void
  onRunCode?: () => void
}

export function MonacoPanel({ provider, language, onEditorMount, onRunCode }: MonacoPanelProps) {
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null)
  const awarenessStates = useAwareness(provider)

  useEffect(() => {
    if (!editor || !provider) return

    const updateAwarenessCursor = () => {
      const selection = editor.getSelection()
      if (!selection) return

      const anchor = {
        line: selection.startLineNumber,
        column: selection.startColumn,
      }
      const head = {
        line: selection.endLineNumber,
        column: selection.endColumn,
      }

      provider.awareness.setLocalStateField('cursor', { anchor, head })
    }

    // Throttle cursor selection changes to 50ms (max 20 updates/second) to reduce WebSocket traffic
    let inThrottle = false
    const throttledUpdateCursor = () => {
      if (!inThrottle) {
        updateAwarenessCursor()
        inThrottle = true
        setTimeout(() => {
          inThrottle = false
        }, 50)
      }
    }

    const disposable = editor.onDidChangeCursorSelection(throttledUpdateCursor)
    const interval = setInterval(updateAwarenessCursor, 1000)

    // Add Ctrl+Enter shortcut listener to run code
    const keyDisposable = editor.onKeyDown((e) => {
      if (e.ctrlKey && e.keyCode === monaco.KeyCode.Enter) {
        e.preventDefault()
        e.stopPropagation()
        if (onRunCode) {
          onRunCode()
        }
      }
    })

    return () => {
      disposable.dispose()
      keyDisposable.dispose()
      clearInterval(interval)
    }
  }, [editor, provider, onRunCode])

  const handleEditorDidMount = (editorInstance: monaco.editor.IStandaloneCodeEditor) => {
    setEditor(editorInstance)
    if (onEditorMount) onEditorMount(editorInstance)
  }

  return (
    <div className="relative flex-1 w-full h-full min-h-[300px] md:min-h-[500px] bg-surface-1 border border-border rounded-lg overflow-hidden">
      <Editor
        height="100%"
        width="100%"
        language={language}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: { top: 12, bottom: 12 },
        }}
        onMount={handleEditorDidMount}
      />
      <CursorOverlay editor={editor} awarenessStates={awarenessStates} />
    </div>
  )
}

import { useEffect, useState, useRef } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { bindYTextToMonaco } from '../lib/monacoBinding'
import * as monaco from 'monaco-editor'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'ws://localhost:3001'

export function useYjs(
  roomId: string,
  name: string,
  colour: string,
  editor: monaco.editor.IStandaloneCodeEditor | null
) {
  const [provider, setProvider] = useState<WebsocketProvider | null>(null)
  const ydocRef = useRef<Y.Doc | null>(null)

  useEffect(() => {
    if (!roomId || !name) return

    const ydoc = new Y.Doc()
    ydocRef.current = ydoc

    const wsBaseUrl = SERVER_URL.replace(/^http/, 'ws')
    const wsUrl = `${wsBaseUrl}/yjs`

    const wsProvider = new WebsocketProvider(wsUrl, roomId, ydoc, {
      connect: false,
    })

    wsProvider.connect()
    setProvider(wsProvider)

    // Set local awareness user metadata
    wsProvider.awareness.setLocalStateField('user', { name, colour })

    return () => {
      wsProvider.disconnect()
      ydoc.destroy()
    }
  }, [roomId, name, colour])

  useEffect(() => {
    if (!editor || !ydocRef.current || !provider) return

    const yText = ydocRef.current.getText('codetext')
    const model = editor.getModel()
    if (!model) return

    const cleanup = bindYTextToMonaco(yText, model)

    return () => {
      cleanup()
    }
  }, [editor, provider])

  return { provider, ydoc: ydocRef.current }
}

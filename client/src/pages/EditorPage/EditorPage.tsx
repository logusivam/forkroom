import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Helmet } from 'react-helmet-async'
import { useRoom } from '../../hooks/useRoom'
import { useYjs } from '../../hooks/useYjs'
import { useConnectionStatus } from '../../hooks/useConnectionStatus'
import { useCodeRunner } from '../../hooks/useCodeRunner'
import { getCursorColour } from '../../lib/colourAssigner'
import { MonacoPanel } from '../../components/editor/MonacoPanel'
import { UserAvatarList } from '../../components/editor/UserAvatarList'
import { ConnectionStatusBar } from '../../components/common/ConnectionStatusBar'
import { ToastProvider } from '../../components/common/ToastProvider'
import { TemporaryContentBanner } from '../../components/editor/TemporaryContentBanner'
import { LanguageSelector } from '../../components/editor/LanguageSelector'
import { OutputPanel } from '../../components/editor/OutputPanel'
import { LanguageId } from '../../constants/languages'
import { SOCKET_EVENTS } from '../../constants/socket-events'

export function EditorPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()

  const [name, setName] = useState<string>('')
  const [inputName, setInputName] = useState<string>('')
  const [colour, setColour] = useState<string>('')
  const [language, setLanguage] = useState<string>('javascript')
  const [editor, setEditor] = useState<any>(null)
  const [hasPreviousName, setHasPreviousName] = useState(false)

  useEffect(() => {
    if (roomId) {
      const savedName = localStorage.getItem(`forkroom_name_${roomId}`)
      if (savedName) {
        setInputName(savedName)
        setHasPreviousName(true)
      }
    }
  }, [roomId])

  useEffect(() => {
    if (!roomId) {
      navigate('/', { replace: true })
    }
  }, [roomId, navigate])

  const { socket, users, toasts, setToasts } = useRoom(roomId || '', name, colour)
  const { provider, ydoc } = useYjs(roomId || '', name, colour, editor)
  const connectionStatus = useConnectionStatus(provider)
  const { output, executeCode, clearOutput } = useCodeRunner(roomId || '', name, socket, ydoc)

  // Listen to remote language updates
  useEffect(() => {
    if (!socket) return

    socket.on(SOCKET_EVENTS.LANGUAGE_CHANGED, ({ language: newLang }: { language: string }) => {
      setLanguage(newLang)
    })

    socket.on(SOCKET_EVENTS.ROOM_STATE, ({ language: currentLang }: { language: string }) => {
      if (currentLang) setLanguage(currentLang)
    })

    return () => {
      socket.off(SOCKET_EVENTS.LANGUAGE_CHANGED)
    }
  }, [socket])

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputName.trim()) return

    const randomColor = getCursorColour(Math.floor(Math.random() * 8))
    setColour(randomColor)
    setName(inputName.trim())
    if (roomId) {
      localStorage.setItem(`forkroom_name_${roomId}`, inputName.trim())
    }
  }

  const handleLanguageChange = (newLang: LanguageId) => {
    setLanguage(newLang)
    if (socket && roomId) {
      socket.emit(SOCKET_EVENTS.LANGUAGE_CHANGE, { roomId, language: newLang })
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    const toastId = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id: toastId, message: 'Room link copied to clipboard!', type: 'join' }])
  }

  if (!roomId) return null

  if (!name) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface-1 text-text-primary px-4">
        <Helmet>
          <title>Join Room — Forkroom</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <form onSubmit={handleJoin} className="w-full max-w-sm p-6 bg-surface-2 border border-border rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center">Join Room</h2>
          <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">
            Your Display Name
          </label>
          <input
            type="text"
            required
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            disabled={hasPreviousName}
            placeholder="e.g. Loganathan"
            maxLength={15}
            className={`w-full bg-surface-3 border border-border rounded px-3 py-2 text-sm focus:outline-none mb-4 focus:border-accent-green transition-colors ${
              hasPreviousName ? 'cursor-not-allowed opacity-75' : ''
            }`}
          />
          <button
            type="submit"
            className="w-full bg-accent-blue text-white rounded py-2 text-sm font-semibold hover:bg-opacity-90 transition-colors"
          >
            Enter Room
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-surface-1 text-text-primary overflow-hidden">
      <Helmet>
        <title>Room: {roomId} — Forkroom</title>
      </Helmet>

      {/* Header controls bar */}
      <header className="flex items-center justify-between px-6 py-4 bg-surface-2 border-b border-border select-none">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-accent-green text-lg tracking-wider">FORKROOM</span>
          <div className="flex items-center bg-surface-3 px-3 py-1.5 border border-border rounded-md text-xs font-medium">
            <span className="text-text-secondary mr-2">ROOM:</span>
            <span className="text-text-primary uppercase tracking-wide">{roomId}</span>
          </div>
          <button
            onClick={handleCopyLink}
            className="bg-surface-3 border border-border hover:bg-opacity-80 px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer"
          >
            Copy Link
          </button>
          <button
            onClick={executeCode}
            className="bg-accent-green hover:bg-opacity-95 text-black px-4 py-1.5 rounded text-xs font-bold transition-all cursor-pointer"
          >
            Run Code
          </button>
        </div>

        <div className="flex items-center space-x-6">
          <LanguageSelector value={language} onChange={handleLanguageChange} />
          <UserAvatarList users={users} />
          <ConnectionStatusBar status={connectionStatus} />
        </div>
      </header>

      {/* Amber Warning Banner */}
      <TemporaryContentBanner />

      <main className="flex-1 p-6 overflow-y-auto md:overflow-hidden flex flex-col md:flex-row gap-6">
        <div className="flex-[7] relative h-[55vh] md:h-full">
          <MonacoPanel
            provider={provider}
            language={language}
            onEditorMount={setEditor}
          />
        </div>
        <div className="flex-[3] h-[30vh] md:h-full">
          <OutputPanel output={output} onClear={clearOutput} language={language} />
        </div>
      </main>

      {/* Toast Alert overlay */}
      <ToastProvider toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  )
}

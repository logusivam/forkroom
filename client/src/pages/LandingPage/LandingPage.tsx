import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Helmet } from 'react-helmet-async'

export function LandingPage() {
  const [roomId, setRoomId] = useState('')
  const navigate = useNavigate()

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!roomId.trim()) return
    navigate(`/room/${roomId.trim()}`)
  }

  const handleCreateRandom = () => {
    const randomId = Math.random().toString(36).substring(2, 10)
    navigate(`/room/${randomId}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-1 text-text-primary px-4">
      <Helmet>
        <title>Forkroom — Real-Time Collaborative Code Editor</title>
        <meta name="description" content="Code together instantly. Share a room link, start editing in real-time with live cursors and conflict-free sync." />
        <link rel="canonical" href="https://forkroom.dev/" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="w-full max-w-md p-8 bg-surface-2 border border-border rounded-lg shadow-xl text-center">
        <h1 className="text-4xl font-extrabold text-accent-green mb-2 tracking-wider">FORKROOM</h1>
        <p className="text-text-secondary text-sm mb-8">
          Instant, real-time collaborative coding sandbox. No signup required.
        </p>

        <form onSubmit={handleJoin} className="space-y-4 mb-6">
          <div>
            <label className="block text-left text-xs font-semibold text-text-secondary uppercase mb-2">
              Enter Room ID
            </label>
            <input
              type="text"
              required
              placeholder="e.g. workspace-alpha"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full bg-surface-3 border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-accent-green transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent-blue hover:bg-opacity-90 text-white rounded py-2.5 text-sm font-bold transition-all cursor-pointer"
          >
            Join Existing Room
          </button>
        </form>

        <div className="relative flex py-3 items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-xs text-text-secondary uppercase font-semibold">Or</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        <button
          onClick={handleCreateRandom}
          className="w-full mt-4 bg-accent-green hover:bg-opacity-95 text-black rounded py-2.5 text-sm font-bold transition-all cursor-pointer"
        >
          Create Random Room
        </button>
      </div>
    </div>
  )
}

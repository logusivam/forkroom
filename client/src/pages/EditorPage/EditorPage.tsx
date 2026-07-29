import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Helmet } from 'react-helmet-async'

export function EditorPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (!roomId) {
      navigate('/', { replace: true })
    }
  }, [roomId, navigate])

  if (!roomId) return null

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <Helmet>
        <title>Collaborative Editor Room — Forkroom</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <h1 className="text-3xl font-bold mb-4">Room: {roomId}</h1>
      <p className="text-text-secondary">Monaco editor and collaborative sync will be rendered here.</p>
    </div>
  )
}

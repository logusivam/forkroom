import { useEffect, useState } from 'react'
import { WebsocketProvider } from 'y-websocket'
import { AwarenessState } from '../types/awareness'

export function useAwareness(provider: WebsocketProvider | null) {
  const [awarenessStates, setAwarenessStates] = useState<Map<number, AwarenessState>>(new Map())

  useEffect(() => {
    if (!provider) return

    const handleAwarenessChange = () => {
      const states = new Map<number, AwarenessState>()
      provider.awareness.getStates().forEach((state: any, clientID: number) => {
        if (state.user) {
          states.set(clientID, {
            name: state.user.name,
            colour: state.user.colour,
            cursor: state.cursor || null,
          })
        }
      })
      setAwarenessStates(states)
    }

    provider.awareness.on('change', handleAwarenessChange)

    return () => {
      provider.awareness.off('change', handleAwarenessChange)
    }
  }, [provider])

  return awarenessStates
}

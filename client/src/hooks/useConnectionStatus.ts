import { useEffect, useState } from 'react'
import { WebsocketProvider } from 'y-websocket'

export type ConnectionState = 'connected' | 'reconnecting' | 'disconnected'

export function useConnectionStatus(provider: WebsocketProvider | null) {
  const [status, setStatus] = useState<ConnectionState>('disconnected')

  useEffect(() => {
    if (!provider) {
      setStatus('disconnected')
      return
    }

    const onStatus = ({ status: wsStatus }: { status: string }) => {
      if (wsStatus === 'connected') {
        setStatus('connected')
      } else if (wsStatus === 'connecting') {
        setStatus('reconnecting')
      } else {
        setStatus('disconnected')
      }
    }

    provider.on('status', onStatus)

    if (provider.wsconnected) {
      setStatus('connected')
    } else {
      setStatus('reconnecting')
    }

    return () => {
      provider.off('status', onStatus)
    }
  }, [provider])

  return status
}

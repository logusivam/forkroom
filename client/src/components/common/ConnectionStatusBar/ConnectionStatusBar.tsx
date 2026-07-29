import { ConnectionState } from '../../../hooks/useConnectionStatus'

interface ConnectionStatusBarProps {
  status: ConnectionState
}

export function ConnectionStatusBar({ status }: ConnectionStatusBarProps) {
  const statusColors = {
    connected: 'bg-accent-green',
    reconnecting: 'bg-accent-amber animate-pulse',
    disconnected: 'bg-accent-red',
  }

  const statusLabels = {
    connected: 'Connected',
    reconnecting: 'Reconnecting',
    disconnected: 'Disconnected',
  }

  return (
    <div className="flex items-center space-x-2 px-3 py-1 bg-surface-2 border border-border rounded-full text-xs font-medium">
      <span className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
      <span className="text-text-secondary">{statusLabels[status]}</span>
    </div>
  )
}

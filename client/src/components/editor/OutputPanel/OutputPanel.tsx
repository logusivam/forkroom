interface RunOutput {
  output: string
  runBy: string
  timestamp: number
}

interface OutputPanelProps {
  output: RunOutput | null
  onClear: () => void
}

export function OutputPanel({ output, onClear }: OutputPanelProps) {
  const getLineClass = (line: string) => {
    if (line.startsWith('[warn] ')) return 'text-accent-amber'
    if (line.startsWith('[error] ') || line.startsWith('Error: ')) return 'text-accent-red'
    return 'text-text-primary'
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div className="flex flex-col h-full bg-surface-2 border border-border rounded-lg overflow-hidden select-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-3">
        <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Console Output</span>
        {output && (
          <button
            onClick={onClear}
            className="text-xs text-accent-red hover:underline focus:outline-none cursor-pointer font-semibold"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1">
        {output ? (
          output.output.split('\n').map((line, idx) => (
            <div key={idx} className={getLineClass(line)}>
              {line}
            </div>
          ))
        ) : (
          <span className="text-text-secondary italic">No output. Press Run to execute the code.</span>
        )}
      </div>

      {output && (
        <div className="px-4 py-2 border-t border-border bg-surface-3 text-[10px] text-text-secondary flex justify-between">
          <span>
            Run by: <strong className="text-text-primary">{output.runBy}</strong>
          </span>
          <span>{formatTimestamp(output.timestamp)}</span>
        </div>
      )}
    </div>
  )
}

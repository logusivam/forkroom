import { useState } from 'react'

interface RunOutput {
  output: string
  runBy: string
  timestamp: number
  latency?: number
}

interface OutputPanelProps {
  output: RunOutput | null
  onClear: () => void
}

export function OutputPanel({ output, onClear }: OutputPanelProps) {
  const [copied, setCopied] = useState(false)

  const getLineClass = (line: string) => {
    if (line.startsWith('[warn] ')) return 'text-accent-amber'
    if (line.startsWith('[error] ') || line.startsWith('Error: ')) return 'text-accent-red'
    return 'text-text-primary'
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const handleCopy = () => {
    if (!output) return
    // Remove the [warn] and [error] tags from copied console output if they exist
    const cleanOutput = output.output
      .replace(/^\[warn\]\s+/gm, '')
      .replace(/^\[error\]\s+/gm, '')
    navigator.clipboard.writeText(cleanOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full bg-surface-2 border border-border rounded-lg overflow-hidden select-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-3">
        <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Console Output</span>
        {output && (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 text-xs text-text-secondary hover:text-text-primary focus:outline-none cursor-pointer font-semibold transition-colors"
              title="Copy output"
            >
              {copied ? (
                <>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4EC9B0"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="inline-block"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-accent-green">Copied!</span>
                </>
              ) : (
                <>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="inline-block"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
            <span className="text-border">|</span>
            <button
              onClick={onClear}
              className="text-xs text-accent-red hover:underline focus:outline-none cursor-pointer font-semibold"
            >
              Clear
            </button>
          </div>
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
            {typeof output.latency === 'number' && (
              <>
                <span className="mx-1 text-border">|</span>
                <span>Latency: <strong className="text-text-primary">{output.latency}ms</strong></span>
              </>
            )}
          </span>
          <span>{formatTimestamp(output.timestamp)}</span>
        </div>
      )}
    </div>
  )
}

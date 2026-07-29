import { useEffect, useState, MutableRefObject } from 'react'
import { Socket } from 'socket.io-client'
import { runCode } from '../lib/evalSandbox'
import { SOCKET_EVENTS } from '../constants/socket-events'

interface RunOutput {
  output: string
  runBy: string
  timestamp: number
}

export function useCodeRunner(
  roomId: string,
  name: string,
  socketRef: MutableRefObject<Socket | null>,
  ydoc: any
) {
  const [output, setOutput] = useState<RunOutput | null>(null)

  useEffect(() => {
    const socket = socketRef.current
    if (!socket) return

    const handleCodeOutput = (data: RunOutput) => {
      setOutput(data)
    }

    socket.on(SOCKET_EVENTS.CODE_OUTPUT, handleCodeOutput)

    return () => {
      socket.off(SOCKET_EVENTS.CODE_OUTPUT, handleCodeOutput)
    }
  }, [socketRef])

  const executeCode = () => {
    if (!ydoc) return

    const code = ydoc.getText('codetext').toString()
    const result = runCode(code)

    const runData: RunOutput = {
      output: result,
      runBy: name,
      timestamp: Date.now(),
    }

    setOutput(runData)

    if (socketRef.current) {
      socketRef.current.emit(SOCKET_EVENTS.RUN_CODE, {
        roomId,
        output: result,
        runBy: name,
      })
    }
  }

  const clearOutput = () => {
    setOutput(null)
  }

  return { output, executeCode, clearOutput }
}

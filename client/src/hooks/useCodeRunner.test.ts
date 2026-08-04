import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCodeRunner } from './useCodeRunner'
import * as Y from 'yjs'

describe('useCodeRunner', () => {
  let socketMock: any
  let ydoc: Y.Doc
  let yText: Y.Text

  beforeEach(() => {
    socketMock = {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    }
    ydoc = new Y.Doc()
    yText = ydoc.getText('codetext')
  })

  it('should run code and emit code-output via socket', () => {
    yText.insert(0, 'console.log("runner works")')
    const { result } = renderHook(() => useCodeRunner('room123', 'UserA', socketMock, ydoc))

    act(() => {
      result.current.executeCode()
    })

    expect(result.current.output?.output).toBe('runner works')
    expect(socketMock.emit).toHaveBeenCalledWith('run-code', {
      roomId: 'room123',
      output: 'runner works',
      runBy: 'UserA',
    })
  })

  it('should clear outputs', () => {
    yText.insert(0, '123')
    const { result } = renderHook(() => useCodeRunner('room123', 'UserA', socketMock, ydoc))

    act(() => {
      result.current.executeCode()
    })
    expect(result.current.output).not.toBeNull()

    act(() => {
      result.current.clearOutput()
    })
    expect(result.current.output).toBeNull()
  })
})

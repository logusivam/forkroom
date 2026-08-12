import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as Y from 'yjs'
import { bindYTextToMonaco } from './monacoBinding'

// Mock monaco-editor Range
vi.mock('monaco-editor', () => {
  class Range {
    constructor(
      public startLineNumber: number,
      public startColumn: number,
      public endLineNumber: number,
      public endColumn: number
    ) {}
  }
  return {
    Range,
  }
})

describe('monacoBinding', () => {
  let doc: Y.Doc
  let yText: Y.Text
  let mockModel: any
  let changeListeners: (() => void)[]

  beforeEach(() => {
    doc = new Y.Doc()
    yText = doc.getText('codetext')
    changeListeners = []
    mockModel = {
      setValue: vi.fn(),
      getValue: vi.fn(),
      getPositionAt: vi.fn().mockReturnValue({ lineNumber: 1, column: 1 }),
      applyEdits: vi.fn(),
      onDidChangeContent: vi.fn().mockImplementation((listener) => {
        changeListeners.push(listener)
        return { dispose: vi.fn() }
      }),
    }
  })

  it('should initialize Monaco model with Yjs text value', () => {
    yText.insert(0, 'Hello World')
    const cleanup = bindYTextToMonaco(yText, mockModel)
    expect(mockModel.setValue).toHaveBeenCalledWith('Hello World')
    cleanup()
  })

  it('should apply remote edits to Monaco model', () => {
    const cleanup = bindYTextToMonaco(yText, mockModel)

    // Simulate remote edit
    const remoteDoc = new Y.Doc()
    const remoteYText = remoteDoc.getText('codetext')
    remoteYText.insert(0, 'A')
    const update = Y.encodeStateAsUpdate(remoteDoc)
    Y.applyUpdate(doc, update)

    expect(mockModel.applyEdits).toHaveBeenCalled()
    cleanup()
  })
})

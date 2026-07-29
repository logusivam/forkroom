import { describe, it, expect } from 'vitest'
import { runCode } from './evalSandbox'

describe('evalSandbox', () => {
  it('should run basic arithmetic and return value', () => {
    expect(runCode('2 + 3')).toBe('5')
  })

  it('should capture console.log output', () => {
    expect(runCode('console.log("hello"); 10')).toBe('hello')
  })

  it('should capture warn/error tags', () => {
    expect(runCode('console.warn("warning"); console.error("error")')).toBe(
      '[warn] warning\n[error] error'
    )
  })

  it('should handle runtime errors', () => {
    expect(runCode('nonExistentVar')).toContain('Error:')
  })

  it('should handle empty outputs', () => {
    expect(runCode('')).toBe('(no output)')
  })
})

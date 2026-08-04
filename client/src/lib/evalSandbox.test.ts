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

  it('should transpile and execute TypeScript code', () => {
    const code = 'const x: number = 42; console.log(x);'
    expect(runCode(code, 'typescript')).toBe('42')
  })

  it('should parse HTML and execute script tags', () => {
    const code = '<h1>Title</h1><script>console.log("hello HTML")</script>'
    expect(runCode(code, 'html')).toContain('hello HTML')
  })

  it('should parse and format valid JSON', () => {
    const code = '{"a": 1}'
    expect(runCode(code, 'json')).toContain('[JSON Valid]')
  })

  it('should execute basic Python print statements', () => {
    const code = 'x = 100\nprint(x)'
    expect(runCode(code, 'python')).toBe('100')
  })
})

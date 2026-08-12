import { describe, it, expect } from 'vitest'
import { getLanguageDisplayName } from './languageMap'

describe('languageMap', () => {
  it('should return display name for supported languages', () => {
    expect(getLanguageDisplayName('javascript')).toBe('JavaScript')
    expect(getLanguageDisplayName('typescript')).toBe('TypeScript')
    expect(getLanguageDisplayName('python')).toBe('Python')
    expect(getLanguageDisplayName('json')).toBe('JSON')
  })

  it('should return language ID if language is unsupported', () => {
    expect(getLanguageDisplayName('go')).toBe('go')
    expect(getLanguageDisplayName('rust')).toBe('rust')
  })
})

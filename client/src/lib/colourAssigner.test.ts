import { describe, it, expect } from 'vitest'
import { getCursorColour } from './colourAssigner'
import { CURSOR_COLOURS } from '../types/awareness'

describe('colourAssigner', () => {
  it('should return correct color for indexes 0-7', () => {
    for (let i = 0; i < CURSOR_COLOURS.length; i++) {
      expect(getCursorColour(i)).toBe(CURSOR_COLOURS[i])
    }
  })

  it('should wrap around for indexes >= 8', () => {
    expect(getCursorColour(8)).toBe(CURSOR_COLOURS[0])
    expect(getCursorColour(15)).toBe(CURSOR_COLOURS[7])
    expect(getCursorColour(16)).toBe(CURSOR_COLOURS[0])
  })
})

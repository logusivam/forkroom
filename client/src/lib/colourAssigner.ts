import { CURSOR_COLOURS } from '../types/awareness'

export function getCursorColour(index: number): string {
  return CURSOR_COLOURS[index % CURSOR_COLOURS.length]
}

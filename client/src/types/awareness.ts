export interface AwarenessState {
  name: string
  colour: string
  cursor: {
    anchor: { line: number; column: number } | null
    head: { line: number; column: number } | null
  } | null
}

export const CURSOR_COLOURS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#98D8C8',
  '#F7DC6F',
] as const

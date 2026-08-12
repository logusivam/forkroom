import { describe, it, expect } from 'vitest'
import { generateRoomId } from './roomUtils'

describe('roomUtils', () => {
  it('should generate a 10 character room ID', () => {
    const roomId = generateRoomId()
    expect(roomId).toBeTypeOf('string')
    expect(roomId).toHaveLength(10)
  })

  it('should generate unique room IDs', () => {
    const id1 = generateRoomId()
    const id2 = generateRoomId()
    expect(id1).not.toBe(id2)
  })
})

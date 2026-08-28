import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { io as clientIo } from 'socket.io-client'
import { registerRoomHandler } from '../../src/socket/roomHandler.js'
import { roomStore } from '../../src/socket/roomStore.js'

function deserializeUsers(buffer) {
  const buf = buffer instanceof ArrayBuffer ? buffer : buffer.buffer
  const byteOffset = buffer instanceof ArrayBuffer ? 0 : buffer.byteOffset
  const byteLength = buffer instanceof ArrayBuffer ? buffer.byteLength : buffer.byteLength
  
  const view = new DataView(buf, byteOffset, byteLength)
  const decoder = new TextDecoder('utf-8')
  const count = view.getUint16(0)
  let offset = 2
  const users = []
  
  const uint8 = new Uint8Array(buf, byteOffset, byteLength)
  
  for (let i = 0; i < count; i++) {
    const idLen = view.getUint8(offset)
    offset += 1
    const id = decoder.decode(uint8.subarray(offset, offset + idLen))
    offset += idLen
    
    const nameLen = view.getUint8(offset)
    offset += 1
    const name = decoder.decode(uint8.subarray(offset, offset + nameLen))
    offset += nameLen
    
    const colourLen = view.getUint8(offset)
    offset += 1
    const colour = decoder.decode(uint8.subarray(offset, offset + colourLen))
    offset += colourLen
    
    users.push({ id, name, colour })
  }
  return users
}
function deserializeRoomState(buffer) {
  const buf = buffer instanceof ArrayBuffer ? buffer : buffer.buffer
  const byteOffset = buffer instanceof ArrayBuffer ? 0 : buffer.byteOffset
  const byteLength = buffer instanceof ArrayBuffer ? buffer.byteLength : buffer.byteLength
  
  const view = new DataView(buf, byteOffset, byteLength)
  const decoder = new TextDecoder('utf-8')
  
  const clientTimestamp = view.getFloat64(0)
  const langLen = view.getUint8(8)
  const language = decoder.decode(new Uint8Array(buf, byteOffset + 9, langLen))
  
  const usersOffset = 9 + langLen
  const usersBuffer = new Uint8Array(buf, byteOffset + usersOffset, byteLength - usersOffset)
  const users = deserializeUsers(usersBuffer)
  
  return { users, language, clientTimestamp }
}

describe('Socket.io room events', () => {
  let server, io, port, clientSocket, clientSocket2

  beforeAll(async () => {
    const httpServer = createServer()
    io = new Server(httpServer)
    io.on('connection', (socket) => registerRoomHandler(io, socket))

    await new Promise((resolve) => {
      httpServer.listen(0, () => {
        port = httpServer.address().port
        server = httpServer
        resolve()
      })
    })
  })

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve))
  })

  beforeEach(() => {
    roomStore.clear()
  })

  it('should join room and sync state', async () => {
    clientSocket = clientIo(`http://localhost:${port}`)

    await new Promise((resolve) => {
      clientSocket.on('connect', resolve)
    })

    const roomStatePromise = new Promise((resolve) => {
      clientSocket.on('room-state', resolve)
    })

    clientSocket.emit('join-room', { roomId: 'room1', name: 'UserA', colour: '#FF6B6B' })

    const state = await roomStatePromise
    const decodedState = deserializeRoomState(state)
    expect(decodedState.users).toHaveLength(1)
    expect(decodedState.users[0].name).toBe('UserA')
    expect(decodedState.language).toBe('javascript')

    clientSocket.disconnect()
  })

  it('should notify others on join and language change', async () => {
    clientSocket = clientIo(`http://localhost:${port}`)
    clientSocket2 = clientIo(`http://localhost:${port}`)

    await Promise.all([
      new Promise((r) => clientSocket.on('connect', r)),
      new Promise((r) => clientSocket2.on('connect', r)),
    ])

    clientSocket.emit('join-room', { roomId: 'room2', name: 'UserA', colour: '#FF6B6B' })
    await new Promise((r) => clientSocket.on('room-state', r))

    const joinNotificationPromise = new Promise((resolve) => {
      clientSocket.on('user-joined', resolve)
    })

    clientSocket2.emit('join-room', { roomId: 'room2', name: 'UserB', colour: '#4ECDC4' })

    const joinedUser = await joinNotificationPromise
    const decodedJoined = deserializeUsers(joinedUser)[0]
    expect(decodedJoined.name).toBe('UserB')

    const languageChangedPromise = new Promise((resolve) => {
      clientSocket2.on('language-changed', resolve)
    })

    clientSocket.emit('language-change', { roomId: 'room2', language: 'typescript' })

    const langData = await languageChangedPromise
    expect(langData.language).toBe('typescript')

    clientSocket.disconnect()
    clientSocket2.disconnect()
  })
})

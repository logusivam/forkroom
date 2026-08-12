import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { io as clientIo } from 'socket.io-client'
import { registerRoomHandler } from '../../src/socket/roomHandler.js'
import { roomStore } from '../../src/socket/roomStore.js'

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
    expect(state.users).toHaveLength(1)
    expect(state.users[0].name).toBe('UserA')
    expect(state.language).toBe('javascript')

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
    expect(joinedUser.name).toBe('UserB')

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

import { roomStore } from './roomStore.js'
import { logger } from '../utils/logger.js'

// Per-socket rate limiting for join-room
const joinAttempts = new Map() // socketId → { count, resetAt }

export function registerRoomHandler(io, socket) {
  socket.on('join-room', ({ roomId, name, colour }) => {
    // Rate limit: max 10 join-room per socket per minute
    const now = Date.now()
    const entry = joinAttempts.get(socket.id) || { count: 0, resetAt: now + 60_000 }
    if (now > entry.resetAt) {
      entry.count = 0
      entry.resetAt = now + 60_000
    }
    entry.count++
    joinAttempts.set(socket.id, entry)
    if (entry.count > 10) {
      socket.emit('error', { message: 'Too many join attempts. Please wait 1 minute.' })
      return
    }

    // Store on socket for disconnect handler
    socket.roomId = roomId
    socket.userName = name

    socket.join(roomId)

    // Update roomStore
    if (!roomStore.has(roomId)) {
      roomStore.set(roomId, { roomId, users: [], language: 'javascript' })
    }
    const room = roomStore.get(roomId)
    // Remove stale entry for same socket (reconnect)
    room.users = room.users.filter((u) => u.id !== socket.id)
    room.users.push({ id: socket.id, name, colour, joinedAt: Date.now() })

    socket.to(roomId).emit('user-joined', { id: socket.id, name, colour })
    socket.emit('room-state', { users: room.users, language: room.language })

    logger.info({ roomId, name, userCount: room.users.length }, 'user joined')
  })

  socket.on('language-change', ({ roomId, language }) => {
    const room = roomStore.get(roomId)
    if (room) room.language = language
    socket.to(roomId).emit('language-changed', { language })
  })

  socket.on('run-code', ({ roomId, output, runBy, latency }) => {
    socket.to(roomId).emit('code-output', { output, runBy, latency, timestamp: Date.now() })
  })

  socket.on('disconnect', () => {
    joinAttempts.delete(socket.id)

    const roomId = socket.roomId
    if (!roomId) return

    const room = roomStore.get(roomId)
    if (!room) return

    room.users = room.users.filter((u) => u.id !== socket.id)

    if (room.users.length === 0) {
      roomStore.delete(roomId) // prevent memory leak — last user gone
      logger.info({ roomId }, 'room destroyed — no users remain')
    } else {
      io.to(roomId).emit('user-left', { id: socket.id, name: socket.userName })
      logger.info({ roomId, name: socket.userName, userCount: room.users.length }, 'user left')
    }
  })
}

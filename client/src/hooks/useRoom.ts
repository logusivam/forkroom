import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import type { RoomUser } from '../types/room'
import { SOCKET_EVENTS } from '../constants/socket-events'

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || 'ws://localhost:3001'

function deserializeUsers(buffer: ArrayBuffer | Uint8Array): RoomUser[] {
  const buf = buffer instanceof ArrayBuffer ? buffer : buffer.buffer
  const byteOffset = buffer instanceof ArrayBuffer ? 0 : buffer.byteOffset
  const byteLength = buffer instanceof ArrayBuffer ? buffer.byteLength : buffer.byteLength

  const view = new DataView(buf, byteOffset, byteLength)
  const decoder = new TextDecoder('utf-8')
  const count = view.getUint16(0)
  let offset = 2
  const users: RoomUser[] = []

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

function deserializeRoomState(buffer: ArrayBuffer | Uint8Array) {
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

export function useRoom(roomId: string, name: string, colour: string) {
  const socketRef = useRef<Socket | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [users, setUsers] = useState<RoomUser[]>([])
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'join' | 'leave' }[]>(
    []
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!roomId || !name) return

    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
    })

    // Intercept socketInstance.on for ROOM_STATE to automatically parse binary buffer
    const originalOn = socketInstance.on
    socketInstance.on = function (event: string, fn: (...args: any[]) => void) {
      if (event === SOCKET_EVENTS.ROOM_STATE) {
        return originalOn.call(this, event, (data: any) => {
          if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
            fn(deserializeRoomState(data))
          } else if (
            data &&
            (data.users instanceof ArrayBuffer || ArrayBuffer.isView(data.users))
          ) {
            const usersDecoded = deserializeUsers(data.users)
            fn({ ...data, users: usersDecoded })
          } else {
            fn(data)
          }
        })
      }
      return originalOn.call(this, event, fn)
    }

    socketRef.current = socketInstance
    setSocket(socketInstance)

    socketInstance.on('connect', () => {
      socketInstance.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId, name, colour })
    })

    socketInstance.on('error', (err: { code: string; message: string }) => {
      if (err.code === 'ROOM_FULL') {
        setError(err.message)
      }
    })

    socketInstance.on(SOCKET_EVENTS.ROOM_STATE, ({ users: roomUsers }: { users: any }) => {
      if (Array.isArray(roomUsers)) {
        const mapped = roomUsers.map((u) =>
          Array.isArray(u) ? { id: u[0], name: u[1], colour: u[2] } : u
        )
        setUsers(mapped)
      } else {
        setUsers(roomUsers)
      }
    })

    socketInstance.on(SOCKET_EVENTS.USER_JOINED, (user: any) => {
      let u: RoomUser
      if (user instanceof ArrayBuffer || ArrayBuffer.isView(user)) {
        u = deserializeUsers(user)[0]
      } else {
        u = Array.isArray(user) ? { id: user[0], name: user[1], colour: user[2] } : user
      }
      setUsers((prev) => [...prev.filter((x) => x.id !== u.id), u])
      const toastId = Math.random().toString(36).substring(2, 9)
      setToasts((prev) => [
        ...prev,
        { id: toastId, message: `${u.name} joined the room`, type: 'join' },
      ])
    })

    socketInstance.on(
      SOCKET_EVENTS.USER_LEFT,
      ({ id, name: leftName }: { id: string; name: string }) => {
        setUsers((prev) => prev.filter((u) => u.id !== id))
        const toastId = Math.random().toString(36).substring(2, 9)
        setToasts((prev) => [
          ...prev,
          { id: toastId, message: `${leftName} left the room`, type: 'leave' },
        ])
      }
    )

    return () => {
      socketInstance.disconnect()
      setSocket(null)
    }
  }, [roomId, name, colour])

  return { socket, socketRef, users, toasts, setToasts, error }
}

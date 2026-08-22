import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import type { RoomUser } from '../types/room'
import { SOCKET_EVENTS } from '../constants/socket-events'

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || 'ws://localhost:3001'

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

    socketInstance.on(SOCKET_EVENTS.ROOM_STATE, ({ users: roomUsers }: { users: RoomUser[] }) => {
      setUsers(roomUsers)
    })

    socketInstance.on(SOCKET_EVENTS.USER_JOINED, (user: RoomUser) => {
      setUsers((prev) => [...prev.filter((u) => u.id !== user.id), user])
      const toastId = Math.random().toString(36).substring(2, 9)
      setToasts((prev) => [
        ...prev,
        { id: toastId, message: `${user.name} joined the room`, type: 'join' },
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

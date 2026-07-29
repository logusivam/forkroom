export interface RoomUser {
  id: string
  name: string
  colour: string
  joinedAt: number
}

export interface RoomState {
  roomId: string
  users: RoomUser[]
  language: string
}

import { Router } from 'express'
import { roomStore } from '../socket/roomStore.js'

export const healthRouter = Router()

healthRouter.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    activeRooms: roomStore.size,
  })
})

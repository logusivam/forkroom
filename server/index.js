import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import WebSocket from 'ws'
import { setupWSConnection } from 'y-websocket/bin/utils'
import { corsMiddleware } from './src/middleware/cors.js'
import { errorHandler } from './src/middleware/errorHandler.js'
import { healthRouter } from './src/routes/health.js'
import { registerRoomHandler } from './src/socket/roomHandler.js'
import { logger } from './src/utils/logger.js'
import 'dotenv/config'

const PORT = process.env.PORT || 3001
const CLIENT_URL = process.env.CLIENT_URL

const app = express()
app.use(corsMiddleware)
app.use(express.json())
app.use('/health', healthRouter)
app.use(errorHandler)

const httpServer = createServer(app)

// Socket.io — room events, presence, language, run-code
const io = new Server(httpServer, {
  cors: { origin: CLIENT_URL, methods: ['GET', 'POST'] },
})
io.on('connection', (socket) => registerRoomHandler(io, socket))

// y-websocket — Yjs CRDT sync, mounted on /yjs path (same port as Socket.io)
const wss = new WebSocket.Server({ noServer: true })
wss.on('connection', (ws, req) => {
  const origin = req.headers.origin
  if (CLIENT_URL && origin !== CLIENT_URL) {
    logger.warn({ origin }, 'WS connection rejected — origin not allowed')
    ws.close(1008, 'Origin not allowed')
    return
  }
  setupWSConnection(ws, req)
})

httpServer.on('upgrade', (request, socket, head) => {
  const url = request.url || ''
  if (url.startsWith('/yjs/')) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request)
    })
  }
})

httpServer.listen(PORT, '0.0.0.0', () => {
  logger.info({ port: PORT }, 'Forkroom server started')
})

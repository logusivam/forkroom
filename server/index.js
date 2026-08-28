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
app.set('trust proxy', 1)
app.use(corsMiddleware)
app.use(express.json())
app.use('/health', healthRouter)
app.use(errorHandler)

const httpServer = createServer(app)

// Native TCP Socket Configuration (Disable Nagle's algorithm)
httpServer.on('connection', (socket) => {
  socket.setNoDelay(true);
  socket.setKeepAlive(true, 30000);
  if (socket._writableState) {
    socket._writableState.highWaterMark = 64 * 1024;
  }
});

// y-websocket — Yjs CRDT sync, mounted on /yjs path (same port as Socket.io)
const wss = new WebSocket.Server({
  noServer: true,
  perMessageDeflate: false,       // eliminate compress overhead on binary CRDT frames (OPT-01)
  maxPayload: 5 * 1024 * 1024,    // reject malformed oversized frames early (5 MB cap) (OPT-01)
})

// Register upgrade handler first to intercept yjs upgrades before Engine.io
httpServer.on('upgrade', (request, socket, head) => {
  const url = request.url || ''
  if (url.startsWith('/yjs/')) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request)
    })
  }
})

// Socket.io — room events, presence, language, run-code
const io = new Server(httpServer, {
  cors: { origin: CLIENT_URL, methods: ['GET', 'POST'] },
  transports: ['websocket'],       // WS only — no polling fallback (OPT-06)
  httpCompression: false,          // Socket.io polling fallback compression — off
  perMessageDeflate: false,        // Socket.io WS compression — off
  maxHttpBufferSize: 10 * 1024 * 1024, // 10MB limit (OPT-06)
  pingTimeout: 20000,
  pingInterval: 25000,
})
io.on('connection', (socket) => registerRoomHandler(io, socket))

const allowedOrigins = new Set(CLIENT_URL ? [CLIENT_URL] : []);

wss.on('connection', (ws, req) => {
  const origin = req.headers.origin
  if (CLIENT_URL && origin && !allowedOrigins.has(origin)) {
    logger.warn({ origin }, 'WS connection rejected — origin not allowed')
    ws.close(1008, 'Origin not allowed')
    return
  }
  setupWSConnection(ws, req)
})

httpServer.listen(PORT, '0.0.0.0', () => {
  logger.info({ port: PORT }, 'Forkroom server started')
})

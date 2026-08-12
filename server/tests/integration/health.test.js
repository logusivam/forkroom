import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createServer } from 'http'
import express from 'express'
import { healthRouter } from '../../src/routes/health.js'

describe('GET /health', () => {
  let server
  let port

  beforeAll(async () => {
    const app = express()
    app.use('/health', healthRouter)
    server = createServer(app)
    await new Promise((resolve) => {
      server.listen(0, () => {
        port = server.address().port
        resolve()
      })
    })
  })

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve))
  })

  it('should return 200 and health payload', async () => {
    const res = await fetch(`http://localhost:${port}/health`)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.status).toBe('ok')
    expect(json).toHaveProperty('timestamp')
    expect(json).toHaveProperty('activeRooms')
  })
})

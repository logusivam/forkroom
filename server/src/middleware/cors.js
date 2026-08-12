import cors from 'cors'

const CLIENT_URL = process.env.CLIENT_URL

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || !CLIENT_URL || origin === CLIENT_URL) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST'],
})

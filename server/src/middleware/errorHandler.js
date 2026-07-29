import { logger } from '../utils/logger.js'

export function errorHandler(err, req, res, next) {
  logger.error(err, 'Unhandled exception occurred')
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  })
}

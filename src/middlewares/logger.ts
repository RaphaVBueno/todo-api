import type { Request, Response, NextFunction } from 'express'

function logger(req: Request, _res: Response, next: NextFunction) {
  const now = new Date()
  console.log(`[${now.toISOString()}] ${req.method} ${req.path}`)
  next()
}

export default logger

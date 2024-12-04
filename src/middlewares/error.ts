import { NextFunction, Request, Response } from 'express'
import { ApiError } from 'src/api.errors'

export const errorMiddleware = (
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode ?? 500
  const errorMessage = error.statusCode
    ? error.message
    : 'Erro interno de Servidor'
  return res.status(statusCode).json({ message: errorMessage })
}

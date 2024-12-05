import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { NextFunction, Request, Response } from 'express'
import { ApiError } from 'src/api.errors'

export const errorMiddleware = (
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error)

  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      return res
        .status(404)
        .json({ message: `${error.meta?.modelName} nâo encontrada` })
    }
    if (error.code === 'P2009') {
      return res.status(400).json({ message: 'erro de validação' })
    }
    if (error.code === 'P2001') {
      return res
        .status(404)
        .json({ message: `${error.meta?.modelName} nâo encontrada` })
    }
    if (error.code === 'P2004') {
      return res.status(400).json({ message: 'erro de validação' })
    }
    if (error.code === 'P2006') {
      return res.status(400).json({ message: 'erro de validação' })
    }
  }

  const statusCode = error.statusCode ?? 500
  const errorMessage = error.statusCode
    ? error.message
    : 'Erro interno de Servidor'
  return res.status(statusCode).json({ message: errorMessage })
}

import type { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default async function auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.header.authorization
  const tokenMatch = authHeader?.match(/^Bearer\s+(\S+)$/)
  const token = tokenMatch ? tokenMatch[1] : ''

  const decoded = jwt.verify(
    token,
    process.env.SECRET as string
  ) as jwt.JwtPayload & { id: number }

  if (!decoded.id)
    return res.status(401).json({ error: 'Acesso não autorizado' })

  const user = await prisma.usuario.findUnique({
    where: {
      id: decoded.id,
    },
  })

  if (!user) return res.status(401).json({ error: 'Acesso não autorizado' })

  req.body.context = { user }

  next()
}

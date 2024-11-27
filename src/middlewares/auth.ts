import type { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default async function auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization
    const tokenMatch = authHeader?.match(/^Bearer\s+(\S+)$/)
    const token = tokenMatch ? tokenMatch[1] : ''

    if (!token) {
      return res.status(401).json({ error: 'acesso negado' })
    }

    const decoded = jwt.verify(
      token,
      process.env.SECRET as string
    ) as jwt.JwtPayload & { id: number }

    if (!decoded.id) {
      return res.status(401).json({ error: 'acesso não autorizado' })
    }

    const user = await prisma.usuario.findUnique({
      where: {
        id: decoded.id,
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'usuário não encontrado' })
    }

    req.body.context = { user }
    next()
  } catch (error: any) {
    console.error('Erro de autenticação', error.message)
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido ou expirado' })
    }
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
}

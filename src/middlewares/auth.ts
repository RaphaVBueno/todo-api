import type { Request, Response, NextFunction } from 'express'
import { PrismaClient, Usuario } from '@prisma/client'
import jwt from 'jsonwebtoken'

import { UnauthorizedError } from 'src/api.errors'

const prisma = new PrismaClient()

interface AuthenticatedRequest extends Request {
  context?: {
    user: Usuario
  }
}

export default async function auth(
  req: AuthenticatedRequest,
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

    req.context = { user }
    next()
  } catch (error: any) {
    console.error('Erro de autenticação', error.message)
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido ou expirado' })
    }
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
}

export function adminOnly(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) {
  const role = req.context?.user.role

  if (!role || (role !== 'ADMIN' && role !== 'SUPERADMIN'))
    throw new UnauthorizedError('Acessso não autorizado')

  next()
}

export function superAdminOnly(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) {
  const role = req.context?.user.role

  if (!role || role !== 'SUPERADMIN')
    throw new UnauthorizedError(
      'Acessso não autorizado vc não é um super admin'
    )

  next()
}

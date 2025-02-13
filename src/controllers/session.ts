import jwt from 'jsonwebtoken'
import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { send } from '../services/mailer.js'

const router = express.Router()
const prisma = new PrismaClient()

async function login(req: Request, res: Response) {
  const error = { error: 'Usuário ou senha inválidos' }
  const { email, password } = req.body as {
    email: string | null
    password: string | null
  }

  if (!email || !password) return res.json(error)

  const user = await prisma.usuario.findUnique({
    where: {
      email,
    },
  })

  if (!user) return res.json(error)

  const isValidPassword = await bcrypt.compare(password, user.password)

  if (!isValidPassword) return res.json(error)

  const token = jwt.sign({ id: user.id }, process.env.SECRET as string)

  res.json({ token })
}

async function tokenGenerate(req: Request, res: Response) {
  const { email } = req.body

  const user = await prisma.usuario.findUnique({
    where: {
      email,
    },
  })

  if (!user) return res.json('Erro ao enviar email/ email naõ encontrado')

  const token = jwt.sign({ id: user.id }, process.env.SECRET as string)

  try {
    send(email, token)
    return res.json({
      message:
        'Se o e-mail informado estiver correto, você receberá nossa mensagem em instantes. Não se esqueça de verificar também sua caixa de spam.',
    })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: `Erro ao enviar email` })
  }
}

async function validateToken(req: Request, res: Response) {
  try {
    const { token } = req.params as { token: string }

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

    return res.json({ userId: user.id })
  } catch (error: any) {
    console.error('Erro de autenticação', error.message)
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido ou expirado' })
    }
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
}

router.post('/login', login)
router.post('/token-generate', tokenGenerate)
router.post('/validate-token/:token', validateToken)

export default router

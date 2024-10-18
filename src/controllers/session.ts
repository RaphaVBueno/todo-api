import jwt from 'jsonwebtoken'
import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

async function login(req: Request, res: Response) {
  const { email, password } = req.body as {
    email: string | null
    password: string | null
  }

  if (!email || !password)
    return res.json({ error: 'Usuário ou senha inválidos' })

  const user = await prisma.usuario.findUnique({
    where: {
      email,
      password,
    },
  })

  if (!user) return res.json({ error: 'Usuário ou senha inválidos' })

  const token = jwt.sing({ id: user.id }, process.env.SECRET as string)

  res.json({ token })
}

router.post('/loin', login)

export default router

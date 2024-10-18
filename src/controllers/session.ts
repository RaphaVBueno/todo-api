import jwt from 'jsonwebtoken'
import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

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

router.post('/login', login)

export default router

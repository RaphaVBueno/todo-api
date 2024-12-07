import express, { Request, Response } from 'express'
import { PrismaClient, Usuario } from '@prisma/client'
import bcrypt from 'bcrypt'
import { dateValidation, numberValidation } from 'src/validations'
import { auth, adminOnly } from 'src/middlewares'
import jwt from 'jsonwebtoken'

interface AuthenticatedRequest extends Request {
  context?: {
    user: any // tive q fazer isso depois da atualização
  }
}

const prisma = new PrismaClient()

export async function getUserList(_req: Request, res: Response) {
  const users = await prisma.usuario.findMany()
  res.json({ users })
}

export async function getUser(req: AuthenticatedRequest, res: Response) {
  const { id } = req.context?.user as Usuario

  const user = await prisma.usuario.findUnique({
    where: { id: Number(id) },
    select: {
      email: true,
      name: true,
      birthDate: true,
      username: true,
      role: true,
    },
  })
  res.json({ user })
}

export async function addUser(req: Request, res: Response) {
  const { name, email, password, birthDate, username } = req.body

  dateValidation(birthDate)

  const existingUser = await prisma.usuario.findUnique({
    where: { email },
  })
  if (existingUser) {
    return res.status(400).json({ message: 'e-mail já está em uso.' })
  }

  const existingUsername = await prisma.usuario.findUnique({
    where: { username },
  })
  if (existingUsername) {
    return res.status(400).json({ message: 'nome do usuário já está em uso.' })
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await prisma.usuario.create({
    data: {
      email,
      password: hashedPassword,
      name,
      birthDate: new Date(birthDate),
      username,
    },
  })
  res.json({ message: 'usuario adicionado com sucesso', user })
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.body

  numberValidation(id)

  const user = await prisma.usuario.delete({
    where: {
      id,
    },
  })
  res.json({ message: 'usuario deletado com sucesso', user })
}

export async function updateUser(req: AuthenticatedRequest, res: Response) {
  const { name, password, email, username } = req.body
  const { id } = req.context?.user as Usuario

  if (email) {
    const existingEmail = await prisma.usuario.findUnique({
      where: { email },
    })

    if (existingEmail && existingEmail.id !== id) {
      return res.status(400).json({ message: 'e-mail já está em uso.' })
    }
  }

  if (username) {
    const existingUsername = await prisma.usuario.findUnique({
      where: { username },
    })

    if (existingUsername && existingUsername.id !== id) {
      return res
        .status(400)
        .json({ message: 'nome do usuário já está em uso.' })
    }
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = password
    ? await bcrypt.hash(password, salt)
    : undefined

  const updatedData: any = { name }
  if (email) updatedData.email = email
  if (username) updatedData.username = username
  if (hashedPassword) updatedData.password = hashedPassword

  const user = await prisma.usuario.update({
    where: { id },
    data: updatedData,
  })

  res.json({ message: 'usuario atualizado com sucesso', user })
}

async function newPassword(req: Request, res: Response) {
  try {
    const { id, password, token } = req.body

    const decoded = jwt.verify(
      token,
      process.env.SECRET as string
    ) as jwt.JwtPayload & { id: number }

    if (!decoded.id) {
      return res.status(401).json({ error: 'acesso não autorizado' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const changePassword = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { password: hashedPassword },
    })

    return res.json({ message: 'Senha alterada com sucesso', changePassword })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

const router = express.Router()

router.get('/', auth, adminOnly, getUserList)

router.get('/me', auth, getUser)

router.post('/add', addUser)

router.delete('/', deleteUser)

router.put('/', auth, updateUser)

router.put('/new-password', newPassword)

export default router

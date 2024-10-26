import express, { Request, Response } from 'express'
import { PrismaClient, Usuario } from '@prisma/client'
import { findUserError, isNumber } from 'src/utils'
import bcrypt from 'bcrypt'
import { numberValidation } from 'src/validations'
import { auth } from 'src/middlewares'

const prisma = new PrismaClient()

export async function getUserList(req: Request, res: Response) {
  try {
    req
    const users = await prisma.usuario.findMany()
    res.json({ users })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: `erro na consulta de usuários` })
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    //const { id } = req.params as { id: string }
    const { id } = req.body.context.user as Usuario

    await findUserError(id)

    const user = await prisma.usuario.findUnique({
      where: { id: Number(id) },
      select: {
        email: true,
        name: true,
        birthDate: true,
        username: true,
      },
    })
    res.json({ user })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

export async function addUser(req: Request, res: Response) {
  try {
    const { name, email, password, birthDate, username } = req.body
    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({ message: 'e-mail já está em uso.' })
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
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.body
    isNumber(id)
    await findUserError(id)

    const user = await prisma.usuario.delete({
      where: {
        id,
      },
    })
    res.json({ message: 'usuario deletado com sucesso', user })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { name, password, id, email } = req.body
    isNumber(id)
    await findUserError(id)

    const user = await prisma.usuario.update({
      where: { id },
      data: {
        name,
        password,
        email,
      },
    })

    res.json({ message: 'usuario atualizado com sucesso', user })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

const router = express.Router()

router.get('/', getUserList)

router.get('/me', auth, getUser) // /me

router.post('/add', addUser)

router.delete('/', deleteUser)

router.put('/', updateUser)

export default router

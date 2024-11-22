import express, { Request, Response } from 'express'
import { PrismaClient, Usuario } from '@prisma/client'
import { errorTreatment, findUserError, isNumber } from 'src/utils'
import bcrypt from 'bcrypt'
import { dateValidation, numberValidation } from 'src/validations'
import { auth } from 'src/middlewares'
import { Prisma } from '@prisma/client'

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
      return res
        .status(400)
        .json({ message: 'nome do usuário já está em uso.' })
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
    const { name, password, email, username } = req.body
    const { id } = req.body.context.user as Usuario

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
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(errorTreatment[error.code].status).json({
        message: `${error.meta?.target} ${errorTreatment[error.code].message}`,
      })
    }
    console.error(error)
    res.status(error.cause || 500).json({ message: `${error.message}` })
  }
}

const router = express.Router()

router.get('/', getUserList)

router.get('/me', auth, getUser)

router.post('/add', addUser)

router.delete('/', deleteUser)

router.put('/', auth, updateUser)

export default router

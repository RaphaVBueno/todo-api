import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getUserList(req: Request, res: Response) {
  try {
    const users = await prisma.usuario.findMany()
    res.json({ users })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: `erro na consulta de usuários` })
  }
}
//parei aqui
export async function getUser(req: Request, res: Response) {
  const { id } = req.params as { id: string }
  const user = await prisma.usuario.findUnique({
    where: { id: Number(id) },
  })
  res.json({ user })
}

export async function addUser(req: Request, res: Response) {
  const { name, email, password } = req.body
  const user = await prisma.usuario.create({
    data: {
      email,
      password,
      name,
    },
  })
  res.json({ message: 'Usuario adicionado com sucesso', user })
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.body
  console.log(req.body)
  const user = await prisma.usuario.delete({
    where: {
      id,
    },
  })
  res.json({ message: 'Usuario deletado com sucesso', user })
}

export async function getUserLists(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10)
  const user = await prisma.usuario.findUnique({
    where: { id },
    include: { lists: true },
  })
  res.json({ userLists: user.lists })
}

export async function updateUser(req: Request, res: Response) {
  const { name, password, id, email } = req.body

  const user = await prisma.usuario.update({
    where: { id },
    data: {
      name,
      password,
      email,
    },
  })

  res.json({ message: 'Usuario atualizado com sucesso', user })
}

const router = express.Router()

router.get('/', getUserList)

router.get('/:id', getUser)

router.post('/add', addUser)

router.delete('/', deleteUser)

router.put('/', updateUser)

router.get('/:id/lists', getUserLists)

export default router

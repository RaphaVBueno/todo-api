import express, { Request, Response } from 'express'
import { PrismaClient, Usuario } from '@prisma/client'
import { numberValidation } from 'src/validations'
import { NotFoundError } from 'src/api.errors'

interface AuthenticatedRequest extends Request {
  context?: {
    user: any // tive q fazer isso depois da atualização
  }
}

const prisma = new PrismaClient()

export async function getUserList(req: AuthenticatedRequest, res: Response) {
  const { id } = req.context?.user as Usuario

  const categories = await prisma.list.findMany({
    where: { userId: Number(id) },
  })
  res.json({ categories })
}

export async function getList(req: AuthenticatedRequest, res: Response) {
  const { listId } = req.params as { listId: string }
  const { id } = req.context?.user as Usuario

  numberValidation(listId)

  const category = await prisma.list.findUnique({
    where: {
      id: Number(listId),
      userId: id,
    },
  })
  if (!category) {
    throw new NotFoundError('categoria não encontrada')
  }
  res.json({ category })
}

export async function addList(req: AuthenticatedRequest, res: Response) {
  const { listName, color } = req.body
  const { id } = req.context?.user as Usuario

  const category = await prisma.list.create({
    data: {
      name: listName,
      color: color ? color : '#7E7E7E',
      user: {
        connect: { id: Number(id) },
      },
    },
  })
  res.json({ message: 'categoria adicionada com sucesso', category })
}

export async function updateList(req: AuthenticatedRequest, res: Response) {
  const { name, listId, color } = req.body
  const { id } = req.context?.user as Usuario

  numberValidation(listId)

  const category = await prisma.list.update({
    where: {
      id: Number(listId),
      userId: id,
    },
    data: {
      name,
      color: color ? color : '#7E7E7E',
    },
  })
  res.json({ message: 'categoria editada com sucesso', category })
}

export async function deleteList(req: AuthenticatedRequest, res: Response) {
  const { listId } = req.params as { listId: string }
  const { id } = req.context?.user as Usuario

  numberValidation(listId)

  const category = await prisma.list.delete({
    where: {
      id: Number(listId),
      userId: id,
    },
  })
  res.json({ message: 'categoria deletada com sucesso', category })
}

const router = express.Router()

router.get('/userList/:userId', getUserList)

router.get('/:listId', getList)

router.post('/add', addList)

router.put('/edit', updateList)

router.delete('/:listId', deleteList)

export default router

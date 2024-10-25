import express, { Request, Response } from 'express'
import { PrismaClient, Usuario } from '@prisma/client'
import { findListError, isNumber } from '../utils'
import { numberValidation } from 'src/validations'

const prisma = new PrismaClient()

export async function getUserList(req: Request, res: Response) {
  try {
    const { id } = req.body.context.user as Usuario

    const categories = await prisma.list.findMany({
      where: { userId: Number(id) },
    })
    res.json({ categories })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

export async function getList(req: Request, res: Response) {
  try {
    const { listId } = req.params as { listId: string }
    const { id } = req.body.context.user as Usuario

    numberValidation.parse(listId)

    const category = await prisma.list.findUnique({
      where: {
        id: Number(listId),
        userId: id,
      },
    })
    if (!category) {
      return res.status(404).json({ message: 'categoria não encontrada' })
    }
    res.json({ category })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

export async function addList(req: Request, res: Response) {
  try {
    const { listName, color } = req.body
    const { id } = req.body.context.user as Usuario

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
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

export async function updateList(req: Request, res: Response) {
  try {
    const { name, listId, color } = req.body
    const { id } = req.body.context.user as Usuario

    numberValidation.parse(listId)
    await findListError(listId)

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
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

export async function deleteList(req: Request, res: Response) {
  try {
    const { listId } = req.params as { listId: string }
    const { id } = req.body.context.user as Usuario

    isNumber(listId)
    await findListError(listId)

    const category = await prisma.list.delete({
      where: {
        id: Number(listId),
        userId: id,
      },
    })
    res.json({ message: 'Categoria deletada com sucesso', category })
  } catch (error: any) {
    console.error('Erro na função getTaskList:', error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

const router = express.Router()

router.get('/userList/:userId', getUserList)

router.get('/:id', getList)

router.post('/add', addList)

router.put('/edit', updateList)

router.delete('/:listId', deleteList)

export default router

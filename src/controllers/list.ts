import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import {
  findListError,
  findTaskError,
  findUserError,
  isNumber,
} from '../utils.js'

const prisma = new PrismaClient()

export async function getUserList(req: Request, res: Response) {
  try {
    const { userId } = req.params as { userId: string }
    isNumber(userId)
    await findUserError(userId)

    const categories = await prisma.list.findMany({
      where: { userId: Number(userId) },
    })
    res.json({ categories })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

export async function getList(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string }
    isNumber(id)
    const category = await prisma.list.findUnique({
      where: {
        id: Number(id),
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
    const { listName, userId } = req.body
    isNumber(userId)
    await findUserError(userId)

    const category = await prisma.list.create({
      data: {
        name: listName,
        user: {
          connect: { id: Number(userId) },
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
    const { name, id, userId } = req.body
    isNumber(id)
    isNumber(userId)
    await findUserError(userId)
    await findListError(id)

    const category = await prisma.list.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
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
    const { id, userId } = req.query as { id: string; userId: string }
    isNumber(id)
    isNumber(userId)
    await findUserError(userId)
    await findListError(id)

    const category = await prisma.list.delete({
      where: {
        id: Number(id),
      },
    })
    res.json({ message: 'Categoria deletada com sucesso', category })
  } catch (error: any) {
    console.error('Erro na função getTaskList:', error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

export async function addToList(req: Request, res: Response) {
  try {
    const { id, listId } = req.body
    isNumber(id)
    isNumber(listId)
    await findTaskError(id)
    await findListError(listId)

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { listId: Number(listId) },
    })

    return res.json({ message: 'lista Adicionada com sucesso', updatedTask })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `${error}` })
  }
}

export async function RemoveList(req: Request, res: Response) {
  try {
    const { id } = req.body
    isNumber(id)
    await findTaskError(id)
    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { listId: null },
    })

    return res.json({ message: 'categoria removida com sucesso', updatedTask })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `${error}` })
  }
}

const router = express.Router()

router.get('/userList/:userId', getUserList)

router.get('/:id', getList)

router.post('/add', addList)

router.put('/edit', updateList)

router.delete('/:id', deleteList)

router.post('/addtolist', addToList)

router.post('/removelist', RemoveList)

export default router

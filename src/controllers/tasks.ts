import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { findTaskError, findUserError, isNumber } from '../utils.js'

const prisma = new PrismaClient()
const router = express.Router()

export async function getTaskList(req: Request, res: Response) {
  try {
    const { userId, date } = req.query as { userId: string; date: string }

    isNumber(userId)
    await findUserError(userId)

    const tasks = await prisma.task.findMany({
      where: {
        date: new Date(date),
        userId: Number(userId),
      },
      include: { tags: true },
    })

    res.json({ tasks })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

export async function getTask(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string }
    isNumber(id)

    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
      include: { tags: true },
    })
    if (!task) {
      return res.status(404).json({ message: 'tarefa não encontrada' })
    }
    res.json({ task })
  } catch (error) {
    console.error('Erro na função getTask:', error)
    res.status(500).json({ message: `${error}` })
  }
}

export async function addTask(req: Request, res: Response) {
  try {
    const { title, date, userId } = req.body

    isNumber(userId)
    await findUserError(userId)

    const task = await prisma.task.create({
      data: {
        title,
        status: false,
        date: new Date(date),
        userId: Number(userId),
      },
    })
    res.json({ message: 'Tarefa adicionada com sucesso', task })
  } catch (error) {
    console.error('Erro na função addTask:', error)
    res.status(500).json({ message: `${error}` })
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    const { userId, id } = req.query as { userId: string; id: string }

    isNumber(userId)
    isNumber(id)
    await findUserError(userId)
    await findTaskError(id)

    const deleteTask = await prisma.task.delete({
      where: {
        id: Number(id),
      },
    })

    return res.json({ message: 'tarefa deletada com sucesso', deleteTask })
  } catch (error) {
    console.error('erro na função deleteTask:', error)
    res.status(500).json({ message: `${error}` })
  }
}

export async function updateTaskStatus(req: Request, res: Response) {
  try {
    const { id, status, description, title, userId } = req.body

    isNumber(id)
    isNumber(userId)
    await findUserError(userId) //acho q isso é necessário
    await findTaskError(id)

    const task = await prisma.task.update({
      where: {
        id: Number(id),
      },
      data: {
        status,
        description,
        title,
      },
    })
    res.json({ message: 'Tarefa atualizada com sucesso', task })
  } catch (error) {
    console.error('Erro na função updateTaskStatus:', error)
    res.status(500).json({ message: `${error}` })
  }
}

router.get('/', getTaskList)

router.get('/:id', getTask)

router.post('/add', addTask)

router.delete('/:id', deleteTask)

router.post('/:id/update', updateTaskStatus)

export default router

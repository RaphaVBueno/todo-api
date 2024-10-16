import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import {
  findTaskError,
  findUserError,
  isNumber,
  isValidDate,
  timeZone,
} from '../utils'
import { toZonedTime } from 'date-fns-tz'

const prisma = new PrismaClient()
const router = express.Router()

export async function getTaskList(req: Request, res: Response) {
  try {
    const { userId, dueDate } = req.query as { userId: string; dueDate: string }

    isNumber(userId)
    await findUserError(userId)
    isValidDate(dueDate)

    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { dueDate: { lte: new Date(dueDate) }, status: false },
          { completedDate: new Date(dueDate), status: true },
        ],
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

export async function searchTask(req: Request, res: Response) {
  try {
    const { search } = req.params as { search: string }

    const tasks = await prisma.task.findMany({
      where: {
        title: {
          contains: search, // Busca parte do título
          mode: 'insensitive', // Ignora a diferença entre maiúsculas e minúsculas
        },
      },
    })

    return res.json({ tasks })
  } catch (error) {
    console.error('erro ao buscar tarefa:', error)
    res.status(500).json('não foi possível encontrar a tarefa.')
  }
}

export async function addTask(req: Request, res: Response) {
  try {
    const { title, dueDate, userId, listId, tagId, description } = req.body

    isNumber(userId)
    await findUserError(userId)
    isValidDate(dueDate)

    const task = await prisma.task.create({
      data: {
        title,
        status: false,
        dueDate: dueDate && toZonedTime(new Date(dueDate), timeZone),
        userId: Number(userId),
        description,
        listId,
        ...(tagId && {
          tags: {
            connect: { id: Number(tagId) },
          },
        }),
      },
    })
    res.json({ message: 'Tarefa adicionada com sucesso', task })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
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
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

export async function updateTask(req: Request, res: Response) {
  try {
    const {
      id,
      status,
      description,
      title,
      userId,
      dueDate,
      completedDate,
      listId,
      tagId,
    } = req.body

    isNumber(id)
    isNumber(userId)
    await findUserError(userId)

    const task = await prisma.task.update({
      where: {
        id: Number(id),
      },
      data: {
        status,
        description,
        title,
        completedDate:
          status && !completedDate
            ? new Date()
            : completedDate
            ? new Date(completedDate)
            : null,
        dueDate: dueDate ? toZonedTime(new Date(dueDate), timeZone) : undefined,
        listId: listId ? Number(listId) : null,
        tags:
          tagId === 9999999
            ? { set: [] }
            : tagId
            ? { connect: { id: Number(tagId) } }
            : undefined,
      },
    })

    res.json({ message: 'Tarefa atualizada com sucesso', task })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

export async function updateTaskStatus(req: Request, res: Response) {
  try {
    const { id, status, completedDate, userId } = req.body

    isNumber(id)
    isNumber(userId)
    await findUserError(userId)

    const task = await prisma.task.update({
      where: {
        id: Number(id),
      },
      data: {
        status,
        completedDate:
          status && !completedDate
            ? new Date()
            : completedDate
            ? new Date(completedDate)
            : null,
      },
    })
    res.json({ message: 'Tarefa atualizada com sucesso', task })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

router.get('/', getTaskList)

router.get('/:id', getTask)

router.get('/busca/:search', searchTask)

router.post('/add', addTask)

router.delete('/:id', deleteTask)

router.post('/:id/update', updateTask)

router.post('/:id/status', updateTaskStatus)

export default router

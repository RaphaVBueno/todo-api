import express, { Request, Response } from 'express'
import { PrismaClient, Usuario } from '@prisma/client'
import { isNumber, isValidDate, timeZone } from '../utils'
import { toZonedTime } from 'date-fns-tz'

const prisma = new PrismaClient()
const router = express.Router()

export async function getTaskList(req: Request, res: Response) {
  try {
    const { dueDate } = req.query as { userId: string; dueDate: string }
    const { id } = req.body.context.user as Usuario

    isValidDate(dueDate)

    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { dueDate: { lte: new Date(dueDate) }, status: false },
          { completedDate: new Date(dueDate), status: true },
        ],
        userId: id,
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
    const { taskId } = req.params as { taskId: string }
    isNumber(taskId)
    const { id } = req.body.context.user as Usuario

    const task = await prisma.task.findUnique({
      where: {
        id: Number(taskId),
        userId: id,
      },
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
    const { id } = req.body.context.user as Usuario

    const tasks = await prisma.task.findMany({
      where: {
        title: {
          contains: search,
          mode: 'insensitive',
        },
        userId: id,
      },
    })

    return res.json({ tasks })
  } catch (error) {
    console.error('erro ao buscar tarefa:', error)
    res.status(500).json({ message: 'não foi possível encontrar a tarefa.' })
  }
}

export async function addTask(req: Request, res: Response) {
  try {
    const { title, dueDate, listId, tagId, description } = req.body
    const { id } = req.body.context.user as Usuario

    isValidDate(dueDate)

    const task = await prisma.task.create({
      data: {
        title,
        status: false,
        dueDate: dueDate && toZonedTime(new Date(dueDate), timeZone),
        userId: Number(id),
        description,
        listId,
        ...(tagId && {
          tags: {
            connect: { id: Number(tagId) },
          },
        }),
      },
    })
    res.json({ message: 'tarefa adicionada com sucesso', task })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    const { taskId } = req.params as { taskId: string }
    const { id } = req.body.context.user as Usuario

    isNumber(taskId)

    const deletedTask = await prisma.task.delete({
      where: {
        id: Number(taskId),
        userId: id,
      },
    })

    return res.json({ message: 'Tarefa deletada com sucesso', deletedTask })
  } catch (error: any) {
    if (error.code === 'P2025') {
      // Verifica se o erro é de não encontrar a tarefa
      return res.status(404).json({ message: 'tarefa não encontrada' })
    }
    console.error(error)
    res.status(error.cause || 500).json({ message: `${error.message}` })
  }
}

export async function updateTask(req: Request, res: Response) {
  try {
    const {
      taskId,
      status,
      description,
      title,
      dueDate,
      completedDate,
      listId,
      tagId,
    } = req.body

    const { id } = req.body.context.user as Usuario

    const task = await prisma.task.update({
      where: {
        id: Number(taskId),
        userId: Number(id),
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

    res.json({ message: 'tarefa atualizada com sucesso', task })
  } catch (error: any) {
    if (error.code === 'P2025') {
      // Verifica se o erro é de não encontrar a tarefa
      return res.status(404).json({ message: 'tarefa não encontrada' })
    }
    console.error(error)
    res.status(error.cause || 500).json({ message: `${error.message}` })
  }
}

export async function updateTaskStatus(req: Request, res: Response) {
  try {
    const { taskId, status, completedDate } = req.body
    const { id } = req.body.context.user as Usuario

    isNumber(taskId)

    const task = await prisma.task.update({
      where: {
        id: Number(taskId),
        userId: Number(id),
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
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'tarefa não encontrada' })
    }
    console.error(error)
    res.status(error.cause || 500).json({ message: `${error.message}` })
  }
}

router.get('/', getTaskList)

router.get('/:taskId', getTask)

router.get('/busca/:search', searchTask)

router.post('/add', addTask)

router.delete('/:taskId', deleteTask)

router.post('/:id/update', updateTask)

router.post('/:id/status', updateTaskStatus)

export default router

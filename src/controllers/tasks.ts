import express, { Request, Response } from 'express'
import { PrismaClient, Usuario } from '@prisma/client'
import { timeZone } from '../utils'
import { toZonedTime } from 'date-fns-tz'
import {
  completedDateValidation,
  dateValidation,
  numberValidation,
} from 'src/validations'

import { NotFoundError } from 'src/api.errors'

interface AuthenticatedRequest extends Request {
  context?: {
    user: any // tive q fazer isso depois da atualização
  }
}

const prisma = new PrismaClient()
const router = express.Router()

export async function getTaskList(req: AuthenticatedRequest, res: Response) {
  const { dueDate } = req.query as { userId: string; dueDate: string }
  const { id } = req.context?.user as Usuario

  dateValidation(dueDate)

  const tasks = await prisma.task.findMany({
    where: {
      OR: [
        { dueDate: { lte: new Date(dueDate) }, status: false },
        { completedDate: new Date(dueDate), status: true },
      ],
      userId: id,
    },
    include: { tags: true, list: true },
  })

  res.json({ tasks })
}

export async function getTask(req: AuthenticatedRequest, res: Response) {
  const { taskId } = req.params as { taskId: string }
  const { id } = req.context?.user as Usuario

  numberValidation(taskId)

  const task = await prisma.task.findUnique({
    where: {
      id: Number(taskId),
      userId: id,
    },
    include: { tags: true },
  })

  if (!task) {
    throw new NotFoundError('tarefa não encontrada')
  }

  res.json({ task })
}

export async function searchTask(req: AuthenticatedRequest, res: Response) {
  const { search } = req.params as { search: string }
  const { id } = req.context?.user as Usuario

  const tasks = await prisma.task.findMany({
    where: {
      title: {
        contains: search,
        mode: 'insensitive',
      },
      userId: id,
    },
    include: { tags: true, list: true },
  })

  return res.json({ tasks })
}

export async function addTask(req: AuthenticatedRequest, res: Response) {
  const { title, dueDate, listId, tagId, description } = req.body
  const { id } = req.context?.user as Usuario

  dateValidation(dueDate)
  numberValidation(listId)
  //numberValidation(tagId) //verificar como validar um array de numeros

  const taskData: any = {
    title,
    status: false,
    dueDate: dueDate && toZonedTime(new Date(dueDate), timeZone),
    userId: Number(id),
    description,
    listId: listId ? Number(listId) : undefined,
  }

  if (tagId) {
    if (Array.isArray(tagId)) {
      taskData.tags = {
        connect: tagId.map((id: number) => ({ id: Number(id) })),
      }
    } else {
      taskData.tags = {
        connect: [{ id: Number(tagId) }],
      }
    }
  }

  const task = await prisma.task.create({
    data: taskData,
  })

  res.json({ message: 'Tarefa adicionada com sucesso', task })
}

export async function deleteTask(req: AuthenticatedRequest, res: Response) {
  const { taskId } = req.params as { taskId: string }
  const { id } = req.context?.user as Usuario

  numberValidation(taskId)

  const deletedTask = await prisma.task.delete({
    where: {
      id: Number(taskId),
      userId: id,
    },
  })

  return res.json({ message: 'tarefa deletada com sucesso', deletedTask })
}

export async function updateTask(req: AuthenticatedRequest, res: Response) {
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
  const { id } = req.context?.user as Usuario

  numberValidation(taskId)
  numberValidation(listId)
  //numberValidation.parse(tagId)
  dateValidation(dueDate)
  completedDateValidation(completedDate)

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
      tags: Array.isArray(tagId)
        ? { set: tagId.map((id: number) => ({ id: Number(id) })) }
        : undefined,
    },
  })

  res.json({ message: 'tarefa atualizada com sucesso', task })
}

export async function updateTaskStatus(
  req: AuthenticatedRequest,
  res: Response
) {
  const { taskId, status, completedDate } = req.body
  const { id } = req.context?.user as Usuario

  numberValidation(taskId)
  completedDateValidation(completedDate)

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
}

router.get('/', getTaskList)

router.get('/:taskId', getTask)

router.get('/busca/:search', searchTask)

router.post('/add', addTask)

router.delete('/:taskId', deleteTask)

router.post('/:id/update', updateTask)

router.post('/:id/status', updateTaskStatus)

export default router

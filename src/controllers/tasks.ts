import express, { Request, Response } from 'express'
import { PrismaClient, Usuario } from '@prisma/client'
import { findTaskError, timeZone } from '../utils'
import { toZonedTime } from 'date-fns-tz'
import {
  completedDateValidation,
  dateValidation,
  numberValidation,
} from 'src/validations'

import { BadRequestError, NotFoundError } from 'src/api.errors'

const prisma = new PrismaClient()
const router = express.Router()

export async function getTaskList(req: Request, res: Response) {
  const { dueDate } = req.query as { userId: string; dueDate: string }
  const { id } = req.body.context.user as Usuario

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

export async function getTask(req: Request, res: Response) {
  const { taskId } = req.params as { taskId: string }
  const { id } = req.body.context.user as Usuario

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

export async function searchTask(req: Request, res: Response) {
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
    include: { tags: true, list: true },
  })

  return res.json({ tasks })
}

export async function addTask(req: Request, res: Response) {
  const { title, dueDate, listId, tagId, description } = req.body
  const { id } = req.body.context.user as Usuario

  dateValidation(dueDate)
  numberValidation(listId)
  //numberValidation(tagId) //verificar como validar um array de numeros
  try {
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
  } catch (error) {
    console.error(error)
    throw new BadRequestError('Erro ao adicionar tarefa')
  }
}

export async function deleteTask(req: Request, res: Response) {
  const { taskId } = req.params as { taskId: string }
  const { id } = req.body.context.user as Usuario

  numberValidation(taskId)
  try {
    const deletedTask = await prisma.task.delete({
      where: {
        id: Number(taskId),
        userId: id,
      },
    })

    return res.json({ message: 'tarefa deletada com sucesso', deletedTask })
  } catch (error: any) {
    throw new NotFoundError('tarefa não encontrada')
  }
}

export async function updateTask(req: Request, res: Response) {
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

  numberValidation(taskId)
  numberValidation(listId)
  //numberValidation.parse(tagId)
  dateValidation(dueDate)
  completedDateValidation(completedDate)
  findTaskError(taskId)

  try {
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
  } catch (error: any) {
    throw new BadRequestError('erro ao atualizar tarefa')
  }
}

export async function updateTaskStatus(req: Request, res: Response) {
  const { taskId, status, completedDate } = req.body
  const { id } = req.body.context.user as Usuario

  numberValidation(taskId)
  completedDateValidation(completedDate)

  try {
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
    throw new BadRequestError('erro ao atualizar status da tarefa')
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

import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import {
  findTagError,
  findTaskError,
  findUserError,
  isNumber,
} from '../utils.js'

const prisma = new PrismaClient()

async function getTagList(req: Request, res: Response) {
  try {
    const { userId } = req.params as { userId: string }
    isNumber(userId)
    await findUserError(userId)

    const tags = await prisma.tag.findMany({
      where: { userId: Number(userId) },
    })
    res.json({ tags })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

async function getTag(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string }
    isNumber(id)
    await findTagError(id)

    const tag = await prisma.tag.findUnique({
      where: {
        id: Number(id),
      },
    })
    res.json({ tag })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

async function addTag(req: Request, res: Response) {
  try {
    const { name, userId } = req.body
    isNumber(userId)
    await findUserError(userId)

    const tag = await prisma.tag.create({
      data: {
        name,
        userId: Number(userId),
      },
    })
    res.json({ message: 'tag adicionada com sucesso', tag })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

async function updateTag(req: Request, res: Response) {
  try {
    const { name, id } = req.body
    isNumber(id)
    await findTagError(id)

    const tag = await prisma.tag.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
      },
    })
    res.json({ message: 'tag editada com sucesso', tag })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

async function deleteTag(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string }
    isNumber(id)
    await findTagError(id)

    const tag = await prisma.tag.delete({
      where: {
        id: Number(id),
      },
    })
    res.json({ message: 'tag deletada com sucesso', tag })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

async function addToTag(req: Request, res: Response) {
  try {
    const { taskId, tagId } = req.body
    await findTaskError(taskId)
    await findTagError(tagId)

    const updatedTask = await prisma.task.update({
      where: { id: Number(taskId) },
      data: {
        tags: {
          connect: { id: Number(tagId) },
        },
      },
    })
    return res.json({
      message: 'tag adicionada à tarefa com sucesso',
      updatedTask,
    })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

async function removeTag(req: Request, res: Response) {
  try {
    const { taskId, tagId } = req.body
    await findTaskError(taskId)
    await findTagError(tagId)

    const updatedTask = await prisma.task.update({
      where: { id: Number(taskId) },
      data: {
        tags: {
          disconnect: { id: Number(tagId) },
        },
      },
    })
    return res.json({
      message: 'tag removida da tarefa com sucesso',
      updatedTask,
    })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

const router = express.Router()

router.get('/usertaglist/:userId', getTagList)

router.get('/:id', getTag)

router.post('/add', addTag)

router.put('/edit', updateTag)

router.delete('/:id', deleteTag)

router.post('/addtotag', addToTag)

router.post('/removetag', removeTag)

export default router

import express, { Request, Response } from 'express'
import { PrismaClient, Usuario } from '@prisma/client'
import { findTagError, findUserError } from '../utils'
import { numberValidation } from 'src/validations'

const prisma = new PrismaClient()

async function getUserTagList(req: Request, res: Response) {
  try {
    const { id } = req.body.context.user as Usuario

    const tags = await prisma.tag.findMany({
      where: { userId: Number(id) },
    })
    res.json({ tags })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

async function getTag(req: Request, res: Response) {
  try {
    const { tagId } = req.params as { tagId: string }
    const { id } = req.body.context.user as Usuario

    numberValidation.parse(tagId)
    findTagError(tagId)

    const tag = await prisma.tag.findUnique({
      where: {
        id: Number(tagId),
        userId: id,
      },
    })
    if (!tag) {
      return res.status(404).json({ message: 'tag não encontrada' })
    }

    res.json({ tag })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

async function addTag(req: Request, res: Response) {
  try {
    const { name } = req.body
    const { id } = req.body.context.user as Usuario

    const tag = await prisma.tag.create({
      data: {
        name,
        userId: Number(id),
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
    const { name, tagId } = req.body
    const { id } = req.body.context.user as Usuario

    numberValidation.parse(tagId)
    findTagError(tagId)

    const tag = await prisma.tag.update({
      where: {
        id: Number(tagId),
        userId: id,
      },
      data: {
        name,
      },
    })
    if (!tag) {
      return res.status(404).json({ message: 'tag não encontrada' })
    }

    res.json({ message: 'tag editada com sucesso', tag })
  } catch (error: any) {
    console.error(error)
    res.status(error.cause).json({ message: `${error.message}` })
  }
}

async function deleteTag(req: Request, res: Response) {
  try {
    const { tagId } = req.params as { tagId: string }
    const { id } = req.body.context.user as Usuario

    numberValidation.parse(tagId)
    findTagError(tagId)

    const tag = await prisma.tag.delete({
      where: {
        id: Number(tagId),
        userId: id,
      },
    })

    res.json({ message: 'tag deletada com sucesso', tag })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'tag não encontrada' })
    }
    console.error(error)
    res.status(error.cause || 500).json({ message: `${error.message}` })
  }
}

const router = express.Router()

router.get('/usertaglist/:userId', getUserTagList)

router.get('/:tagId', getTag)

router.post('/add', addTag)

router.put('/edit', updateTag)

router.delete('/:tagId', deleteTag)

export default router

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

async function getUserTagList(req: AuthenticatedRequest, res: Response) {
  const { id } = req.context?.user as Usuario

  const tags = await prisma.tag.findMany({
    where: { userId: Number(id) },
  })
  res.json({ tags })
}

async function getTag(req: AuthenticatedRequest, res: Response) {
  const { tagId } = req.params as { tagId: string }
  const { id } = req.context?.user as Usuario

  numberValidation(tagId)

  const tag = await prisma.tag.findUnique({
    where: {
      id: Number(tagId),
      userId: id,
    },
  })
  if (!tag) {
    throw new NotFoundError('tag não encontrada')
  }

  res.json({ tag })
}

async function addTag(req: AuthenticatedRequest, res: Response) {
  const { name } = req.body
  const { id } = req.context?.user as Usuario

  const tag = await prisma.tag.create({
    data: {
      name,
      userId: Number(id),
    },
  })
  res.json({ message: 'tag adicionada com sucesso', tag })
}

async function updateTag(req: AuthenticatedRequest, res: Response) {
  const { name, tagId } = req.body
  const { id } = req.context?.user as Usuario

  numberValidation(tagId)

  const tag = await prisma.tag.update({
    where: {
      id: Number(tagId),
      userId: id,
    },
    data: {
      name,
    },
  })

  res.json({ message: 'tag editada com sucesso', tag })
}

async function deleteTag(req: AuthenticatedRequest, res: Response) {
  const { tagId } = req.params as { tagId: string }
  const { id } = req.context?.user as Usuario

  numberValidation(tagId)

  const tag = await prisma.tag.delete({
    where: {
      id: Number(tagId),
      userId: id,
    },
  })

  res.json({ message: 'tag deletada com sucesso', tag })
}

const router = express.Router()

router.get('/usertaglist/:userId', getUserTagList)

router.get('/:tagId', getTag)

router.post('/add', addTag)

router.put('/edit', updateTag)

router.delete('/:tagId', deleteTag)

export default router

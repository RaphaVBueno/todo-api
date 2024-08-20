import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addTag(req, res) {
  const { name, userId } = req.body
  const tag = await prisma.tag.create({
    data: {
      name,
      userId,
    },
  })
  res.json({ message: 'Tag adicionada com sucesso', tag })
}

async function updateTag(req, res) {
  const { id } = req.params
  const idAsInt = parseInt(id, 10)
  const { name } = req.body
  const tag = await prisma.tag.update({
    where: {
      id: idAsInt,
    },
    data: {
      name,
    },
  })
  res.json({ message: 'Tag editada com sucesso', tag })
}

async function deleteTag(req, res) {
  const { id } = req.params
  const idAsInt = parseInt(id, 10)
  const tag = await prisma.tag.delete({
    where: {
      id: idAsInt,
    },
  })
  res.json({ message: 'Tag deletada com sucesso', tag })
}

async function getTagList(req, res) {
  const tags = await prisma.tag.findMany()
  res.json({ tags })
}

async function getTag(req, res) {
  const { id } = req.params
  const idAsInt = parseInt(id, 10)
  const tag = await prisma.tag.findUnique({
    where: {
      id: idAsInt,
    },
  })
  res.json({ tag })
}

async function addToTag(req, res) {
  const { taskId, tagId } = req.body
  const updatedTask = await prisma.task.update({
    where: { id: Number(taskId) },
    data: {
      tags: {
        connect: { id: Number(tagId) },
      },
    },
  })
  return res.json({
    message: 'Tag adicionada à tarefa com sucesso',
    updatedTask,
  })
}

async function removeTag(req, res) {
  const { taskId, tagId } = req.body
  const updatedTask = await prisma.task.update({
    where: { id: Number(taskId) },
    data: {
      tags: {
        disconnect: { id: Number(tagId) },
      },
    },
  })
  return res.json({
    message: 'Tag removida da tarefa com sucesso',
    updatedTask,
  })
}

const router = express.Router()

router.get('/', getTagList)

router.get('/:id', getTag)

router.post('/add', addTag)

router.put('/:id/edit', updateTag)

router.delete('/:id', deleteTag)

router.post('/addtotag', addToTag)

router.post('/removetag', removeTag)

export default router

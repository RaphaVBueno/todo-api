import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

async function addTag(req, res) {
  const { name } = req.body
  const tag = await prisma.tag.create({
    data: {
      name,
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

router.post('/add', addTag)

router.put('/:id/edit', updateTag)

router.delete('/:id', deleteTag)

export default router

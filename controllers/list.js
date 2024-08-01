import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addList(req, res) {
  const { name } = req.body
  const category = await prisma.categoria.create({
    data: {
      name,
    },
  })
  res.json({ message: 'Categoria adicionada com sucesso', category })
}

async function updateList(req, res) {
  const { id } = req.params
  const idAsInt = parseInt(id, 10)
  const { name } = req.body
  const category = await prisma.categoria.update({
    where: {
      id: idAsInt,
    },
    data: {
      name,
    },
  })
  res.json({ message: 'Categoria editada com sucesso', category })
}

async function deleteList(req, res) {
  const { id } = req.params
  const idAsInt = parseInt(id, 10)
  const category = await prisma.categoria.delete({
    where: {
      id: idAsInt,
    },
  })
  res.json({ message: 'Categoria deletada com sucesso', category })
}

const router = express.Router()

router.post('/add', addList)

router.put('/:id/edit', updateList)

router.delete('/:id', deleteList)

export default router

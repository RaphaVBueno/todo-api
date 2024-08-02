import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addList(req, res) {
  const { name } = req.body
  const category = await prisma.list.create({
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
  const category = await prisma.list.update({
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
  const category = await prisma.list.delete({
    where: {
      id: idAsInt,
    },
  })
  res.json({ message: 'Categoria deletada com sucesso', category })
}

async function getListList(req, res) {
  const categories = await prisma.list.findMany()
  res.json({ categories })
}

async function getList(req, res) {
  const { id } = req.params
  const idAsInt = parseInt(id, 10)
  const category = await prisma.list.findUnique({
    where: {
      id: idAsInt,
    },
  })
  res.json({ category })
}

const router = express.Router()

router.get('/', getListList)

router.get('/:id', getList)

router.post('/add', addList)

router.put('/:id/edit', updateList)

router.delete('/:id', deleteList)

export default router

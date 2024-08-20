import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addList(req, res) {
  const { listName, userId } = req.body
  const id = parseInt(userId, 10)
  const category = await prisma.list.create({
    data: {
      name: listName,
      user: {
        connect: { id: id },
      },
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

async function addToList(req, res) {
  const { id, listId } = req.body
  const updatedTask = await prisma.task.update({
    where: { id: Number(id) },
    data: { listId: Number(listId) },
  })

  return res.json({ message: 'Lista Adicionada com sucesso', updatedTask })
}

async function RemoveList(req, res) {
  const { id } = req.body
  const updatedTask = await prisma.task.update({
    where: { id: Number(id) },
    data: { listId: null },
  })

  return res.json({ message: 'Categoria removida com sucesso', updatedTask })
}

const router = express.Router()

router.get('/', getListList)

router.get('/:id', getList)

router.post('/add', addList)

router.put('/:id/edit', updateList)

router.delete('/:id', deleteList)

router.post('/addtolist', addToList)

router.post('/removelist', RemoveList)

export default router

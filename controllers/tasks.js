import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getTaskList(req, res) {
  const tasks = await prisma.task.findMany({
    where: {
      date: new Date(req.query.date),
    },
  })
  res.json({ tasks })
}

async function getTask(req, res) {
  const idAsInt = parseInt(req.params.id, 10)
  const task = await prisma.task.findUnique({
    where: { id: idAsInt },
  })
  res.json({ task })
}

async function addTask(req, res) {
  const { title, date, userId } = req.body
  const task = await prisma.task.create({
    data: {
      title,
      status: false,
      date: new Date(date),
      userId,
    },
  })
  res.json({ message: 'Tarefa adicionada com sucesso', task })
}

async function deleteTask(req, res) {
  const idAsInt = parseInt(req.params.id, 10)
  await prisma.task.delete({
    where: {
      id: idAsInt,
    },
  })
  res.json({ message: 'Tarefa deletada com sucesso' })
}

async function updateTask(req, res) {
  const { id, status, description } = req.body
  const idAsInt = parseInt(id, 10)

  const data = {}
  if (status !== undefined) {
    data.status = status
  }
  if (description !== undefined) {
    data.description = description
  }

  const task = await prisma.task.update({
    where: {
      id: idAsInt,
    },
    data: data,
  })

  res.json({ message: 'Tarefa atualizada com sucesso', task })
}

const router = express.Router()

router.get('/', getTaskList)

router.get('/:id', getTask)

router.post('/add', addTask)

router.delete('/:id', deleteTask)

router.post('/:id/update', updateTask)

export default router

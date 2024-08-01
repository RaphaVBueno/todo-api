import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

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
  const { title, date, user } = req.body
  const task = await prisma.task.create({
    data: {
      title,
      status: false,
      date: new Date(date),
      userEmail: user,
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

async function updateTaskStatus(req, res) {
  const { id, status } = req.body
  const idAsInt = parseInt(id, 10)
  const task = await prisma.task.update({
    where: {
      id: idAsInt,
    },
    data: {
      status: status,
    },
  })
  res.json({ message: 'Status da tarefa atualizado com sucesso', task })
}

async function updateDescription(req, res) {
  const { id, description } = req.body
  const idAsInt = parseInt(id, 10)
  const task = await prisma.task.update({
    where: {
      id: idAsInt,
    },
    data: {
      description: description,
    },
  })
  res.json({ message: 'Descrição da tarefa atualizada com sucesso', task })
}

router.get('/', getTaskList)

router.get('/:id', getTask)

router.post('/add', addTask)

router.delete('/:id', deleteTask)

router.post('/:id/status', updateTaskStatus)

router.post('/:id/update-description', updateDescription)

export default router

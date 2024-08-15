import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

async function getTaskList(req, res) {
  const { userId, date } = req.query
  const tasks = await prisma.task.findMany({
    where: {
      date: new Date(date),
      userId: Number(userId),
    },
  })

  res.json({ tasks })
}

async function getTask(req, res) {
  const task = await prisma.task.findUnique({
    where: { id: Number(req.params.id) },
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
  //não seria necessário verificar o userId antes de deletar
  const { userId, id } = req.query
  await prisma.task.delete({
    where: {
      id: Number(id),
    },
  })

  return res.json({ message: 'Tarefa deletada com sucesso' })
}

async function updateTaskStatus(req, res) {
  const { id, status, description, title } = req.body
  const task = await prisma.task.update({
    where: {
      id: Number(id),
    },
    data: {
      status,
      description,
      title,
    },
  })
  res.json({ message: 'Status da tarefa atualizado com sucesso', task })
}

router.get('/', getTaskList)

router.get('/:id', getTask)

router.post('/add', addTask)

router.delete('/:id', deleteTask)

router.post('/:id', updateTaskStatus)

export default router

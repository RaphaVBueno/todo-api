import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

export async function getTaskList(req, res) {
  try {
    const { userId, date } = req.query

    const findUser = await prisma.usuario.findUnique({
      where: { id: Number(userId) },
    })
    if (!findUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    const tasks = await prisma.task.findMany({
      where: {
        date: new Date(date),
        userId: Number(userId),
      },
      include: { tags: true },
    })

    res.json({ tasks })
  } catch (error) {
    console.error('Erro na função getTaskList:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export async function getTask(req, res) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(req.params.id) },
      include: { tags: true },
    })
    if (!task) {
      return res.status(404).json({ message: 'tarefa não encontrada' })
    }
    res.json({ task })
  } catch (error) {
    console.error('Erro na função getTask:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export async function addTask(req, res) {
  try {
    const { title, date, userId } = req.body
    const findUser = await prisma.usuario.findUnique({ where: { id: userId } })
    if (!findUser) {
      return res.status(404).json({ message: 'usuario não encontrada' })
    }

    const task = await prisma.task.create({
      data: {
        title,
        status: false,
        date: new Date(date),
        userId,
      },
    })
    res.json({ message: 'Tarefa adicionada com sucesso', task })
  } catch (error) {
    console.error('Erro na função addTask:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export async function deleteTask(req, res) {
  try {
    const { userId, id } = req.query
    const findUser = await prisma.usuario.findUnique({
      where: { id: Number(userId) },
    })
    if (!findUser) {
      return res.status(404).json({ message: 'usuario não encontrada' })
    }

    const findtask = await prisma.task.findUnique({ where: { id: Number(id) } })
    if (!findtask) {
      return res.status(404).json({ message: 'tarefa não encontrada' })
    }

    const deleteTask = await prisma.task.delete({
      where: {
        id: Number(id),
      },
    })

    return res.json({ message: 'Tarefa deletada com sucesso' })
  } catch (error) {
    console.error('Erro na função deleteTask:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export async function updateTaskStatus(req, res) {
  try {
    const { id, status, description, title } = req.body

    const findtask = await prisma.task.findUnique({ where: { id: Number(id) } })
    if (!findtask) {
      return res.status(404).json({ message: 'tarefa não encontrada' })
    }

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
    res.json({ message: 'Tarefa atualizada com sucesso', task })
  } catch (error) {
    console.error('Erro na função updateTaskStatus:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

router.get('/', getTaskList)

router.get('/:id', getTask)

router.post('/add', addTask)

router.delete('/:id', deleteTask)

router.post('/:id/update', updateTaskStatus)

export default router

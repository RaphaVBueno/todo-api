import express from 'express'
import {
  getTasksDB,
  getTaskDB,
  addTaskDB,
  deleteTaskDB,
  updateTaskStatusDB,
  updateDescriptionDB,
} from '../models/tasks.js'

export async function getTaskList(req, res) {
  const { date } = req.query
  let resposta = await getTasksDB(date)
  res.json({ resposta })
}

export async function getTask(req, res) {
  const { id } = req.params // Aqui, usamos req.params em vez de req.body
  const idAsInt = parseInt(id, 10)
  let resposta = await getTaskDB(idAsInt)
  res.json({ resposta })
}

export async function addTask(req, res) {
  const { title, date, user } = req.body
  await addTaskDB(title, date, user)
  res.json({ message: 'OK' })
}

export async function deleteTask(req, res) {
  const { id } = req.params
  const idAsInt = parseInt(id, 10)
  await deleteTaskDB(idAsInt)
  res.json({ message: 'OK' })
}

export async function updateTaskStatus(req, res) {
  const { id, status } = req.body
  await updateTaskStatusDB(id, status)
  res.json({ message: 'OK' })
}

export async function updateDescription(req, res) {
  const { id, description } = req.body
  const idAsInt = parseInt(id, 10)
  await updateDescriptionDB(idAsInt, description)
  res.json({ message: 'OK' })
}

const router = express.Router()

router.get('/', getTaskList)

router.get('/:id', getTask)

router.post('/add', addTask)

router.delete('/:id', deleteTask)

router.post('/:id', updateTaskStatus)

router.post('/:id/update-description', updateDescription)

export default router

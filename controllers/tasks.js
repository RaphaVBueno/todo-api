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

export async function getTask() {
  const { id } = req.query
  let resposta = await getTaskDB(id)
  res.json({ resposta })
}

export async function addTask() {
  const { title, date, user } = req.body
  let resposta = await addTaskDB(title, date, user)
  res.json({ resposta })
}

export async function deleteTask() {
  const { id } = req.body
  let resposta = await deleteTaskDB(id)
  res.json({ resposta })
}

export async function updateTaskStatus() {
  const { id, status } = req.body //no arquivo antigo essa function estava tratando com tittle ao invés de id, lembrar de alterar o arquivo original
  let resposta = await updateTaskStatusDB(id, status)
  res.json({ resposta })
}

export async function updateDescription() {
  const { id, description } = req.body
  let resposta = await updateDescriptionDB(id, description)
  res.json({ resposta })
}

const router = express.Router()

router.get('/', getTaskList)

router.get('/:id', getTask)

router.post('/add', addTask)

router.delete('/:id', deleteTask)

router.post('/:id', updateTaskStatus)

router.post('/:id', updateDescription)

export default router

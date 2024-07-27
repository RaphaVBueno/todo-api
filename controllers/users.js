import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getUserList(req, res) {
  const users = await prisma.usuario.findMany()
  res.json({ users })
}

export async function getUser(req, res) {
  const { email } = req.params // Aqui, usamos req.params em vez de req.body
  const user = await prisma.usuario.findUnique({
    where: { email },
  })
  res.json({ user })
}

export async function addUser(req, res) {
  const { name, email, password } = req.body
  const user = await prisma.usuario.create({
    data: {
      email,
      password,
      name,
    },
  })
  res.json({ message: 'Usuario adicionado com sucesso', user })
}

// export async function deleteUser(req, res) {
//   const { id } = req.params
//   const idAsInt = parseInt(id, 10)
//   await deleteUserDB(idAsInt)
//   res.json({ message: 'OK' })
// }

// export async function updateUserStatus(req, res) {
//   const { id, status } = req.body
//   await updateUserStatusDB(id, status)
//   res.json({ message: 'OK' })
// }

// export async function updateDescription(req, res) {
//   const { id, description } = req.body
//   const idAsInt = parseInt(id, 10)
//   await updateDescriptionDB(idAsInt, description)
//   res.json({ message: 'OK' })
// }

const router = express.Router()

router.get('/', getUserList)

router.get('/:email', getUser)

router.post('/add', addUser)

// router.delete('/:id', deleteUser)

// router.post('/:id', updateUserStatus)

// router.post('/:id/update-description', updateDescription)

export default router

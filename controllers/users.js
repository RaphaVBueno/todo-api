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

export async function deleteUser(req, res) {
  const { id } = req.params
  const idAsInt = parseInt(id, 10)
  const user = await prisma.usuario.delete({
    where: {
      id: idAsInt,
    },
  })
  res.json({ message: 'Usuario deletado com sucesso', user })
}

export async function updateUser(req, res) {
  const { email } = req.params
  const { name, password } = req.body

  const user = await prisma.usuario.update({
    where: { email },
    data: {
      name,
      password,
    },
  })

  res.json({ message: 'Usuario atualizado com sucesso', user })
}

const router = express.Router()

router.get('/', getUserList)

router.get('/:email', getUser)

router.post('/add', addUser)

router.delete('/:id', deleteUser)

router.put('/:email', updateUser)

export default router

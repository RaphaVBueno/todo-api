import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getUserList(req, res) {
  const users = await prisma.usuario.findMany()
  res.json({ users })
}

export async function getUser(req, res) {
  const id = parseInt(req.params.id, 10)
  const user = await prisma.usuario.findUnique({
    where: { id },
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
  const { id } = req.body
  console.log(req.body)
  const user = await prisma.usuario.delete({
    where: {
      id,
    },
  })
  res.json({ message: 'Usuario deletado com sucesso', user })
}

export async function updateUser(req, res) {
  const { name, password, id, email } = req.body

  const user = await prisma.usuario.update({
    where: { id },
    data: {
      name,
      password,
      email,
    },
  })

  res.json({ message: 'Usuario atualizado com sucesso', user })
}

const router = express.Router()

router.get('/', getUserList)

router.get('/:id', getUser)

router.post('/add', addUser)

router.delete('/', deleteUser)

router.put('/', updateUser)

export default router

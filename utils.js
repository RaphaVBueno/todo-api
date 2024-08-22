import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export function mockedTasks(
  id,
  title,
  status,
  date,
  description,
  userId,
  listId,
  tags
) {
  return {
    id: id,
    title: title,
    status: status,
    date: date,
    description: description,
    userId: userId,
    listId: listId,
    tags: tags,
  }
}

export function mockedList(id, name, userid) {
  return { id: id, name: name, userid: userid }
}

export function mockedTag() {}

export async function findUserError(userId) {
  const findUser = await prisma.usuario.findUnique({
    where: { id: Number(userId) },
  })
  if (!findUser) {
    throw new Error('usuário não encontrado')
  }
  return findUser
}

export async function findTaskError(taskId) {
  const findTask = await prisma.task.findUnique({
    where: { id: Number(taskId) },
  })
  if (!findTask) {
    throw new Error('tarefa não encontrada')
  }
  return findTask
}

export async function findTagError(tagId) {
  const findTag = await prisma.tag.findUnique({
    where: { id: Number(tagId) },
  })
  if (!findTag) {
    throw new Error('tag não encontrada')
  }
  return findTag
}

export async function findListError(listId) {
  const findList = await prisma.list.findUnique({
    where: { id: Number(listId) },
  })
  if (!findList) {
    throw new Error('categoria não encontrada')
  }
  return findList
}

export function isNumber(id) {
  const parseId = Number(id)
  if (isNaN(parseId)) {
    throw new Error('id não é um número')
  }
  return
}
// criar testes para tratamento de erros

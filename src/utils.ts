import { PrismaClient } from '@prisma/client'
//TODO CRIAR ARQUIVOS COM MOCKS, mudar tsconfig.prod.json para não buildar os testes em ts
const prisma = new PrismaClient()

export function mockedTasks(
  id: number,
  title: string,
  status: boolean,
  date: string,
  description: string,
  userId: number,
  listId: number,
  tags: number[]
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

export function mockedList(id: number, name: string, userid: number) {
  return { id: id, name: name, userid: userid }
}

export function mockedTag() {}

export async function findUserError(userId: string) {
  const findUser = await prisma.usuario.findUnique({
    where: { id: Number(userId) },
  })
  if (!findUser) {
    throw new Error('usuário não encontrado', { cause: 404 })
  }
  return findUser
}

export async function findTaskError(taskId: string) {
  const findTask = await prisma.task.findUnique({
    where: { id: Number(taskId) },
  })
  if (!findTask) {
    throw new Error('tarefa não encontrada')
  }
  return findTask
}

export async function findTagError(tagId: string) {
  const findTag = await prisma.tag.findUnique({
    where: { id: Number(tagId) },
  })
  if (!findTag) {
    throw new Error('tag não encontrada')
  }
  return findTag
}

export async function findListError(listId: string) {
  const findList = await prisma.list.findUnique({
    where: { id: Number(listId) },
  })
  if (!findList) {
    throw new Error('categoria não encontrada')
  }
  return findList
}

export function isNumber(id: number | string) {
  const parseId = Number(id)
  if (isNaN(parseId)) {
    throw new Error('id não é um número')
  }
}
// criar testes para tratamento de erros

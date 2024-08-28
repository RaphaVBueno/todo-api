import { PrismaClient } from '@prisma/client'
//TODO CRIAR ARQUIVOS COM MOCKS, mudar tsconfig.prod.json para não buildar os testes em ts
const prisma = new PrismaClient()

type MockTask = {
  id?: number
  title?: string
  status?: boolean
  date?: string
  description?: string
  userId?: number
  listId?: number
  tags?: number[]
}

export function mockedTasks(params: MockTask) {
  return {
    id: 1,
    title: 'tarefa 1',
    status: false,
    date: '2024-08-21',
    description: null,
    userId: 1,
    listId: null,
    tags: [],
    ...params,
  }
}

export function mockedList(id: number, name: string, userid: number) {
  //mudar seguir exemplo do will
  return { id: id, name: name, userid: userid }
}

export function mockedTag() {}

export async function findUserError(userId: number | string) {
  const findUser = await prisma.usuario.findUnique({
    where: { id: Number(userId) },
  })
  if (!findUser) {
    throw new Error('usuário não encontrado', { cause: 404 })
  }
  return findUser
}

export async function findTaskError(taskId: number | string) {
  const findTask = await prisma.task.findUnique({
    where: { id: Number(taskId) },
  })
  if (!findTask) {
    throw new Error('tarefa não encontrada', { cause: 404 })
  }
  return findTask
}

export async function findTagError(tagId: number | string) {
  const findTag = await prisma.tag.findUnique({
    where: { id: Number(tagId) },
  })
  if (!findTag) {
    throw new Error('tag não encontrada', { cause: 404 })
  }
  return findTag
}

export async function findListError(listId: number | string) {
  const findList = await prisma.list.findUnique({
    where: { id: Number(listId) },
  })
  if (!findList) {
    throw new Error('categoria não encontrada', { cause: 404 })
  }
  return findList
}

export function isNumber(id: number | string) {
  const parseId = Number(id)
  if (isNaN(parseId)) {
    throw new Error('id não é um número', { cause: 404 })
  }
}
// criar testes para tratamento de erros

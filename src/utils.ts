import { PrismaClient } from '@prisma/client'
import { isValid, parse } from 'date-fns'
import { NotFoundError } from './api.errors'

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

export const timeZone = 'America/Sao_Paulo'

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
    throw new NotFoundError('tarefa não encontrada')
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

export function isValidDate(dateString: string) {
  const date = parse(dateString, 'yyyy-MM-dd', new Date())

  if (!isValid(date)) {
    throw new Error('não é uma data válida', { cause: 404 })
  }
}

// criar testes para tratamento de erros

export const errorTreatment: Record<
  string,
  { message: string; status: number }
> = {
  P2025: { message: 'não econtrado(a)', status: 404 },
  P2002: { message: 'já está em uso', status: 409 },
}

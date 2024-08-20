import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getTaskList,
  getTask,
  addTask,
  deleteTask,
  updateTaskStatus,
} from './tasks'
import { PrismaClient } from '@prisma/client'

// Mock do Prisma Client
vi.mock('@prisma/client', () => {
  const mockPrisma = {
    task: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
  }
  return { PrismaClient: vi.fn(() => mockPrisma) }
})

const prisma = new PrismaClient()

describe('Testando as funções da API de Tarefas', () => {
  beforeEach(() => {
    vi.clearAllMocks() // Limpar todos os mocks antes de cada teste
  })

  it('getTaskList - deve retornar a lista de tarefas', async () => {
    const mockTasks = [
      {
        id: 1,
        title: 'Tarefa 1',
        status: false,
        date: new Date(),
        description: null,
        userId: 1,
        listId: null,
        tags: [],
      },
      {
        id: 2,
        title: 'Tarefa 2',
        status: false,
        date: new Date(),
        description: null,
        userId: 1,
        listId: null,
        tags: [],
      },
    ]

    // Mock da função prisma.task.findMany
    prisma.task.findMany.mockResolvedValue(mockTasks)

    // Criar mocks dos objetos req e res
    const req = {
      query: { userId: '1', date: new Date().toISOString() },
    }
    const res = {
      json: vi.fn(),
    }

    // Chamar a função e verificar os resultados
    await getTaskList(req, res)
    expect(prisma.task.findMany).toHaveBeenCalledWith({
      where: {
        userId: 1,
        date: expect.any(Date),
      },
      include: { tags: true },
    })
    expect(res.json).toHaveBeenCalledWith({ tasks: mockTasks })
  })
})

it('getTask - deve retornar uma tarefa especifica', async () => {
  const mockTasks = {
    id: 1,
    title: 'Tarefa 1',
    status: false,
    date: new Date(),
    description: null,
    userId: 1,
    listId: null,
    tags: [],
  }

  prisma.task.findUnique.mockResolvedValue(mockTasks)

  const req = { params: { id: 1 } }
  const res = { json: vi.fn() }

  await getTask(req, res)
  expect(prisma.task.findUnique).toHaveBeenCalledWith({
    where: { id: 1 },
    include: { tags: true },
  })
  expect(res.json).toHaveBeenCalledWith({ task: mockTasks })
})

it('addTask - deve adicionar uma nova tarefa', async () => {
  const newTask = {
    id: 1,
    title: 'nova tarefa',
    status: false,
    date: new Date(),
    description: null,
    userId: 1,
    listId: null,
    tags: [],
  } //isso seria o que eu queria ver no meu banco de dados?

  prisma.task.create.mockResolvedValue(newTask)

  const req = {
    body: { title: 'nova tarefa', date: new Date().toISOString(), userId: 1 },
  }

  const res = { json: vi.fn() }

  await addTask(req, res)

  expect(prisma.task.create).toHaveBeenCalledWith({
    data: {
      title: req.body.title,
      date: expect.any(Date),
      status: false,
      userId: req.body.userId,
    },
  })

  expect(res.json).toHaveBeenCalledWith({
    message: 'Tarefa adicionada com sucesso',
    task: newTask,
  })
})

it('updateTaskStatuss - deve atualizar uma tarefa', async () => {
  const mockTasks = {
    id: 1,
    title: 'tarefa 1',
    status: true,
    date: new Date(),
    description: 'decrição de teste',
    userId: 1,
    listId: null,
    tags: [],
  }

  prisma.task.update.mockResolvedValue(mockTasks)

  const req = {
    body: {
      id: 1,
      status: true,
      description: 'descrição de teste',
      title: 'tarefa 1',
    },
  }
  const res = { json: vi.fn() }

  await updateTaskStatus(req, res)
  expect(prisma.task.update).toHaveBeenCalledWith({
    where: { id: req.body.id },
    data: {
      status: req.body.status,
      description: req.body.description,
      title: req.body.title,
    },
  })

  expect(res.json).toHaveBeenCalledWith({
    message: 'Tarefa atualizada com sucesso',
    task: mockTasks,
  })
})

it('deve deletar uma tarefa', async () => {
  const req = {
    query: {
      userId: '1',
      id: '1',
    },
  }
  const res = { json: vi.fn() }

  prisma.task.delete.mockResolvedValue({})

  await deleteTask(req, res)

  expect(prisma.task.delete).toHaveBeenCalledWith({
    where: {
      id: 1,
    },
  })

  expect(res.json).toHaveBeenCalledWith({
    message: 'Tarefa deletada com sucesso',
  })
})

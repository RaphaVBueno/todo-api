import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getTaskList,
  getTask,
  addTask,
  deleteTask,
  updateTaskStatus,
} from './tasks'
import { PrismaClient } from '@prisma/client'
import { mockedTasks } from '../utils'

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
    const mockTasks = [mockedTasks(1), mockedTasks({ id: 2 })]

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
  prisma.task.findUnique.mockResolvedValue(
    mockedTasks(1, 'tarefa 1', false, '2024-08-21', null, 1, null, [])
  )

  const req = { params: { id: 1 } }
  const res = { json: vi.fn() }

  await getTask(req, res)
  expect(prisma.task.findUnique).toHaveBeenCalledWith({
    where: { id: 1 },
    include: { tags: true },
  })
  expect(res.json).toHaveBeenCalledWith({
    task: mockedTasks(1, 'tarefa 1', false, '2024-08-21', null, 1, null, []),
  })
})

it('addTask - deve adicionar uma nova tarefa', async () => {
  prisma.task.create.mockResolvedValue(
    mockedTasks(1, 'nova tarefa', false, '2024-08-21', null, 1, null, [])
  )

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
    task: mockedTasks(1, 'nova tarefa', false, '2024-08-21', null, 1, null, []),
  })
})

it('updateTaskStatuss - deve atualizar uma tarefa', async () => {
  prisma.task.update.mockResolvedValue(
    mockedTasks(
      1,
      'tarefa 1',
      true,
      '2024-08-21',
      'descrição de teste',
      1,
      null,
      []
    )
  )

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
    task: mockedTasks(
      1,
      'tarefa 1',
      true,
      '2024-08-21',
      'descrição de teste',
      1,
      null,
      []
    ),
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

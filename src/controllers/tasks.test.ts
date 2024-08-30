import { describe, it, expect, vi } from 'vitest'
import {
  getTaskList,
  getTask,
  addTask,
  deleteTask,
  updateTaskStatus,
} from './tasks.js'
import { findTaskError, findUserError, isNumber } from '../utils.js'

// Tipando o PrismaClient para garantir que o TypeScript entenda o mock
const mockPrisma = {
  task: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  },
}

// Criando o mock do Prisma Client
vi.mock('@prisma/client', () => {
  return {
    PrismaClient: vi.fn().mockImplementation(() => mockPrisma),
  }
})

vi.mock('../utils.js', () => ({
  findTaskError: vi.fn(),
  findUserError: vi.fn(),
  isNumber: vi.fn(),
}))

const mockRequest = (query = {}, params = {}, body = {}) => ({
  query,
  params,
  body,
})

const mockResponse = () => {
  const res: any = {}
  res.json = vi.fn().mockReturnValue(res)
  res.status = vi.fn().mockReturnValue(res)
  return res
}

describe('Testes unitários das funções', () => {
  it('deve retornar a lista de tarefas', async () => {
    const req = mockRequest({ userId: '1', date: '2023-08-30' })
    const res = mockResponse()

    mockPrisma.task.findMany.mockResolvedValue([{ id: 1, title: 'Task 1' }])

    await getTaskList(req as any, res)

    expect(isNumber).toHaveBeenCalledWith('1')
    expect(findUserError).toHaveBeenCalledWith('1')
    expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
      where: {
        date: new Date('2023-08-30'),
        userId: 1,
      },
      include: { tags: true },
    })
    expect(res.json).toHaveBeenCalledWith({
      tasks: [{ id: 1, title: 'Task 1' }],
    })
  })

  it('deve retornar um erro ao buscar uma tarefa inexistente', async () => {
    const req = mockRequest({}, { id: '2' })
    const res = mockResponse()

    mockPrisma.task.findUnique.mockResolvedValue(null)

    await getTask(req as any, res)

    expect(isNumber).toHaveBeenCalledWith('2')
    expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({
      where: { id: 2 },
      include: { tags: true },
    })
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'tarefa não encontrada' })
  })

  it('deve adicionar uma nova tarefa', async () => {
    const req = mockRequest(
      {},
      {},
      { title: 'Nova Tarefa', date: '2023-08-30', userId: '1' }
    )
    const res = mockResponse()

    mockPrisma.task.create.mockResolvedValue({ id: 1, title: 'Nova Tarefa' })

    await addTask(req as any, res)

    expect(isNumber).toHaveBeenCalledWith('1')
    expect(findUserError).toHaveBeenCalledWith('1')
    expect(mockPrisma.task.create).toHaveBeenCalledWith({
      data: {
        title: 'Nova Tarefa',
        status: false,
        date: new Date('2023-08-30'),
        userId: 1,
      },
    })
    expect(res.json).toHaveBeenCalledWith({
      message: 'Tarefa adicionada com sucesso',
      task: { id: 1, title: 'Nova Tarefa' },
    })
  })

  it('deve deletar uma tarefa', async () => {
    const req = mockRequest({ userId: '1', id: '1' })
    const res = mockResponse()

    mockPrisma.task.delete.mockResolvedValue({
      id: 1,
      title: 'Tarefa Deletada',
    })

    await deleteTask(req as any, res)

    expect(isNumber).toHaveBeenCalledWith('1')
    expect(findUserError).toHaveBeenCalledWith('1')
    expect(findTaskError).toHaveBeenCalledWith('1')
    expect(mockPrisma.task.delete).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    })
    expect(res.json).toHaveBeenCalledWith({
      message: 'tarefa deletada com sucesso',
      deleteTask: { id: 1, title: 'Tarefa Deletada' },
    })
  })

  it('deve atualizar o status de uma tarefa', async () => {
    const req = mockRequest(
      {},
      {},
      { id: '1', status: true, title: 'Tarefa Atualizada', userId: '1' }
    )
    const res = mockResponse()

    mockPrisma.task.update.mockResolvedValue({
      id: 1,
      title: 'Tarefa Atualizada',
      status: true,
    })

    await updateTaskStatus(req as any, res)

    expect(isNumber).toHaveBeenCalledWith('1')
    expect(findUserError).toHaveBeenCalledWith('1')
    expect(findTaskError).toHaveBeenCalledWith('1')
    expect(mockPrisma.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: true, title: 'Tarefa Atualizada' },
    })
    expect(res.json).toHaveBeenCalledWith({
      message: 'Tarefa atualizada com sucesso',
      task: { id: 1, title: 'Tarefa Atualizada', status: true },
    })
  })
})

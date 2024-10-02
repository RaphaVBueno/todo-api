import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  addList,
  updateList,
  deleteList,
  getListList,
  getList,
  addToList,
  RemoveList,
} from './list'
import { PrismaClient } from '@prisma/client'
import { mockedList } from '../utils'

// Mock do Prisma Client
vi.mock('@prisma/client', () => {
  const mockPrisma = {
    list: {
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

describe('Testando as funções da API de categorias', () => {
  beforeEach(() => {
    vi.clearAllMocks() // Limpar todos os mocks antes de cada teste
  })

  it('addList - deve adicionar uma nova categoria', async () => {
    prisma.list.create.mockResolvedValue(mockedList(1, 'nome da categoria', 1))

    const req = { body: { listName: 'nome da categoria', userId: 1 } }

    const res = { json: vi.fn() }
    await addList(req, res)

    expect(prisma.list.create).toHaveBeenCalledWith({
      data: {
        name: req.body.listName,
        user: {
          connect: { id: req.body.userId },
        },
      },
    })

    expect(res.json).toHaveBeenCalledWith({
      message: 'categoria adicionada com sucesso',
      category: mockedList(1, 'nome da categoria', 1),
    })
  })
  //escrever o outro teste aqui
})

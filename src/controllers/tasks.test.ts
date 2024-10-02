import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../server'

describe('/tasks', () => {
  it('GET / - deve retornar a lista de tarefas', async () => {
    const response = await request(app).get(
      '/tasks?userId=1&dueDate=2024-09-06'
    )

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('tasks')
  })

  it('GET / - deve retornar um erro ao buscar um usuário não existente', async () => {
    const response = await request(app).get(
      '/tasks?dueDate=2024-09-24&userId=555'
    )

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('usuário não encontrado')
  })

  it('GET / - deve retornar um erro ao buscar uma data invalida', async () => {
    const response = await request(app).get(
      '/tasks?dueDate=2024-50-50&userId=1'
    )

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('não é uma data válida')
  })

  it('POST /add - deve adicionar uma nova tarefa', async () => {
    const response = await request(app)
      .post('/tasks/add')
      .send({ title: 'tarefa teste', dueDate: '2024-09-20', userId: 1 })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Tarefa adicionada com sucesso')
  })

  it('POST /add - deve retornar um erro de id invalido ao adicionar uma nova tarefa', async () => {
    const response = await request(app)
      .post('/tasks/add')
      .send({ title: 'tarefa teste', dueDate: '2024-09-20', userId: 'b' })

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('id não é um número')
  })

  it('POST /add - deve retornar um erro de usuário não encontrado ao adicionar uma nova tarefa', async () => {
    const response = await request(app)
      .post('/tasks/add')
      .send({ title: 'tarefa teste', dueDate: '2024-09-20', userId: 999 })

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('usuário não encontrado')
  })

  it('POST /add - deve retormar um erro de data invalida ao adicionar uma nova tarefa', async () => {
    const response = await request(app)
      .post('/tasks/add')
      .send({ title: 'tarefa teste', dueDate: '2024-50-50', userId: 1 })

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('não é uma data válida')
  })

  it('GET /tasks/:id - deve retornar uma tarefa por id', async () => {
    const taskId = 81
    const response = await request(app).get(`/tasks/${taskId}`)
    const { task } = response.body

    expect(response.status).toBe(200)
    expect(task.id).toBe(taskId)
    expect(task.title).toBe('tarefa teste')
  })

  it('GET /tasks/:id - deve retornar um erro ao buscar uma tarefa inexistente', async () => {
    const wrongId = 'abadfasdfas'
    const response = await request(app).get(`/tasks/${wrongId}`)

    expect(response.status).toBe(500)
    expect(response.body.message).toBe('Error: id não é um número')
  })

  it('DELETE /:id - deve deletar uma tarefa'),
    async () => {
      const taskId = 79
      const response = await request(app).get(`/tasks/${taskId}`)

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('tarefa deletada com sucesso')
    }

  //parei nos erros da função de deletar

  // it('deve deletar uma tarefa', async () => {})

  // it('deve atualizar o status de uma tarefa', async () => {})
})

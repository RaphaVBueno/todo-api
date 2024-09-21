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

  it('POST /add - deve adicionar uma nova tarefa', async () => {
    const response = await request(app)
      .post('/tasks/add')
      .send({ title: 'tarefa teste', dueDate: '2024-09-20', userId: 1 })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Tarefa adicionada com sucesso')
  })

  it('GET /tasks/:id - deve retornar uma tarefa por id', async () => {
    const taskId = 1
    const response = await request(app).get(`/tasks/${taskId}`)
    const { task } = response.body

    expect(response.status).toBe(200)
    expect(task.id).toBe(taskId)
    expect(task.title).toBe('estudar')
  })

  it('GET /tasks/:id - deve retornar um erro ao buscar uma tarefa inexistente', async () => {
    const wrongId = 'abadfasdfas'
    const response = await request(app).get(`/tasks/${wrongId}`)

    expect(response.status).toBe(500)
    expect(response.body.message).toBe('Error: id não é um número')
  })

  // it('deve deletar uma tarefa', async () => {})

  // it('deve atualizar o status de uma tarefa', async () => {})
})

import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../server.js'

const validToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTczNDY0ODg3Mn0.OH9HI2agPpaaI_QBpBHslvG46u3utCt6tLWw8wK79JU'

describe('/tasks', () => {
  it('GET / - deve retornar a lista de tarefas', async () => {
    const response = await request(app)
      .get('/tasks?dueDate=2024-12-22')
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('tasks')
  })

  it('GET / - deve retornar um erro de não autorizado', async () => {
    const response = await request(app)
      .get('/tasks?dueDate=2024-12-22')
      .set('Authorization', 'invalidToken')

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('acesso negado')
  })

  it('GET / - deve retornar um erro ao buscar uma data invalida', async () => {
    const response = await request(app)
      .get('/tasks?dueDate=2024-50-22')
      .set('Authorization', validToken)

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('não é uma data válida')
  })

  it('GET /busca/:search - deve retornar as tarefas da busca', async () => {
    const response = await request(app)
      .get('/tasks/busca/123456')
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('tasks')
  })

  it('POST /add - deve adicionar uma nova tarefa', async () => {
    const response = await request(app)
      .post('/tasks/add')
      .send({
        title: 'tarefa teste',
        dueDate: '2024-09-20',
        listId: 39,
        tagId: [52, 53],
        description: 'teste',
      })
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('tarefa adicionada com sucesso')
  })

  it('GET /tasks/:id - deve retornar uma tarefa por id', async () => {
    const taskId = 214
    const response = await request(app)
      .get(`/tasks/${taskId}`)
      .set('Authorization', validToken)
    const { task } = response.body

    expect(response.status).toBe(200)
    expect(task.id).toBe(taskId)
  })

  it('DELETE /:id - deve deletar uma tarefa', async () => {
    const taskId = 217
    const response = await request(app)
      .delete(`/tasks/${taskId}`)
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('tarefa deletada com sucesso')
  })

  it('POST /:id/update - deve atualizar uma tarefa', async () => {
    const taskId = 218
    const response = await request(app)
      .post(`/tasks/${taskId}/update`)
      .send({
        title: 'tarefa atualizada',
        taskId: taskId,
        status: true,
        dueDate: '2024-12-19',
        listId: 39,
        tagId: [52, 53],
        description: 'teste atualizado',
      })
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('tarefa atualizada com sucesso')
  })

  it('POST /:id/update - deve atualizar os status de uma tarefa', async () => {
    const taskId = 218
    const response = await request(app)
      .post(`/tasks/${taskId}/status`)
      .send({
        taskId: taskId,
        status: true,
        completedDate: '2024-12-19',
      })
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('tarefa atualizada com sucesso')
  })
})

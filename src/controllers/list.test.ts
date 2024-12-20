import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../server'

const validToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTczNDY0ODg3Mn0.OH9HI2agPpaaI_QBpBHslvG46u3utCt6tLWw8wK79JU'

describe('/list', () => {
  it('GET / - deve retornar uma lista de categorias', async () => {
    const response = await request(app)
      .get('/list/userList/1')
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('categories')
  })

  it('GET / - deve retornar uma categorias', async () => {
    const listId = 39
    const response = await request(app)
      .get(`/list/${listId}`)
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('category')
  })

  it('POST /add - deve adicionar uma categorias', async () => {
    const response = await request(app)
      .post(`/list/add`)
      .send({
        listName: 'categoria do teste',
        color: '#7e7e7e',
      })
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('categoria adicionada com sucesso')
  })

  it('POST /edit - deve atualizar uma categorias', async () => {
    const response = await request(app)
      .put(`/list/edit`)
      .send({
        name: 'categoria do teste atualizada',
        color: '#7e7e',
        listId: 39,
      })
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('categoria editada com sucesso')
  })

  it('DELETE /:listid - deve deletar uma categorias', async () => {
    const listId = 42
    const response = await request(app)
      .delete(`/list/${listId}`)
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('categoria deletada com sucesso')
  })
})

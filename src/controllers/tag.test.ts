import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../server'

const validToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTczNDY0ODg3Mn0.OH9HI2agPpaaI_QBpBHslvG46u3utCt6tLWw8wK79JU'

describe('/tag', () => {
  it('GET / - deve retornar uma lista de tags', async () => {
    const response = await request(app)
      .get('/tag/usertaglist/1')
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('tags')
  })

  it('GET / - deve retornar uma tag', async () => {
    const tagId = 52
    const response = await request(app)
      .get(`/tag/${tagId}`)
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('tag')
  })

  it('POST /add - deve adicionar uma tags', async () => {
    const response = await request(app)
      .post(`/tag/add`)
      .send({
        name: 'tag do teste',
      })
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('tag adicionada com sucesso')
  })

  it('POST /edit - deve atualizar uma tag', async () => {
    const response = await request(app)
      .put(`/tag/edit`)
      .send({
        name: 'categoria do teste atualizada',
        tagId: 52,
      })
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('tag editada com sucesso')
  })

  it('DELETE /:tagid - deve deletar uma tag', async () => {
    const tagId = 53
    const response = await request(app)
      .delete(`/tag/${tagId}`)
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('tag deletada com sucesso')
  })
})

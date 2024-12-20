import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../server'

const validToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTczNDY0ODg3Mn0.OH9HI2agPpaaI_QBpBHslvG46u3utCt6tLWw8wK79JU'

describe('/user', () => {
  //fazer o teste para getUserList adminOnly

  /* it('GET / - deve retornar uma lista de user', async () => {
    const response = await request(app)
      .get('/user/useruserlist/1')
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('user')
  })*/

  it('GET / - deve retornar um user', async () => {
    const response = await request(app)
      .get(`/user/me`)
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('user')
  })

  it('POST /add - deve adicionar uma user', async () => {
    const response = await request(app)
      .post(`/user/add`)
      .send({
        name: 'user do teste de adicionar',
        email: 'email@teste.com.br',
        password: '123456',
        birthDate: '2024-12-20',
        username: 'vitest',
      })
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('usuario adicionado com sucesso')
  })

  it('POST /edit - deve atualizar um user', async () => {
    const response = await request(app)
      .put(`/user/`)
      .send({
        name: 'nome teste atualizado',
        password: '123456',
        email: 'teste@mailatualizado.com',
        username: 'teste username atualizado',
      })
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('usuario atualizado com sucesso')
  })

  /*it('DELETE /:userid - deve deletar uma user', async () => {
    const userId = 11
    const response = await request(app)
      .delete(`/user/`)
      .send({
        id: userId,
      })
      .set('Authorization', validToken)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('usuario deletado com sucesso')
  })*/
})

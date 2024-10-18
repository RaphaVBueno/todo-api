import express from 'express'
import cors from 'cors'

import tasks from './controllers/tasks'
import users from './controllers/users'
import list from './controllers/list'
import tag from './controllers/tag'
import session from './controllers/session'
import { logger, auth } from './middlewares'

const app = express()

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', session)
app.use('/tasks', auth, tasks)
app.use('/tasks', tasks)
app.use('/user', users)
app.use('/list', list)
app.use('/tag', tag)

export default app

const port = 3000

app.listen(port, () => {
  console.log('Servidor rodando em http://localhost:' + port)
})

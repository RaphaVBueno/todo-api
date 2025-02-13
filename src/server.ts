import express from 'express'
import cors from 'cors'

import tasks from './controllers/tasks.js'
import users from './controllers/users.js'
import list from './controllers/list.js'
import tag from './controllers/tag.js'
import session from './controllers/session.js'
import upload from './controllers/upload.js'
import { auth } from './middlewares/index.js'
import { errorMiddleware } from './middlewares/error.js'

const app = express()

app.use(cors())

app.use('/static', express.static('uploads'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', session)
app.use('/tasks', auth, tasks)
app.use('/user', users)
app.use('/list', auth, list)
app.use('/tag', auth, tag)
app.use('/upload', auth, upload)

app.use(errorMiddleware)

const port = 3000
app.listen(port, () => {
  console.log('Servidor rodando em http://localhost:' + port)
})

export default app

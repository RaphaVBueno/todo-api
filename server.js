import express from 'express'
import tasks from './controllers/tasks.js'
import users from './controllers/users.js'
import list from './controllers/list.js'
import tag from './controllers/tag.js'
import cors from 'cors'

const app = express()

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/tasks', tasks)
app.use('/users', users)
app.use('/list', tasks)
app.use('/tag', tasks)

const port = 3000

app.listen(port, () => {
  console.log('Servidor rodando em http://localhost:' + port)
})

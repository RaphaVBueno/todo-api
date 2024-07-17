import express from 'express'
import tasks from './controllers/tasks.js'
import cors from 'cors'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors())

app.use('/tasks', tasks)

const port = 3000

app.listen(port, () => {
  console.log('Servidor rodando em http://localhost:' + port)
})

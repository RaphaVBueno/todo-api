import express from 'express'
import tasks from './controllers/tasks.js'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173') // Permita a origem específica
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE') // Métodos permitidos
  res.header('Access-Control-Allow-Headers', 'Content-Type') // Cabeçalhos permitidos
  next()
})

app.use('/tasks', tasks)

const port = 3000

app.listen(port, () => {
  console.log('Servidor rodando em http://localhost:' + port)
})

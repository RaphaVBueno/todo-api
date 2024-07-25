import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Função para obter tarefas por data
export async function getTasksDB(date) {
  const tarefas = await prisma.task.findMany({
    where: {
      date: new Date(date),
    },
  })
  console.log(tarefas)
  return tarefas
}

// Função para obter uma tarefa por ID
export async function getTaskDB(id) {
  const tarefa = await prisma.task.findUnique({
    where: {
      id: id,
    },
  })
  return tarefa
}

// Função para adicionar uma nova tarefa
export async function addTaskDB(title, date, userEmail) {
  await prisma.task.create({
    data: {
      title: title,
      status: false,
      date: new Date(date),
      userEmail: userEmail,
    },
  })
}

// Função para excluir uma tarefa por ID
export async function deleteTaskDB(id) {
  await prisma.task.delete({
    where: {
      id: id,
    },
  })
}

// Função para atualizar o status de uma tarefa
export async function updateTaskStatusDB(id, status) {
  await prisma.task.update({
    where: {
      id: id,
    },
    data: {
      status: status,
    },
  })
}

// Função para atualizar a descrição de uma tarefa
export async function updateDescriptionDB(id, description) {
  await prisma.task.update({
    where: {
      id: id,
    },
    data: {
      description: description,
    },
  })
}

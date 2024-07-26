import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getTasksDB(date) {
  const tarefas = await prisma.task.findMany({
    where: {
      date: new Date(date),
    },
  })
  console.log(tarefas)
  return tarefas
}

export async function getTaskDB(id) {
  const tarefa = await prisma.task.findUnique({
    where: {
      id: id,
    },
  })
  return tarefa
}

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

export async function deleteTaskDB(id) {
  await prisma.task.delete({
    where: {
      id: id,
    },
  })
}

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

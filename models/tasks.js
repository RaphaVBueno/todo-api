import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config() // Carrega as variáveis de ambiente do arquivo .env

const DATABASE_URL =
  'postgres://postgres:SENHADODB@bueno-devs-todo-app-db.flycast:5432'

console.log(DATABASE_URL)

const sql = postgres(DATABASE_URL)

export async function getTasksDB(date) {
  let dados = await sql`
  SELECT * FROM tasks WHERE date = ${date};
  `
  return dados
}

export async function getTaskDB(id) {
  let dados = await sql`
      SELECT * FROM tasks WHERE id = ${id};
    `
  return dados
}

export async function addTaskDB(title, date, user) {
  await sql`
    INSERT INTO tasks (title, status, date, user_email) VALUES (
      ${title},
      FALSE,
      ${date},
      ${user}
    );
  `
}

export async function deleteTaskDB(id) {
  await sql`
  DELETE FROM tasks WHERE id = ${id};`
}

export async function updateTaskStatusDB(id, status) {
  await sql`
    UPDATE tasks SET status = ${status} WHERE id = ${id};
  `
}

export async function updateDescriptionDB(id, description) {
  await sql`
  UPDATE tasks SET description = ${description} WHERE id = ${id};
`
}

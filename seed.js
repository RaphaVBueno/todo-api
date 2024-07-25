// Importa o PrismaClient
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

async function main() {
  // Adiciona o usuário
  const usuario = await prisma.usuario.create({
    data: {
      email: 'rapha@mail.com',
      name: 'rapaha',
      password: '123',
      tasks: {
        create: [
          {
            title: 'estudar',
            status: false, // Ou true, dependendo do status da tarefa
            date: new Date(),
            descricao: 'Tarefa de estudo',
          },
          {
            title: 'jogar',
            status: false, // Ou true, dependendo do status da tarefa
            date: new Date(),
            descricao: 'Tarefa de lazer',
          },
        ],
      },
    },
  });

  console.log('Usuário e tarefas adicionados:', usuario);
}

// Executa a função principal e lida com possíveis erros
main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

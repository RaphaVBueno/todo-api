# 📌 Lista de Tarefas - Backend

Este repositório contém a API para um sistema de lista de tarefas, permitindo aos usuários criar um login, adicionar, editar e excluir tarefas, além de organizá-las em categorias e tags. O sistema também inclui funcionalidades como recuperação de senha, edição de perfil e upload de imagem de perfil.

## 🚀 Tecnologias Utilizadas

Este projeto foi desenvolvido com as seguintes tecnologias:

- **TypeScript**
- **Express**
- **Prisma ORM**
- **PostgreSQL**
- **Supertest**
- **Vitest**
- **Multer**
- **Nodemailer**
- **Zod**
- **Date-fns**
- **Bcrypt**
- **Jsonwebtoken**

## ⚙️ Configuração e Instalação

### 1️⃣ Clone o repositório:

```bash
git clone https://github.com/bueno-devs/todo-api
```

### 2️⃣ Instale as dependências:

```bash
npm install
```

### 3️⃣ Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto e preencha com os valores necessários:
`DATABASE_URL='seu-banco-de-dados'`
`SECRET= 'senha-de-validação-dos-tokens'`

### 4️⃣ Execute as migrações do banco de dados:

```bash
npx prisma migrate dev
```

### 5️⃣ Inicie o servidor:

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## 🧪 Testes

Para rodar os testes unitários e de integração, use:

```bash
npm run test
```

## 🎨 Frontend

O frontend deste projeto está disponível em outro repositório. Ele foi desenvolvido com as seguintes tecnologias:

- **React**
- **React Router**
- **Material UI (MUI)**
- **Axios**
- **React Hook Form**
- **TanStack React Query**

Link para o repositório do frontend: [Frontend Repository](https://github.com/bueno-devs/todo-app)

## 📜 Licença

Este projeto está sob a licença MIT.

---

🔗 **Contato**: [Raphael V. Bueno](https://github.com/RaphaVBueno) | [LinkedIn](https://www.linkedin.com/in/raphael-vieira-bueno-41323a332/)
🔗 **Contato**: [Vinicius V. Bueno](https://github.com/ViniciusVBueno)

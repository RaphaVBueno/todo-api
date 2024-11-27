import { createTransport } from 'nodemailer'

const transporter = createTransport({
  host: 'smtp.mailersend.net',
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: 'MS_eRJ0nX@trial-pr9084z77vjgw63d.mlsender.net', // seu usuário
    pass: process.env.EMAILPASSWORD, // sua senha
  },
})
//adicionar token como parametro da função
export async function send(to: string, token: string) {
  return await transporter.sendMail({
    from: '"Bueno Devs" <MS_eRJ0nX@trial-pr9084z77vjgw63d.mlsender.net>', // endereço do remetente
    to, // lista de destinatários
    subject: 'Recuperação de Senha | Bueno Devs Todo App', // assunto do email
    text: `Clique no link para recuperar sua senha http://localhost:5173/nova-senha/${token}`, // corpo do email em texto puro
    html: `<b>Clique no link para recuperar sua senha http://localhost:5173/nova-senha/${token}</b>`, // corpo do email em HTML
  })
}

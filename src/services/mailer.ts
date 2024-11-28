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
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redefinição de Senha</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background-color: #007bff;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .email-body {
      padding: 20px;
    }
    .email-footer {
      text-align: center;
      padding: 10px;
      background-color: #f8f8f8;
      font-size: 12px;
      color: #666;
    }
    .button {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #007bff; 
    color: white !important; 
    text-decoration: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }
  .button:hover {
    background-color: #0056b3;
  }
    p {
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Recuperação de Senha</h1>
    </div>
    <div class="email-body">
      <p>Olá,</p>
      <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:</p>
      <a href="http://localhost:5173/nova-senha/${token}" class="button">Redefinir Senha</a>
      <p>Se você não fez esta solicitação, pode ignorar este e-mail. Sua senha permanecerá segura.</p>
      <p>Atenciosamente,</p>
      <p><strong>Equipe Bueno Devs</strong></p>
    </div>
    <div class="email-footer">
      <p>Este é um e-mail automático. Por favor, não responda.</p>
    </div>
  </div>
</body>
</html>
`, // corpo do email em HTML
  })
}

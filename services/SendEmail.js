// libs imports
const nodemailer = require('nodemailer');

module.exports = async function (email, passwordToken) {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  let info = await transporter.sendMail({
    from: '"Davi Verçosa 🚀" <davi@example.com>',
    to: `${email}`,
    subject: 'Hello ✔',
    text: 'Books - Recuperação de senha',
    html: `Esse é o seu código de verificação -> <b>${passwordToken}</b>`,
  });

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

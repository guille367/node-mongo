const nodemailer = require('nodemailer');

// const options = {

// }

const sendMail = async options => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: 'Guillermo Ponce Andres <guillermo.gpa89@gmail.com>',
    to: options.to,
    subject: options.subject,
    text: options.text
  }

  await transporter.sendMail(mailOptions);
}

module.exports = sendMail;
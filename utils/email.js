const nodemailer = require('nodemailer');

// const options = {

// }

const sendMail = options => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD
    }
  });


}
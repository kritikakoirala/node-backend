const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service : 'Gmail',
  
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  }
  
});

module.exports = transporter
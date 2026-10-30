
import nodemailer from 'nodemailer';

function sendDataOnMail(reciver_mail, message) {
  var transpoter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  var details = {
    from: process.env.GMAIL_USER,
    to: reciver_mail,
    subject: 'batch ram',
    html: `
      <h1>Welcome to Wedding Management</h1>
      <p>This is a verification mail by my wedding management website</p>
      <h2>Email: ${reciver_mail} <br/> OTP: ${message}</h2>
    `
  };

  transpoter.sendMail(details, (err, result) => {
  });
}

export default sendDataOnMail;

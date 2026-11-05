import nodemailer from 'nodemailer';
async function sendDataOnMail(reciver_mail, message) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  const details = {
    from: process.env.GMAIL_USER,
    to: reciver_mail,
    subject: 'ShaadiVibes - Email Verification',
    html: `
      <h1>Welcome to ShaadiVibes</h1>
      <p>Use the OTP below to verify your email address.</p>
      <h2>OTP: ${message}</h2>
      <p>This OTP is valid for 5 minutes.</p>
    `
  };

  const result = await transporter.sendMail(details);
  return result;
}

export default sendDataOnMail;
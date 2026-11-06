
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendDataOnMail(reciver_mail, message) {
  const result = await resend.emails.send({
    from: "ShaadiVibes <onboarding@resend.dev>",
    to: reciver_mail,
    subject: "ShaadiVibes - Email Verification",
    html: `
      <h1>Welcome to ShaadiVibes</h1>
      <p>Use the OTP below to verify your email address.</p>
      <h2>OTP: ${message}</h2>
      <p>This OTP is valid for 5 minutes.</p>
    `
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result;
}

export default sendDataOnMail;

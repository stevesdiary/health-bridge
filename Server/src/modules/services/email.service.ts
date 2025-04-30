import nodemailer, { SendMailOptions, Transporter, TransportOptions } from 'nodemailer';
import { EmailPayload, EmailResponse } from '../types/type';


export async function sendEmail(emailPayload: EmailPayload): Promise<EmailResponse> {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: 587,
    // secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_KEY,
    },
  } as TransportOptions);

  const mailOptions: SendMailOptions = {
    from: process.env.SMTP_SENDER,
    to: emailPayload.to,
    subject: emailPayload.subject,
    text: emailPayload.text,
  };

  try {
    const info = await transporter.sendMail (mailOptions);
    console.log('Message sent: ', info.messageId);
    
    if (!info) {
      // console.error('Email not sent:', info);
      return {
        statusCode: 400,
        status: 'fail',
        message: 'Email not sent',
        data: null,
        accepted: [],
        response: '',
        messageId: ''
      }
    }
    return {
      statusCode: 200,
      status: 'success',
      message: 'Email sent',
      data: info.accepted || [],
      accepted: info.accepted || [],
      response: info.response || '',
      messageId: info.messageId || ''
    }
  } catch (error) {
    return {
      statusCode: 500,
      status: 'error',
      message: 'Error sending email',
      data: error,
      accepted: [],
      response: '',
      messageId: ''
    }
  }
}
export default sendEmail;

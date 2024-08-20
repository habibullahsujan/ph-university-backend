import nodemailer from 'nodemailer';
import config from '../config';

export const sendMail = async (to:string,name:string,resetLink:string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production', // Use `true` for port 465, `false` for all other ports
    auth: {
      user: 'habibsujan007@gmail.com',
      pass: 'skpj pjcd ydqz rkfk',
    },
  });
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 50px auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
      color: #fff;
      text-align: center;
      padding: 30px 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      padding: 12px 25px;
      background-color: #2575fc;
      color: #ffffff;
      text-decoration: none;
      border-radius: 25px;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }
    .button:hover {
      background-color: #1a61d1;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #aaa;
      padding: 20px;
      background-color: #f9f9f9;
      border-top: 1px solid #eaeaea;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hello ${name?name:'Mr.'},</p>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <a href="${resetLink}" class="button">Reset Password</a>
      <p>If you didn't request a password reset, please ignore this email or contact support.</p>
    </div>
    <div class="footer">
      &copy; 2024 Your Company. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

  await transporter.sendMail({
    from: 'habibsujan007@gmail.com', // sender address
    to, // list of receivers
    subject: 'Reset Password', // Subject line
    text: 'Hello world?', // plain text body
    html: htmlContent
  });
};

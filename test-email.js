require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('--- Gmail SMTP Test ---');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_TO:', process.env.EMAIL_TO);
  console.log('EMAIL_PASSWORD is set?:', Boolean(process.env.EMAIL_PASSWORD && process.env.EMAIL_PASSWORD.trim().length > 0));

  if (!process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD.trim().length === 0) {
    console.error('\n❌ ERROR: EMAIL_PASSWORD is empty in .env file!');
    console.error('Please open .env and put your 16-character Google App Password in EMAIL_PASSWORD=');
    process.exit(1);
  }

  const cleanPass = process.env.EMAIL_PASSWORD.replace(/\s+/g, '');
  console.log('Attempting to connect to Gmail with App Password length:', cleanPass.length);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: cleanPass
    }
  });

  try {
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ Connection to Gmail successful!');

    console.log('Sending test email to', process.env.EMAIL_TO, '...');
    const info = await transporter.sendMail({
      from: `"Portfolio Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: '✅ Test Message from your Portfolio Backend',
      text: 'Congratulations! Your portfolio email backend is working 100% perfectly. You will now receive all contact form messages directly in your Gmail inbox.',
      html: '<h3>🎉 Congratulations Maira!</h3><p>Your portfolio email backend is working <strong>100% perfectly</strong>.</p><p>You will now receive all client contact form messages directly here in your Gmail inbox.</p>'
    });

    console.log('🎉 SUCCESS! Test email sent successfully! MessageId:', info.messageId);
    console.log('Check your Gmail inbox (and Spam folder just in case) at:', process.env.EMAIL_TO);
  } catch (err) {
    console.error('❌ FAILED to send email:', err.message);
    if (err.message.includes('535') || err.message.includes('BadCredentials')) {
      console.error('\n👉 Why this failed: Google rejected the password.');
      console.error('Make sure you are using a 16-character Google "App Password" (not your normal Gmail login password).');
      console.error('Generate it here: https://myaccount.google.com/apppasswords');
    }
  }
}

testEmail();

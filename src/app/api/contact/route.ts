import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, firma, text, refCode } = await req.json();

    if (!name || !firma || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Configure the transporter with standard SMTP settings.
    // In production, use environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_TO
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || '"AWAKE B2B Portal" <noreply@h2-awake.de>',
      to: process.env.SMTP_TO || 'kontakt@h2-awake.de',
      subject: `Neue Kontaktanfrage (B2B Portal) von ${name}`,
      text: `
Neue Anfrage über das B2B Kontakt-Widget:

Name: ${name}
Firma: ${firma}
Ref-Code (Hidden): ${refCode || 'Nicht vorhanden'}

Nachricht:
${text}
      `,
      html: `
        <h2>Neue Anfrage über das B2B Kontakt-Widget</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Firma:</strong> ${firma}</p>
        <p><strong>Ref-Code (Hidden):</strong> ${refCode || 'Nicht vorhanden'}</p>
        <hr />
        <p><strong>Nachricht:</strong></p>
        <p>${text.replace(/\n/g, '<br />')}</p>
      `
    };

    // If SMTP_HOST is not provided, we simulate success for development
    if (!process.env.SMTP_HOST) {
      console.log('Simulating email send since SMTP_HOST is not set:');
      console.log(mailOptions.text);
      return NextResponse.json({ success: true, simulated: true });
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

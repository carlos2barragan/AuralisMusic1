import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  port: process.env.EMAIL_PORT,
  host: process.env.EMAIL_HOST,
  requireTLS: true,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendVerificationEmailMiddleware = async (req, res, next) => {
  const { email } = req.body;

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });

  const frontendUrl = process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL_PROD
    : process.env.FRONTEND_URL_LOCAL;

  const verificationLink = `${frontendUrl}/verificar/${token}`;

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Verificación de cuenta',
    html: `
      <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; text-align: center; font-family: Arial, sans-serif; border: 1px solid #ddd;">
        <h2 style="color: #B2A179;">¡Bienvenido!</h2>
        <p>Gracias por registrarte. Para activar tu cuenta, haz clic en el botón:</p>

        <a href="${verificationLink}"
          style="display: inline-block; background-color: #B2A179; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
          Verificar mi cuenta
        </a>

        <p style="color: #666; font-size: 14px;">Este enlace es válido por <strong>24 horas</strong>.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    next();
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return res.status(500).json({ error: 'Error al enviar el correo de verificación.' });
  }
};

export default sendVerificationEmailMiddleware;

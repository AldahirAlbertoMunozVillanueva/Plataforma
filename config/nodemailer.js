import nodemailer from "nodemailer";

// Configuración usando variables de entorno
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.mailtrap.io", // Cambia a tu proveedor SMTP
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "tu_usuario_smtp", // Configura las variables en un archivo .env
    pass: process.env.SMTP_PASS || "tu_contraseña_smtp",
  },
});

export default transporter;

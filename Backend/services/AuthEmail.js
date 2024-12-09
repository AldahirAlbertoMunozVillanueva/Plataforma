import transporter from "../config/nodemailer.js";

export class AuthEmail {
  static async sendConfirmationEmail(email, username, token) {
    try {
      const info = await transporter.sendMail({
        from: "Crédito Amanecer <admin@amanecer.com>",
        to: email,
        subject: "Código de verificación",
        html: `
          <p>Buen día, <b>${username}</b>,</p>
          <p>Aquí está tu código de verificación: <b>${token}</b>.</p>
          <p>Saludos,<br>El equipo de Crédito Amanecer</p>
        `,
      });

      console.log("Correo enviado:", info.messageId);
      return info;
    } catch (error) {
      console.error("Error al enviar correo:", error);
      throw new Error("No se pudo enviar el correo electrónico.");
    }
  }
}

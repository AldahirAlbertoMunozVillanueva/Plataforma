import express from "express";
import { AuthEmail } from "../services/AuthEmail"; // Ruta correcta hacia AuthEmail.js
import crypto from "crypto"; // Para generar un token único

const app = express();
app.use(express.json());

// Endpoint para enviar correos
app.post("/send-email", async (req, res) => {
  const { email, username } = req.body; // Datos del usuario

  // Generar token único
  const token = crypto.randomBytes(20).toString("hex");

  try {
    // Llamar al servicio de correo
    await AuthEmail.sendConfirmationEmail(email, username, token);
    res.status(200).json({ message: "Correo enviado exitosamente." });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ message: "Error al enviar el correo." });
  }
});

// Inicia el servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

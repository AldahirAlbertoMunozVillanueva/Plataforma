import express from 'express';
import cors from 'cors';
import sendEmail from './Email.js'; // Importa la función de envío de correo

const app = express();
const PORT = 3000; // Puerto del servidor

// Middleware
app.use(cors()); // Permite solicitudes CORS
app.use(express.json());

// Ruta para enviar correos electrónicos
app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    const info = await sendEmail(to, subject, text);
    res.status(200).send(`Email sent: ${info.response}`);
  } catch (error) {
    res.status(500).send('Error sending email');
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

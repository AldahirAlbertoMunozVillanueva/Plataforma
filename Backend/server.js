// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createTransport } from 'nodemailer'; // Cambio en la importación
import crypto from "crypto";
import supabaseAdmin from './models/supabase.js';

// Configuración de variables de entorno
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas importadas
import usersRoutes from './routes/usersRoutes.js';
import authRoutes from "./routes/authRoutes.js";
import inicioRoutes from "./routes/inicioRoutes.js";
import carteleraRoutes from "./routes/carteleraRoutes.js";
import personalRoutes from "./routes/personalRoutes.js";
import bibliotecasRoutes from "./routes/bibliotecasRoutes.js";

// Uso de rutas
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/inicio", inicioRoutes);
app.use("/api/cartelera", carteleraRoutes);
app.use("/api/personal", personalRoutes);
app.use("/api/bibliotecas", bibliotecasRoutes);

// Email Service
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email Sending Endpoint
app.post("/api/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    const token = crypto.randomBytes(20).toString("hex");
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: `${text}\nConfirmation Token: ${token}`
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ 
      message: "Email sent successfully", 
      token 
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
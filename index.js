import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000; // Puerto del servidor

// Middleware
app.use(cors()); // Permite solicitudes CORS
app.use(express.json());

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
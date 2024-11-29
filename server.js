import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SERVICE_ROLE_KEY
);

// Ruta para obtener usuarios
app.get("/api/users", async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para crear un usuario
app.post("/api/users", async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      role,
    });
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para eliminar un usuario
app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para asignar roles a un usuario
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
      role,
    });
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("Error assigning role:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

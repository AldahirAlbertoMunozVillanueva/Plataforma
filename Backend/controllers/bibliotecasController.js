// bibliotecascontroller.js
import supabaseAdmin from '../models/supabase.js';

export const getBibliotecas = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from("bibliotecas").select("*");
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching bibliotecas:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const createBiblioteca = async (req, res) => {
  const { nombre, ubicacion, horario, contacto } = req.body;
  try {
    const { data, error } = await supabaseAdmin
      .from("bibliotecas")
      .insert([{ nombre, ubicacion, horario, contacto }]);
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating biblioteca:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteBiblioteca = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabaseAdmin
      .from("bibliotecas")
      .delete()
      .eq("id", id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting biblioteca:", error.message);
    res.status(500).json({ error: error.message });
  }
};

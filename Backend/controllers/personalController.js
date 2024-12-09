import supabaseAdmin from '../models/supabase.js';

export const getPersonal = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from("personal").select("*");
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching personal:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const createPersonal = async (req, res) => {
  const { nombre, cargo, email, telefono } = req.body;
  try {
    const { data, error } = await supabaseAdmin
      .from("personal")
      .insert([{ nombre, cargo, email, telefono }]);
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating personal:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deletePersonal = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabaseAdmin.from("personal").delete().eq("id", id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting personal:", error.message);
    res.status(500).json({ error: error.message });
  }
};

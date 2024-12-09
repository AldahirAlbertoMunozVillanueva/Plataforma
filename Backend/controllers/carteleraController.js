import supabaseAdmin from '../models/supabase.js';

export const getCartelera = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from("cartelera").select("*");
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching cartelera:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const createCartelera = async (req, res) => {
  const { titulo, descripcion, fecha, imagen } = req.body;
  try {
    const { data, error } = await supabaseAdmin
      .from("cartelera")
      .insert([{ titulo, descripcion, fecha, imagen }]);
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating cartelera:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteCartelera = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabaseAdmin.from("cartelera").delete().eq("id", id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting cartelera:", error.message);
    res.status(500).json({ error: error.message });
  }
};

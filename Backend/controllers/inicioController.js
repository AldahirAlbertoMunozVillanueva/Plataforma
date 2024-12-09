export const getInicio = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("inicio")
      .select('*');

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createInicio = async (req, res) => {
  const { titulo, contenido } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from("inicio")
      .insert({ 
        titulo, 
        contenido,
        fecha_actualizacion: new Date()
      });

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

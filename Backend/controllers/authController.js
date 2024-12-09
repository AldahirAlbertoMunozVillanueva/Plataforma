import supabaseAdmin from '../models/supabase.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ error: error.message });
  }
}

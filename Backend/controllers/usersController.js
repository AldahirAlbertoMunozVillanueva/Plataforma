import supabaseAdmin from '../models/supabase.js';

export const listUsers = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { role },
    });
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
      user_metadata: { role },
    });
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("Error assigning role:", error.message);
    res.status(500).json({ error: error.message });
  }
};

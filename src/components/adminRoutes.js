const express = require('express');
const supabase = require('./supabaseAdmin');

const router = express.Router();

// Obtener todos los usuarios
router.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;

    res.status(200).json(data.users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error.message);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Eliminar un usuario por su ID
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;

    res.status(200).json({ message: `Usuario con ID ${id} eliminado correctamente` });
  } catch (error) {
    console.error('Error al eliminar usuario:', error.message);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// Asignar rol a un usuario
router.post('/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const { error } = await supabase.auth.admin.updateUserById(id, {
      user_metadata: { role },
    });
    if (error) throw error;

    res.status(200).json({ message: `Rol '${role}' asignado al usuario con ID ${id}` });
  } catch (error) {
    console.error('Error al asignar rol:', error.message);
    res.status(500).json({ error: 'Error al asignar rol' });
  }
});

module.exports = router;

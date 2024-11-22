import { useEffect, useState } from 'react';
import supabase from './supabaseClient';; // Tu cliente Supabase

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users') // Nombre de tu tabla de usuarios
        .select('id, email, role'); // Selecciona las columnas necesarias

      if (error) throw error;

      setUsers(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const { error } = await supabaseClient
        .from('users') // Tu tabla de usuarios
        .update({ role: newRole }) // Campo a actualizar
        .eq('id', userId);

      if (error) throw error;

      alert('Rol actualizado correctamente');
      fetchUsers(); // Refresca la lista
    } catch (error) {
      console.error('Error al actualizar rol:', error.message);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const { error } = await supabase
        .from('users') // Tu tabla de usuarios
        .delete()
        .eq('id', userId);

      if (error) throw error;

      alert('Usuario eliminado correctamente');
      fetchUsers(); // Refresca la lista
    } catch (error) {
      console.error('Error al eliminar usuario:', error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Rol</th>
            <th className="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="px-4 py-2 border">{user.id}</td>
              <td className="px-4 py-2 border">{user.email}</td>
              <td className="px-4 py-2 border">{user.role}</td>
              <td className="px-4 py-2 border">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => updateUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                >
                  {user.role === 'admin' ? 'Asignar Usuario' : 'Asignar Admin'}
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteUser(user.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;

import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:3001/api"; // URL de tu backend

  // Función para obtener usuarios desde el backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/users`);
      if (response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        console.error("Expected an array but got:", response.data);
        setError("La respuesta del servidor no contiene un array de usuarios.");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  // Función para crear un usuario
  const createUser = async () => {
    if (!email || !password) {
      setError("Correo electrónico y contraseña son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/users`, {
        email,
        password,
        role,
      });
      setEmail("");
      setPassword("");
      setRole("user");
      fetchUsers(); // Actualizar la lista de usuarios
    } catch (err) {
      console.error("Error creating user:", err);
      setError("No se pudo crear el usuario.");
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un usuario
  const deleteUser = async (userId) => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/users/${userId}`);
      fetchUsers(); // Actualizar la lista de usuarios
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("No se pudo eliminar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  // Función para asignar roles a un usuario
  const assignRole = async (userId, newRole) => {
    try {
      setLoading(true);
      await axios.put(`${API_BASE_URL}/users/${userId}`, {
        role: newRole,
      });
      fetchUsers(); // Actualizar la lista de usuarios
    } catch (err) {
      console.error("Error assigning role:", err);
      setError("No se pudo asignar el rol.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Crear Usuario</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 mb-2 w-full"
        >
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        <button
          onClick={createUser}
          className="bg-blue-500 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear Usuario"}
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Lista de Usuarios</h2>
        {loading ? (
          <p>Cargando usuarios...</p>
        ) : (
          <table className="border-collapse border border-gray-300 w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Rol</th>
                <th className="border border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="border border-gray-300 p-2">{user.id}</td>
                    <td className="border border-gray-300 p-2">{user.email}</td>
                    <td className="border border-gray-300 p-2">{user.role}</td>
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-500 text-white py-1 px-2 rounded mr-2"
                        disabled={loading}
                      >
                        Eliminar
                      </button>
                      <button
                        onClick={() => assignRole(user.id, "admin")}
                        className="bg-green-500 text-white py-1 px-2 rounded mr-2"
                        disabled={loading}
                      >
                        Asignar Admin
                      </button>
                      <button
                        onClick={() => assignRole(user.id, "user")}
                        className="bg-yellow-500 text-white py-1 px-2 rounded"
                        disabled={loading}
                      >
                        Asignar Usuario
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border border-gray-300 p-2">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;


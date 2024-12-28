import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from './AdminPanel';
import MainArticle from '../Inicio/MainArticle';
import { useAuth } from '../AuthContext';

const Dashboard = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir al login si no hay usuario y la carga ha terminado
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Mostrar spinner durante la carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // Si no hay usuario, retornar null (el useEffect manejará la redirección)
  if (!user) {
    return null;
  }

  // Mostrar mensaje si el usuario no tiene rol asignado
  if (!user.role) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Acceso No Disponible</h2>
        <p className="text-gray-600 text-center">
          No tienes un rol asignado. Por favor, contacta al administrador.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Bienvenido, {user.email}
        </h1>
        <p className="text-gray-600">
          Rol actual: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {isAdmin ? (
          // Panel de administrador
          <div>
            <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>
            <AdminPanel />
          </div>
        ) : (
          // Vista de usuario normal
          <div>
            <h2 className="text-2xl font-bold mb-4">Panel de Usuario</h2>
            <MainArticle />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
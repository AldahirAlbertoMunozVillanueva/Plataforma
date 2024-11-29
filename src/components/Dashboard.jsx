import { useEffect, useState } from 'react';
import AdminPanel from './AdminPanel';
import UserUpdates from './UserUpdates';
import supabase from './client';

const Dashboard = () => {
  const [userRole, setUserRole] = useState(null); // Almacena el rol del usuario
  const [user, setUser] = useState(null); // Almacena los datos del usuario
  const [loading, setLoading] = useState(true); // Controla el estado de carga

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session?.user) {
          throw new Error('No se encontró una sesión activa.');
        }

        const userData = session.user;
        const role = userData.user_metadata?.role || null; // Rol desde los metadatos
        setUser(userData); // Almacena los datos del usuario
        setUserRole(role); // Establece el rol
      } catch (error) {
        console.error('Error fetching user details:', error.message);
        setUser(null);
        setUserRole(null);
      } finally {
        setLoading(false); // Detiene el estado de carga
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    return <p>No has iniciado sesión. Por favor, inicia sesión para acceder al Dashboard.</p>;
  }

  return (
    <div>
      {userRole === 'admin' && <AdminPanel />}
      {userRole === 'user' && <UserUpdates />}
      {!userRole && <p>No tienes acceso al panel. Contacta al administrador.</p>}
    </div>
  );
};

export default Dashboard;

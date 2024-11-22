import { useEffect, useState } from 'react';
import AdminPanel from './AdminPanel';
import UserUpdates from './UserUpdates';
import supabase from './supabaseClient'; // Asegúrate de tener tu cliente de Supabase configurado

const Dashboard = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      setLoading(true);
      try {
        const { data: session } = await supabase.auth.getSession();

        if (session) {
          const { data: userData, error } = await supabase
            .from('users') // Tu tabla de usuarios
            .select('role') // Asegúrate de que esta columna exista
            .eq('id', session.user.id)
            .single();

          if (error) throw error;

          setUserRole(userData.role);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error fetching user role:', error.message);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      {userRole === 'admin' && <AdminPanel />}
      {userRole === 'user' && <UserUpdates />}
      {!userRole && <p>No tienes acceso al panel.</p>}
    </div>
  );
};

export default Dashboard;

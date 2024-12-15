import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from './AdminPanel';
import MainArticle from '../Inicio/MainArticle';
import supabase from '../client';

const Dashboard = () => {
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        // Si no hay sesión, redirigir al login
        if (sessionError || !session?.user) {
          navigate('/login');
          return;
        }

        const userData = session.user;
        const role = userData.user_metadata?.role || null;
        
        // Logs de depuración
        console.log('User Data:', userData);
        console.log('User Role:', role);

        setUser(userData);
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user details:', error.message);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    return <p>No has iniciado sesión. Por favor, inicia sesión para acceder al Dashboard.</p>;
  }

  return (
    <div>
      {userRole === 'admin' && <AdminPanel />}
      {userRole === 'user' && <MainArticle />}
      {!userRole && <p>No tienes acceso al panel. Contacta al administrador.</p>}
    </div>
  );
};

export default Dashboard;

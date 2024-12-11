import React, { createContext, useContext, useState, useEffect } from "react";
import supabase from "./client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función centralizada para obtener el rol del usuario
  const fetchUserRole = async (userInfo) => {
    try {
      // Primero verificar en metadatos del usuario
      let role = userInfo.user_metadata?.role;

      // Si no hay rol en metadatos, consultar en tabla usuarios
      if (!role) {
        const { data: userData, error } = await supabase
          .from('usuarios')
          .select('rol')
          .eq('correo', userInfo.email)
          .single();

        if (error) {
          console.error('Error verificando rol:', error);
          return 'user'; // Rol por defecto
        }

        role = userData?.rol || 'user';
      }

      return role;
    } catch (error) {
      console.error('Error en verificación de rol:', error);
      return 'user';
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
        console.warn('Tiempo de carga excedido');
      }
    }, 5000);

    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const role = await fetchUserRole(session.user);

          const userInfo = {
            id: session.user.id,
            email: session.user.email,
            role: role
          };

          setUser(userInfo);
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const role = await fetchUserRole(session.user);

          const userInfo = {
            id: session.user.id,
            email: session.user.email,
            role: role
          };

          setUser(userInfo);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      clearTimeout(timer);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAdmin,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
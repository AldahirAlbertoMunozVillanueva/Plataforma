import React, { useState } from 'react';
import supabase from './supabaseClient';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false); // Alternar entre habilitar/deshabilitar formularios
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Estados de Registro
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) throw error;
      console.log('User logged in:', data);
    } catch (error) {
      console.error('Login error:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: { name: registerName },
        },
      });
      if (error) throw error;
      alert('¡Registro exitoso! Revisa tu correo electrónico para confirmar tu cuenta.');
    } catch (error) {
      console.error('Error de registro:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200">
      <div className="flex bg-white rounded-lg shadow-lg w-3/4 overflow-hidden">
        {/* Seccion de login */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-6">Iniciar Sesión</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label>Correo:</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded"
                disabled={isRegister} // Deshabilita la entrada de correo si está en modo de registro
              />
            </div>
            <div>
              <label>Contraseña:</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded"
                disabled={isRegister} // Deshabilita la entrada de contraseña si está en modo de registro
              />
            </div>
            <button
              type="submit"
              disabled={loading || isRegister} // Deshabilitar el botón de inicio de sesión si está en modo de registro
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
            <p className="text-sm mt-4 text-gray-600">
              ¿No tienes una cuenta?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-blue-500 hover:underline"
              >
                Regístrate
              </button>
            </p>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>

        {/* Sección de registro (siempre visible, deshabilitado por defecto) */}
        <div className="w-1/2 p-8 bg-gray-100">
          <h2 className="text-2xl font-semibold mb-6">Registrarse</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label>Nombre:</label>
              <input
                type="text"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded"
                disabled={!isRegister} // Deshabilitar la entrada si no está en modo de registro
              />
            </div>
            <div>
              <label>Correo:</label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded"
                disabled={!isRegister} //Deshabilitar la entrada si no está en modo de registro
              />
            </div>
            <div>
              <label>Contraseña:</label>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded"
                disabled={!isRegister} // Deshabilitar la entrada si no está en modo de registro
              />
            </div>
            <button
              type="submit"
              disabled={loading || !isRegister} // Deshabilitar botón si no está en modo de registro
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
            <p className="text-sm mt-4 text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-blue-500 hover:underline"
              >
                Inicia sesión
              </button>
            </p>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

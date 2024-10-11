import React, { useState } from 'react';

function Login({ setAuthState }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Lógica de autenticación irá aquí en el futuro
    if (email && password) {
      console.log('Login attempt with:', email, password);
      setAuthState('home');
    } else {
      alert('Please fill in both fields');
    }
  };

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white border-2 border-gray-200 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center">Inicio de Sesion</h2>
        <div className="mt-6">
          <label className="block text-lg font-medium">Correo</label>
          <input 
            type="email" 
            className="w-full border-2 border-gray-300 p-4 mt-2 rounded-lg" 
            placeholder="Ingresa tu correo" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div className="mt-4">
          <label className="block text-lg font-medium">Contraseña</label>
          <input 
            type="password" 
            className="w-full border-2 border-gray-300 p-4 mt-2 rounded-lg" 
            placeholder="Ingresa tu contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <button 
          onClick={handleLogin}
          className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
        >
          Iniciar Sesion
        </button>
        <div className="mt-4 text-center">
          <p className="text-gray-600">
          ¿No tienes una cuenta? {' '}
            <button onClick={() => setAuthState('register')} className="text-blue-500 font-medium">
              Registrarse
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

import React, { useState } from 'react';
import  supabase  from './supabaseClient';

export default function Register({ setAuthState }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });
      
      if (error) {
        alert('Registration failed: ' + error.message);
      } else {
        setAuthState('login');
      }
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-4xl font-semibold mb-5">Agregar Nuevo Usuario</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Agregue su Nombre..."
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Correo Electronico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Agregue su correo..."
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div> 
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Agregue su contraseña..."
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

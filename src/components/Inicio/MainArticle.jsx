import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import supabase from '../client';

const MainArticle = () => {
  const [contenido, setContenido] = useState('Escribe aquí o sube una imagen...');
  const [titulo, setTitulo] = useState('');
  const [imagen, setImagen] = useState('');
  const [articulos, setArticulos] = useState([]);
  const { user } = useAuth();

  const fetchArticulos = async () => {
    try {
      // Cambiar a fetchArticulos si no hay registros
      const { count } = await supabase
        .from('inicio')
        .select('*', { count: 'exact' });

      if (count === 0) {
        // Si no hay registros, insertar datos iniciales
        await insertDatosIniciales();
      }

      // Fetch de los artículos
      const { data, error } = await supabase
        .from('inicio')
        .select('*')
        .order('fecha_actualizacion', { ascending: false });

      if (error) throw error;

      console.log('Articulos fetched:', data);
      setArticulos(data || []);
    } catch (err) {
      console.error('Error al obtener los datos:', err);
      alert('No se pudieron cargar los artículos');
    }
  };

  const insertDatosIniciales = async () => {
    try {
      const { error } = await supabase
        .from('inicio')
        .insert([
          {
            titulo: 'Bienvenido',
            contenido: 'Este es el contenido inicial de tu sitio web',
            imagen: '/path/to/default/image.jpg',
            fecha_actualizacion: new Date(),
            rol: 'admin'
          },
          {
            titulo: 'Información Importante',
            contenido: 'Aquí puedes agregar información relevante para tus usuarios',
            imagen: '/path/to/another/default/image.jpg',
            fecha_actualizacion: new Date(),
            rol: 'admin'
          }
        ]);

      if (error) throw error;
      console.log('Datos iniciales insertados con éxito');
    } catch (err) {
      console.error('Error al insertar datos iniciales:', err);
    }
  };

  useEffect(() => {
    fetchArticulos();
  }, []);

  // Detailed logging for admin check
  console.log('User object:', user);
  console.log('User role:', user?.user_metadata?.role);
  const isAdmin = user && user.user_metadata?.role === 'admin';
  console.log('Is Admin:', isAdmin);

  return (
    <div className="container mx-auto p-4">
      {isAdmin && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Contenido Principal</h2>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título"
            className="w-full p-2 mb-4 border rounded"
          />
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="Contenido"
            className="w-full p-2 mb-4 border rounded"
            rows={4}
          />
          <input
            type="text"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
            placeholder="URL de imagen (opcional)"
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Guardar
          </button>
        </div>
      )}

      {/* Rest of the component remains the same */}
    </div>
  );
};

export default MainArticle;

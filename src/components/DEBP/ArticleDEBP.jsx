import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import supabase from '../client';

const ArticleDEBP = () => {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Estado para el formulario de admin
  const [texto, setTexto] = useState('');
  const [imagen, setImagen] = useState('');
  const [ubicacion, setUbicacion] = useState('1');

  const fetchArticulos = async () => {
    try {
      setLoading(true);
      
      // Esta consulta ahora será pública gracias a las políticas de RLS
      const { data, error } = await supabase
        .from('debp')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setArticulos(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener los datos:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Verificación de rol de admin
  const isAdmin = () => {
    return user?.user_metadata?.role === 'admin';
  };

  const handleDelete = async (id) => {
    if (!isAdmin()) {
      alert('No tienes permisos para borrar');
      return;
    }

    try {
      const { error } = await supabase
        .from('debp')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Recargar artículos después de borrar
      await fetchArticulos();
      alert('Artículo borrado exitosamente');
    } catch (err) {
      console.error('Error al borrar el artículo:', err);
      alert('No se pudo borrar el artículo');
    }
  };

  const handleSave = async () => {
    if (!isAdmin()) {
      alert('No tienes permisos para guardar');
      return;
    }

    if (!texto.trim()) {
      alert('El contenido es obligatorio');
      return;
    }

    try {
      const { error } = await supabase
        .from('debp')
        .insert({
          texto,
          imagen: imagen || null,
          ubicacion,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Limpiar campos después de guardar
      setTexto('');
      setImagen('');

      // Recargar artículos
      await fetchArticulos();

      alert('Artículo guardado exitosamente');
    } catch (err) {
      console.error('Error al guardar el artículo:', err);
      alert('No se pudo guardar el artículo');
    }
  };

  const handleUpdate = async (id) => {
    if (!isAdmin()) {
      alert('No tienes permisos para actualizar');
      return;
    }

    try {
      const { error } = await supabase
        .from('debp')
        .update({
          texto,
          imagen: imagen || null,
          ubicacion,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Recargar artículos
      await fetchArticulos();
      alert('Artículo actualizado exitosamente');
    } catch (err) {
      console.error('Error al actualizar el artículo:', err);
      alert('No se pudo actualizar el artículo');
    }
  };

  useEffect(() => {
    fetchArticulos();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Formulario de guardado solo visible para admin */}
      {isAdmin() && (
        <div className="mb-6 bg-gray-100 p-4 rounded">
          <h2 className="text-2xl font-bold mb-4">Administrar Contenido DEBP</h2>
          
          <select
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          >
            <option value="1">Biblioteca 1</option>
            <option value="2">Visión</option>
            <option value="3">Redes Sociales</option>
          </select>

          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
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
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Guardar Nuevo
            </button>
            <button
              onClick={() => handleUpdate(articulos[0]?.id)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Actualizar Último
            </button>
          </div>
        </div>
      )}

      {/* Sección de artículos visible para todos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articulos.map((articulo) => (
          <div 
            key={articulo.id} 
            className="border p-4 rounded shadow-md bg-white relative"
          >
            <div dangerouslySetInnerHTML={{ __html: articulo.texto }} />
            {articulo.imagen && (
              <img 
                src={articulo.imagen} 
                alt="Imagen de artículo" 
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}
            <div className="text-sm text-gray-500">
              <span>Ubicación: {getLocationName(articulo.ubicacion)}</span>
              <span className="block">Publicado: {new Date(articulo.created_at).toLocaleDateString()}</span>
              {articulo.updated_at && articulo.updated_at !== articulo.created_at && (
                <span className="block text-xs text-gray-400">
                  Última actualización: {new Date(articulo.updated_at).toLocaleDateString()}
                </span>
              )}
              
              {/* Botón de borrar solo visible para admin */}
              {isAdmin() && (
                <button
                  onClick={() => handleDelete(articulo.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded text-xs"
                >
                  Borrar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay artículos */}
      {articulos.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No hay contenido disponible
        </div>
      )}
    </div>
  );
};

// Función auxiliar para obtener el nombre de ubicación
const getLocationName = (ubicacion) => {
  switch(ubicacion) {
    case '1': return 'Biblioteca 1';
    case '2': return 'Visión';
    case '3': return 'Redes Sociales';
    default: return 'Sin ubicación';
  }
};

export default ArticleDEBP;
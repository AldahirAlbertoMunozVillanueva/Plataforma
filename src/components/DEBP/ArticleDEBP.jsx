import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import supabase from '../client';

const ArticleDEBP = ({ selectedLocation }) => {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Estados para edición
  const [editingArticle, setEditingArticle] = useState(null);

  // Estado para el formulario de admin
  const [texto, setTexto] = useState('');
  const [imagen, setImagen] = useState('');
  const [ubicacion, setUbicacion] = useState('1');

  const fetchArticulos = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('debp')
        .select('*')
        .order('created_at', { ascending: false });

      // Si hay una ubicación seleccionada, filtrar por ella
      if (selectedLocation) {
        query = query.eq('ubicacion', selectedLocation.toString());
      }

      const { data, error } = await query;

      if (error) throw error;

      setArticulos(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener los datos:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticulos();
  }, [selectedLocation]);

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

      await fetchArticulos();
      alert('Artículo borrado exitosamente');
    } catch (err) {
      console.error('Error al borrar el artículo:', err);
      alert('No se pudo borrar el artículo');
    }
  };

  const startEditing = (articulo) => {
    if (!isAdmin()) {
      alert('No tienes permisos para editar');
      return;
    }

    setEditingArticle(articulo.id);
    setTexto(articulo.texto);
    setImagen(articulo.imagen || '');
    setUbicacion(articulo.ubicacion);
  };

  const handleUpdate = async () => {
    if (!isAdmin()) {
      alert('No tienes permisos para actualizar');
      return;
    }

    if (!texto.trim()) {
      alert('El contenido es obligatorio');
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
        .eq('id', editingArticle);

      if (error) throw error;

      // Resetear estado de edición
      setEditingArticle(null);
      setTexto('');
      setImagen('');

      // Recargar artículos
      await fetchArticulos();
      alert('Artículo actualizado exitosamente');
    } catch (err) {
      console.error('Error al actualizar el artículo:', err);
      alert('No se pudo actualizar el artículo');
    }
  };

  const cancelEditing = () => {
    setEditingArticle(null);
    setTexto('');
    setImagen('');
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articulos.map((articulo) => (
          <div 
            key={articulo.id} 
            className="border p-4 rounded shadow-md bg-white relative"
          >
            {editingArticle === articulo.id ? (
              // Modo edición
              <div>
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
                  className="w-full p-2 mb-4 border rounded"
                  rows={4}
                />

                <input
                  type="text"
                  value={imagen}
                  onChange={(e) => setImagen(e.target.value)}
                  placeholder="URL de imagen"
                  className="w-full p-2 mb-4 border rounded"
                />

                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              // Modo visualización
              <>
                <div dangerouslySetInnerHTML={{ __html: articulo.texto }} />
                {articulo.imagen && (
                  <img 
                    src={articulo.imagen} 
                    alt="Imagen de artículo" 
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                )}
                <div className="text-sm text-gray-500">
                  <span>Ubicación: {articulo.ubicacion}</span>
                  <span className="block">Publicado: {new Date(articulo.created_at).toLocaleDateString()}</span>
                  {articulo.updated_at && articulo.updated_at !== articulo.created_at && (
                    <span className="block text-xs text-gray-400">
                      Última actualización: {new Date(articulo.updated_at).toLocaleDateString()}
                    </span>
                  )}
                  
                  {/* Botones de acciones solo visibles para admin */}
                  {isAdmin() && (
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={() => startEditing(articulo)}
                        className="bg-blue-500 text-white p-1 rounded text-xs"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(articulo.id)}
                        className="bg-red-500 text-white p-1 rounded text-xs"
                      >
                        Borrar
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
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

export default ArticleDEBP;
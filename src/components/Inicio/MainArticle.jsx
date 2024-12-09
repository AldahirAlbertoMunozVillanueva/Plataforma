import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import supabase from '../client';

const MainArticle = () => {
  const [texto, setTexto] = useState('Escribe aquí o sube una imagen...');
  const [imagen, setImagen] = useState('');
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchArticulos = async () => {
    try {
      setLoading(true);
      
      // Usar la configuración de consulta pública
      const { data, error } = await supabase
        .from('inicio')
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

  const handleSave = async () => {
    // Verificación de rol de admin
    if (!isAdmin()) {
      alert('No tienes permisos para guardar');
      return;
    }

    if (!texto.trim()) {
      alert('El contenido es obligatorio');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('inicio')
        .insert({
          texto,
          imagen: imagen || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Limpiar campos después de guardar
      setTexto('Escribe aquí o sube una imagen...');
      setImagen('');

      // Recargar artículos
      await fetchArticulos();

      alert('Artículo guardado exitosamente');
    } catch (err) {
      console.error('Error al guardar el artículo:', err);
      alert('No se pudo guardar el artículo');
    }
  };

  useEffect(() => {
    fetchArticulos();
  }, []);

  // Verificación de rol de admin
  const isAdmin = () => {
    return user?.user_metadata?.role === 'admin';
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Formulario de guardado solo visible para admin */}
      {isAdmin() && (
        <div className="mb-6 bg-gray-100 p-4 rounded">
          <h2 className="text-2xl font-bold mb-4">Agregar Contenido</h2>
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
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Guardar
          </button>
        </div>
      )}

      {/* Sección de artículos visible para todos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articulos.map((articulo) => (
          <div 
            key={articulo.id} 
            className="border p-4 rounded shadow-md bg-white"
          >
            <p className="mb-3">{articulo.texto}</p>
            {articulo.imagen && (
              <img 
                src={articulo.imagen} 
                alt="Imagen de artículo" 
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}
            <div className="text-sm text-gray-500">
              <span>Publicado: {new Date(articulo.created_at).toLocaleDateString()}</span>
              {articulo.updated_at && articulo.updated_at !== articulo.created_at && (
                <span className="block text-xs text-gray-400">
                  Última actualización: {new Date(articulo.updated_at).toLocaleDateString()}
                </span>
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

export default MainArticle;
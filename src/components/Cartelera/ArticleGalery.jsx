import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import supabase from '../client';

const ArticleGalery = () => {
  const [texto, setTexto] = useState('Escribe aquí o sube una imagen...');
  const [imagen, setImagen] = useState('');
  const [imagenFile, setImagenFile] = useState(null);
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAdmin } = useAuth();

  const fetchArticulos = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('cartelera')
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenFile(file);
      setImagen(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imagenFile) return null;

    try {
      const fileExt = imagenFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('imagen')
        .upload(filePath, imagenFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('imagen').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      alert('No se pudo subir la imagen');
      return null;
    }
  };

  const handleSave = async () => {
    // Verificar si el usuario es admin
    if (!isAdmin) {
      alert('Solo los administradores pueden guardar contenido');
      return;
    }

    if (!texto.trim()) {
      alert('El contenido es obligatorio');
      return;
    }

    try {
      const imageUrl = imagenFile ? await uploadImage() : imagen;

      const articleData = {
        texto,
        imagen: imageUrl || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('cartelera')
        .insert(articleData);

      if (error) {
        console.error('Detalles del error:', error);
        throw error;
      }

      // Limpiar campos después de guardar
      setTexto('Escribe aquí o sube una imagen...');
      setImagen('');
      setImagenFile(null);

      // Recargar artículos
      await fetchArticulos();

      alert('Artículo guardado exitosamente');
    } catch (err) {
      console.error('Error al guardar el artículo:', err);
      alert('No se pudo guardar el artículo');
    }
  };

  const handleDelete = async (id) => {
    // Verificar si el usuario es admin
    if (!isAdmin) {
      alert('Solo los administradores pueden eliminar contenido');
      return;
    }

    try {
      const { error } = await supabase
        .from('cartelera')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchArticulos();
      alert('Artículo eliminado exitosamente');
    } catch (err) {
      console.error('Error al eliminar el artículo:', err);
      alert('No se pudo eliminar el artículo');
    }
  };

  useEffect(() => {
    fetchArticulos();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Formulario de guardado solo visible para administradores */}
      {isAdmin && (
        <div className="mb-6 bg-gray-100 p-4 rounded">
          <h2 className="text-2xl font-bold mb-4">Agregar Contenido</h2>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Contenido"
            className="w-full p-2 mb-4 border rounded"
            rows={4}
          />
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border rounded"
            />
            {imagen && (
              <img 
                src={imagen} 
                alt="Vista previa" 
                className="mt-2 h-40 object-cover rounded"
              />
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Guardar
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
            </div>
            {isAdmin && (
              <div className="absolute top-2 right-2">
                <button 
                  onClick={() => handleDelete(articulo.id)}
                  className="bg-red-500 text-white p-1 rounded text-xs"
                >
                  Eliminar
                </button>
              </div>
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

export default ArticleGalery;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import supabase from '../client';

const ArticleDEBP = ({ selectedLocation }) => {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useAuth();

  // Estados para el formulario de admin
  const [texto, setTexto] = useState('');
  const [imagen, setImagen] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [imagenFile, setImagenFile] = useState(null);

  // Nuevo estado para edición
  const [editingArticle, setEditingArticle] = useState(null);

  const fetchArticulos = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('debp')
        .select('*')
        .order('created_at', { ascending: false });

      // Si hay una ubicación seleccionada, filtrar por ella
      if (selectedLocation) {
        query = query.eq('ubicacion', selectedLocation);
      }

      const { data, error } = await query;

      console.log('Query de búsqueda de artículos:', query);
      console.log('Datos recuperados:', data);
      console.log('Error en recuperación:', error);

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
  }, [selectedLocation, isAdmin]);

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
    if (!isAdmin) {
      alert('No tienes permisos para guardar');
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
        imagen: imageUrl || imagen,
        ubicacion: ubicacion.trim() || null
      };

      console.log('Datos a actualizar:', articleData);

      if (editingArticle) {
        // Actualizar artículo existente
        const { error } = await supabase
          .from('debp')
          .update(articleData)
          .eq('id', editingArticle.id);

        if (error) {
          console.error('Error en la actualización:', error);
          throw error;
        }
      } else {
        // Crear nuevo artículo
        articleData.created_at = new Date().toISOString();
        const { error } = await supabase
          .from('debp')
          .insert(articleData);

        if (error) {
          console.error('Error en la inserción:', error);
          throw error;
        }
      }

      // Forzar refresco de datos
      await fetchArticulos();

      // Limpiar campos después de guardar
      setTexto('');
      setImagen('');
      setImagenFile(null);
      setUbicacion('');
      setEditingArticle(null);

      alert(editingArticle ? 'Artículo actualizado exitosamente' : 'Artículo guardado exitosamente');
    } catch (err) {
      console.error('Error detallado:', err);
      alert(`No se pudo ${editingArticle ? 'actualizar' : 'guardar'} el artículo: ${err.message}`);
    }
  };

  const handleEdit = (articulo) => {
    if (!isAdmin) {
      alert('No tienes permisos para editar');
      return;
    }

    setEditingArticle(articulo);
    // Asegúrate de mantener la imagen original
    setTexto(articulo.texto || '');
    setImagen(articulo.imagen || ''); // Mantén la imagen original
    setUbicacion(articulo.ubicacion || '');
    setImagenFile(null); // Resetea el archivo de imagen
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      alert('No tienes permisos para eliminar');
      return;
    }

    try {
      const { error } = await supabase
        .from('debp')
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

  const handleCancel = () => {
    setEditingArticle(null);
    setTexto('');
    setImagen('');
    setImagenFile(null);
    setUbicacion('');
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Formulario de guardado solo visible para admin */}
      {isAdmin && (
        <div className="mb-6 bg-gray-100 p-4 rounded">
          <h2 className="text-2xl font-bold mb-4">
            {editingArticle ? 'Editar Artículo' : 'Agregar Nuevo Artículo'}
          </h2>

          <textarea
            value={texto || ''} // Asegurarse de que siempre sea una cadena
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Contenido del artículo"
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

          {/* Input de ubicación */}
          <div className="mb-4">
            <label htmlFor="ubicacion" className="block mb-2">Ubicación</label>
            <input
              type="text"
              id="ubicacion"
              value={ubicacion || ''} // Asegurarse de que siempre sea una cadena
              onChange={(e) => setUbicacion(e.target.value)}
              placeholder="Ingrese la ubicación"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editingArticle ? 'Actualizar' : 'Guardar'}
            </button>
            {editingArticle && (
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            )}
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
            <div className="text-sm text-gray-500 mb-2">
              {articulo.ubicacion && (
                <span className="block">Ubicación: {articulo.ubicacion}</span>
              )}
              <span>Publicado: {new Date(articulo.created_at).toLocaleDateString()}</span>
            </div>
            {isAdmin && (
              <div className="absolute top-2 right-2 flex space-x-2">
                <button 
                  onClick={() => handleEdit(articulo)}
                  className="bg-yellow-500 text-white p-1 rounded text-xs"
                >
                  Editar
                </button>
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

export default ArticleDEBP;
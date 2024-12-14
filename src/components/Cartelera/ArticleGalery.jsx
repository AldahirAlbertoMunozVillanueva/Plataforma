import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import supabase from '../client';

const ArticleGalery = () => {
  const [texto, setTexto] = useState('Escribe aquí o sube imágenes...');
  const [imagenes, setImagenes] = useState([]);
  const [imagenesFiles, setImagenesFiles] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageInfo, setSelectedImageInfo] = useState(null);
  const { user, isAdmin } = useAuth();

  const fetchArticulos = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('cartelera')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Parse imagen column to handle multiple images
      const parsedArticulos = data.map(articulo => ({
        ...articulo,
        imagenes: articulo.imagen ? articulo.imagen.split(',') : []
      }));

      setArticulos(parsedArticulos || []);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener los datos:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImageUrls = files.map(file => URL.createObjectURL(file));
    
    setImagenesFiles(prev => [...prev, ...files]);
    setImagenes(prev => [...prev, ...newImageUrls]);
  };

  const uploadImages = async () => {
    if (imagenesFiles.length === 0) return null;

    try {
      const uploadPromises = imagenesFiles.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('imagen')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage.from('imagen').getPublicUrl(filePath);
        return data.publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      return uploadedUrls.join(',');
    } catch (error) {
      console.error('Error subiendo imágenes:', error);
      alert('No se pudieron subir las imágenes');
      return null;
    }
  };

  const handleSave = async () => {
    if (!isAdmin) {
      alert('Solo los administradores pueden guardar contenido');
      return;
    }

    if (!texto.trim()) {
      alert('El contenido es obligatorio');
      return;
    }

    try {
      const imageUrls = imagenesFiles.length ? await uploadImages() : null;

      const articleData = {
        texto,
        imagen: imageUrls,
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
      setTexto('Escribe aquí o sube imágenes...');
      setImagenes([]);
      setImagenesFiles([]);

      // Recargar artículos
      await fetchArticulos();

      alert('Artículo guardado exitosamente');
    } catch (err) {
      console.error('Error al guardar el artículo:', err);
      alert('No se pudo guardar el artículo');
    }
  };

  const handleDelete = async (id) => {
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

  const openImageModal = (articulo, index) => {
    setSelectedImageInfo({
      images: articulo.imagenes,
      currentIndex: index
    });
  };

  const closeImageModal = () => {
    setSelectedImageInfo(null);
  };

  const navigateImage = (direction) => {
    if (!selectedImageInfo) return;

    const { images, currentIndex } = selectedImageInfo;
    const newIndex = 
      direction === 'next' 
        ? (currentIndex + 1) % images.length 
        : (currentIndex - 1 + images.length) % images.length;
    
    setSelectedImageInfo(prev => ({
      ...prev,
      currentIndex: newIndex
    }));
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
              multiple
              onChange={handleImageUpload}
              className="w-full p-2 border rounded"
            />
            {imagenes.length > 0 && (
              <div className="flex space-x-2 mt-2 overflow-x-auto">
                {imagenes.map((imagen, index) => (
                  <img 
                    key={index}
                    src={imagen} 
                    alt={`Vista previa ${index + 1}`} 
                    className="h-20 w-20 object-cover rounded cursor-pointer"
                    onClick={() => {
                      // Use local images for newly uploaded images
                      setSelectedImageInfo({
                        images: imagenes,
                        currentIndex: index
                      });
                    }}
                  />
                ))}
              </div>
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
            {articulo.imagenes.length > 0 && (
              <div className="flex space-x-2 overflow-x-auto">
                {articulo.imagenes.map((imagen, index) => (
                  <img 
                    key={index}
                    src={imagen} 
                    alt={`Imagen ${index + 1}`} 
                    className="w-24 h-24 object-cover rounded cursor-pointer"
                    onClick={() => openImageModal(articulo, index)}
                  />
                ))}
              </div>
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

      {/* Modal para imagen ampliada */}
      {selectedImageInfo && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={closeImageModal}
        >
          <div 
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImageInfo.images[selectedImageInfo.currentIndex]} 
              alt="Imagen ampliada" 
              className="max-w-full max-h-[80vh] object-contain"
            />
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full"
            >
              &lt;
            </button>
            <button
              onClick={() => navigateImage('next')}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full"
            >
              &gt;
            </button>
            <button
              onClick={closeImageModal}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleGalery;
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
  const [imagenes, setImagenes] = useState([]);
  const [ubicacion, setUbicacion] = useState('');
  const [imageFiles, setImageFiles] = useState([]);

  // Estados para lightbox
  const [lightboxImages, setLightboxImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const fetchArticulos = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('debp')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedLocation) {
        query = query.eq('ubicacion', selectedLocation);
      }

      const { data, error } = await query;

      if (error) throw error;

      const processedArticulos = data.map(articulo => {
        const imagenes = articulo.imagen ? 
          (articulo.imagen.includes(',') ? 
            articulo.imagen.split(',').map(url => url.trim()) : 
            [articulo.imagen]) : 
          [];
        
        return {
          ...articulo,
          imagenes
        };
      });

      setArticulos(processedArticulos || []);
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
    const files = Array.from(e.target.files);
    const newImageUrls = files.map(file => URL.createObjectURL(file));
    
    setImageFiles(prevFiles => [...prevFiles, ...files]);
    setImagenes(prevImages => [...prevImages, ...newImageUrls]);
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];

    try {
      const uploadPromises = imageFiles.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('imagen')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error for file:', file, uploadError);
          throw uploadError;
        }

        const { data } = supabase.storage.from('imagen').getPublicUrl(filePath);
        return data.publicUrl;
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error subiendo imágenes:', error);
      alert('No se pudieron subir todas las imágenes');
      return [];
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
      const imageUrls = await uploadImages();

      const articleData = {
        texto,
        imagen: imageUrls.join(','),
        ubicacion: ubicacion.trim() || null,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('debp')
        .insert(articleData);

      if (error) throw error;

      await fetchArticulos();

      setTexto('');
      setImagenes([]);
      setImageFiles([]);
      setUbicacion('');

      alert('Artículo guardado exitosamente');
    } catch (err) {
      console.error('Error detallado completo:', err);
      alert(`No se pudo guardar el artículo: ${JSON.stringify(err)}`);
    }
  };

  const openLightbox = (images, startIndex = 0) => {
    setLightboxImages(images);
    setCurrentImageIndex(startIndex);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const navigateLightbox = (direction) => {
    const newIndex = (currentImageIndex + direction + lightboxImages.length) % lightboxImages.length;
    setCurrentImageIndex(newIndex);
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

  // Lightbox component
  const Lightbox = () => {
    if (!isLightboxOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
        <div className="relative max-w-4xl max-h-[90vh] flex items-center">
          <button 
            onClick={closeLightbox}
            className="absolute top-2 right-2 text-white text-3xl z-60"
          >
            &times;
          </button>

          {lightboxImages.length > 1 && (
            <button 
              onClick={() => navigateLightbox(-1)}
              className="absolute left-2 text-white text-4xl z-60 bg-black bg-opacity-50 rounded-full p-2"
            >
              &#10094;
            </button>
          )}

          <img 
            src={lightboxImages[currentImageIndex]} 
            alt={`Imagen ${currentImageIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain"
          />

          {lightboxImages.length > 1 && (
            <button 
              onClick={() => navigateLightbox(1)}
              className="absolute right-2 text-white text-4xl z-60 bg-black bg-opacity-50 rounded-full p-2"
            >
              &#10095;
            </button>
          )}

          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded">
            {currentImageIndex + 1} / {lightboxImages.length}
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      {isLightboxOpen && <Lightbox />}

      {isAdmin && (
        <div className="mb-6 bg-gray-100 p-4 rounded">
          <h2 className="text-2xl font-bold mb-4">Agregar Nuevo Artículo</h2>

          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Contenido del artículo"
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
              <div className="flex flex-wrap mt-2 space-x-2">
                {imagenes.map((imagen, index) => (
                  <img 
                    key={index}
                    src={imagen} 
                    alt={`Vista previa ${index + 1}`} 
                    className="h-20 w-20 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="ubicacion" className="block mb-2">Ubicación</label>
            <input
              type="text"
              id="ubicacion"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              placeholder="Ingrese la ubicación"
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Guardar
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articulos.map((articulo) => (
          <div 
            key={articulo.id} 
            className="border p-4 rounded shadow-md bg-white relative"
          >
            <p className="mb-3">{articulo.texto}</p>
            {articulo.imagenes && articulo.imagenes.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {articulo.imagenes.map((imagen, index) => (
                  <img 
                    key={index}
                    src={imagen} 
                    alt={`Imagen de artículo ${index + 1}`} 
                    className="h-20 w-20 object-cover rounded cursor-pointer"
                    onClick={() => openLightbox(articulo.imagenes, index)}
                  />
                ))}
              </div>
            )}
            <div className="text-sm text-gray-500 mb-2">
              {articulo.ubicacion && (
                <span className="block">Ubicación: {articulo.ubicacion}</span>
              )}
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

      {articulos.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No hay contenido disponible
        </div>
      )}
    </div>
  );
};

export default ArticleDEBP;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import supabase from '../client';

const MainArticle = () => {
  const [texto, setTexto] = useState('Escribe aquí o sube una imagen...');
  const [imagenes, setImagenes] = useState([]);
  const [imagenesFiles, setImagenesFiles] = useState([]);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentArticleImages, setCurrentArticleImages] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAdmin } = useAuth();

  const fetchArticulos = async () => {
    try {
      setLoading(true);
      
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    
    setImagenesFiles(files);
    setImagenes(imageUrls);
  };

  const uploadImages = async () => {
    const uploadedImageUrls = [];

    for (const imagenFile of imagenesFiles) {
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
        uploadedImageUrls.push(data.publicUrl);
      } catch (error) {
        console.error('Error subiendo imagen:', error);
      }
    }

    return uploadedImageUrls.length > 0 ? uploadedImageUrls : null;
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
      const imageUrls = imagenesFiles.length ? await uploadImages() : [];

      const articleData = {
        texto,
        imagen: imageUrls && imageUrls.length ? imageUrls.join(',') : null,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('inicio')
        .insert(articleData);

      if (error) {
        console.error('Detalles del error:', error);
        throw error;
      }

      // Limpiar campos después de guardar
      setTexto('Escribe aquí o sube una imagen...');
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
      alert('No tienes permisos para eliminar');
      return;
    }

    try {
      const { error } = await supabase
        .from('inicio')
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

  // Función para manejar el clic en la imagen
  const handleImageClick = (images) => {
    setCurrentArticleImages(images.split(','));
    setCurrentImageIndex(0);
    setEnlargedImage(images.split(',')[0]);
  };

  // Función para avanzar imagen
  const nextImage = (e) => {
    e.stopPropagation();
    const nextIndex = (currentImageIndex + 1) % currentArticleImages.length;
    setCurrentImageIndex(nextIndex);
    setEnlargedImage(currentArticleImages[nextIndex]);
  };

  // Función para retroceder imagen
  const prevImage = (e) => {
    e.stopPropagation();
    const prevIndex = (currentImageIndex - 1 + currentArticleImages.length) % currentArticleImages.length;
    setCurrentImageIndex(prevIndex);
    setEnlargedImage(currentArticleImages[prevIndex]);
  };

  useEffect(() => {
    fetchArticulos();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Formulario de guardado solo visible para admin */}
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
              <div className="grid grid-cols-3 gap-2 mt-2">
                {imagenes.map((imagen, index) => (
                  <img 
                    key={index}
                    src={imagen} 
                    alt={`Vista previa ${index + 1}`} 
                    className="h-24 w-full object-cover rounded"
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
            {articulo.imagen && articulo.imagen.split(',').map((imagen, index) => (
              <img 
                key={index}
                src={imagen} 
                alt={`Imagen de artículo ${index + 1}`} 
                onClick={() => handleImageClick(articulo.imagen)}
                className="w-full h-48 object-cover rounded mb-3 cursor-pointer"
              />
            ))}
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
      {enlargedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={() => {
            setEnlargedImage(null);
            setCurrentArticleImages([]);
          }}
        >
          <div className="relative max-w-4xl max-h-screen">
            {/* Botón de retroceder */}
            {currentArticleImages.length > 1 && (
              <button 
                onClick={prevImage}
                className="absolute left-[-50px] top-1/2 transform -translate-y-1/2 bg-white/50 rounded-full p-2 hover:bg-white/75"
              >
                ◀
              </button>
            )}

            <img 
              src={enlargedImage} 
              alt="Imagen ampliada" 
              className="max-w-full max-h-screen object-contain"
            />

            {/* Botón de avanzar */}
            {currentArticleImages.length > 1 && (
              <button 
                onClick={nextImage}
                className="absolute right-[-50px] top-1/2 transform -translate-y-1/2 bg-white/50 rounded-full p-2 hover:bg-white/75"
              >
                ▶
              </button>
            )}

            {/* Contador de imágenes */}
            {currentArticleImages.length > 1 && (
              <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-white/50 px-2 py-1 rounded">
                {currentImageIndex + 1} / {currentArticleImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainArticle;
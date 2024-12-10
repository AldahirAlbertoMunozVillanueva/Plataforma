import React, { useEffect, useRef, useState } from "react";
import { useAuth } from '../AuthContext';
import supabase from '../client';

export const ArticleGalery = () => {
  // Estado para el carrusel de imágenes
  const listRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageData, setImageData] = useState([]);

  // Estado para el contenido de texto y edición
  const [texto, setTexto] = useState('Escribe aquí o sube una imagen...');
  const [imagen, setImagen] = useState('');
  const [cartelera, setCartelera] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Efectos para el carrusel
  useEffect(() => {
    const listNode = listRef.current;
    const imgNode = listNode?.querySelectorAll("li")[currentIndex];

    if (imgNode) {
      imgNode.scrollIntoView({
        behavior: "smooth",
        inline: "center"
      });
    }
  }, [currentIndex]);

  // Funciones para el carrusel
  const scrollToImage = (direction) => {
    if (direction === 'prev') {
      setCurrentIndex(curr => (curr === 0 ? 0 : curr - 1));
    } else {
      setCurrentIndex(curr => (curr === imageData.length - 1 ? curr : curr + 1));
    }
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  // Manejo de archivos para el carrusel
  const handleFileChange = (event) => {
    const files = event.target.files;
    const newImageUrls = Array.from(files).map(file => URL.createObjectURL(file));
    
    // Si estamos editando, combinar con imágenes existentes
    if (editingItem) {
      const existingImages = editingItem.imagen ? editingItem.imagen.split(',') : [];
      setImagen([...existingImages, ...newImageUrls].join(','));
    } else {
      // Para nueva entrada
      setImagen(newImageUrls.join(','));
    }

    setImageData(newImageUrls.map(url => ({ imgUrl: url })));
  };

  // Funciones para manejo de datos de cartelera
  const fetchCartelera = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('cartelera')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCartelera(data || []);
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

  // Iniciar edición de un item
  const startEditing = (item) => {
    setEditingItem(item);
    setTexto(item.texto);
    setImagen(item.imagen || '');
    
    // Preparar imágenes para el carrusel si hay
    if (item.imagen) {
      const imageUrls = item.imagen.split(',');
      setImageData(imageUrls.map(url => ({ imgUrl: url })));
      setCurrentIndex(0);
    }
  };

  // Guardar contenido de cartelera
  const handleSave = async () => {
    // Verificación de rol de admin
    if (!isAdmin()) {
      alert('No tienes permisos para guardar');
      return;
    }

    // Validar contenido de texto
    if (!texto.trim()) {
      alert('El contenido es obligatorio');
      return;
    }

    try {
      if (editingItem) {
        // Actualizar entrada existente
        const { error } = await supabase
          .from('cartelera')
          .update({
            texto,
            imagen: imagen || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        // Insertar nueva entrada
        const { error } = await supabase
          .from('cartelera')
          .insert({
            texto,
            imagen: imagen || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      // Limpiar campos
      setTexto('Escribe aquí o sube una imagen...');
      setImagen('');
      setImageData([]);
      setEditingItem(null);

      // Recargar cartelera
      await fetchCartelera();

      alert('Entrada de cartelera guardada exitosamente');
    } catch (err) {
      console.error('Error al guardar la entrada de cartelera:', err);
      alert('No se pudo guardar la entrada');
    }
  };

  // Eliminar imagen del carrusel
  const removeImage = (indexToRemove) => {
    const updatedImages = imageData.filter((_, index) => index !== indexToRemove);
    setImageData(updatedImages);

    const updatedImageUrls = updatedImages.map(img => img.imgUrl);
    setImagen(updatedImageUrls.join(','));

    // Ajustar el índice actual si es necesario
    if (currentIndex >= updatedImages.length) {
      setCurrentIndex(updatedImages.length - 1);
    }
  };

  // Efecto inicial para cargar datos
  useEffect(() => {
    fetchCartelera();
  }, []);

  // Renderizado de componente
  return (
    <div className="container mx-auto p-4">
      {/* Carrusel de imágenes */}
      <div className="w-full max-w-lg mx-auto mb-6">
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleFileChange} 
          className="mb-4"
        />
        {imageData.length > 0 && (
          <div className="relative h-64">
            <div 
              className="absolute top-1/2 left-4 transform -translate-y-1/2 text-4xl font-bold text-white cursor-pointer z-10" 
              onClick={() => scrollToImage('prev')}
            >
              &#10092;
            </div>
            <div 
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-4xl font-bold text-white cursor-pointer z-10" 
              onClick={() => scrollToImage('next')}
            >
              &#10093;
            </div>
            <div className="w-full h-full rounded-lg overflow-hidden border border-gray-300 relative">
              <ul ref={listRef} className="flex transition-transform duration-300" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {imageData.map((item, index) => (
                  <li key={index} className="flex-shrink-0 w-full relative">
                    <img src={item.imgUrl} alt={`Slide ${index}`} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center mt-2">
              {imageData.map((_, idx) => (
                <div
                  key={idx}
                  className={`mx-1 cursor-pointer text-sm ${idx === currentIndex ? "bg-gray-400 w-4 h-4 rounded-full" : "bg-gray-200 w-3 h-3 rounded-full"}`}
                  onClick={() => goToSlide(idx)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Formulario de guardado solo visible para admin */}
      {isAdmin() && (
        <div className="mb-6 bg-gray-100 p-4 rounded">
          <h2 className="text-2xl font-bold mb-4">
            {editingItem ? 'Editar Entrada de Cartelera' : 'Agregar Contenido de Cartelera'}
          </h2>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Contenido"
            className="w-full p-2 mb-4 border rounded"
            rows={4}
          />
          <div className="flex space-x-2 mb-4">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editingItem ? 'Actualizar' : 'Guardar'}
            </button>
            {editingItem && (
              <button
                onClick={() => {
                  setEditingItem(null);
                  setTexto('Escribe aquí o sube una imagen...');
                  setImagen('');
                  setImageData([]);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sección de cartelera visible para todos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cartelera.map((item) => (
          <div 
            key={item.id} 
            className="border p-4 rounded shadow-md bg-white relative"
          >
            {isAdmin() && (
              <button
                onClick={() => startEditing(item)}
                className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded text-xs"
              >
                Editar
              </button>
            )}
            <p className="mb-3">{item.texto}</p>
            {item.imagen && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {item.imagen.split(',').map((img, index) => (
                  <img 
                    key={index}
                    src={img} 
                    alt={`Imagen ${index + 1}`} 
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>
            )}
            <div className="text-sm text-gray-500">
              <span>Publicado: {new Date(item.created_at).toLocaleDateString()}</span>
              {item.updated_at && item.updated_at !== item.created_at && (
                <span className="block text-xs text-gray-400">
                  Última actualización: {new Date(item.updated_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay entradas */}
      {cartelera.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No hay contenido disponible en la cartelera
        </div>
      )}
    </div>
  );
};

export default ArticleGalery;
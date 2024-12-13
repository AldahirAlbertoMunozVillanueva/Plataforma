import React, { useState, useEffect } from 'react';
import { NavBar } from './NavBar';
import { useAuth } from '../AuthContext';
import supabase from '../client';

export const Header = () => {
  const { isAdmin } = useAuth();
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedLogos, setSavedLogos] = useState([]);

  // Cargar logos guardados al iniciar
  useEffect(() => {
    const fetchSavedLogos = async () => {
      try {
        const { data, error } = await supabase
          .from('configuracion')
          .select('logos')
          .single();

        if (error) throw error;

        // Parsear de JSON a array, manejar caso de null o undefined
        const parsedLogos = data.logos ? JSON.parse(data.logos) : [];
        setSavedLogos(parsedLogos);
      } catch (error) {
        console.error('Error al recuperar los logos:', error);
      }
    };

    fetchSavedLogos();
  }, []);

  const handleImageUpload = async (event) => {
    if (!isAdmin) {
      alert('Solo los administradores pueden subir imágenes');
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    // Validaciones adicionales
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      alert('Solo se permiten archivos JPG, PNG o SVG');
      return;
    }

    if (file.size > maxSize) {
      alert('El tamaño máximo del archivo es 5MB');
      return;
    }

    // Limitar a 2 logos
    if (selectedImages.length >= 2) {
      alert('Solo se pueden subir un máximo de 2 logos');
      return;
    }

    const img = new Image();
    img.onload = async () => {
      if (img.width !== 123 || img.height !== 75) {
        alert('La imagen debe tener exactamente 123x75 píxeles');
        return;
      }

      setIsLoading(true);

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `logo_${Date.now()}.${fileExt}`;
        const filePath = `imagen/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('imagen')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl }, error: urlError } = supabase.storage
          .from('imagen')
          .getPublicUrl(filePath);

        if (urlError) {
          throw urlError;
        }

        // Agregar imagen a la lista de imágenes seleccionadas
        setSelectedImages(prev => [...prev, publicUrl]);
        alert('Imagen subida exitosamente');
      } catch (error) {
        console.error('Error en la subida de imagen:', error);
        alert(`Error: ${JSON.stringify(error)}`);
      } finally {
        setIsLoading(false);
      }
    };

    img.onerror = () => {
      alert('Error al cargar la imagen. Intenta con otro archivo.');
    };

    img.src = URL.createObjectURL(file);
  };

  const handleSaveLogos = async () => {
    if (selectedImages.length === 0) {
      alert('No hay imágenes para guardar');
      return;
    }

    try {
      // Convertir el array de URLs a JSON
      const { error } = await supabase
        .from('configuracion')
        .update({ logos: JSON.stringify(selectedImages) })
        .eq('id', 1);

      if (error) throw error;

      // Actualizar estado local
      setSavedLogos(selectedImages);
      setSelectedImages([]);
      alert('Logos guardados exitosamente');
    } catch (error) {
      console.error('Error al guardar los logos:', error);
      alert(`Error al guardar: ${JSON.stringify(error)}`);
    }
  };

  const handleDeleteLogo = async (logoToDelete) => {
    try {
      // Extraer el nombre del archivo de la URL de Supabase
      const fileName = logoToDelete.split('/').pop();
      const filePath = `imagen/${fileName}`;

      // Eliminar del storage
      const { error: storageError } = await supabase.storage
        .from('imagen')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Si es un logo guardado, eliminarlo de la tabla de configuración
      const updatedSavedLogos = savedLogos.filter(logo => logo !== logoToDelete);
      
      const { error: dbError } = await supabase
        .from('configuracion')
        .update({ logos: JSON.stringify(updatedSavedLogos) })
        .eq('id', 1);

      if (dbError) throw dbError;

      // Si es una imagen seleccionada
      const updatedSelectedImages = selectedImages.filter(logo => logo !== logoToDelete);

      setSavedLogos(updatedSavedLogos);
      setSelectedImages(updatedSelectedImages);

      alert('Logo eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar el logo:', error);
      alert(`Error al eliminar: ${JSON.stringify(error)}`);
    }
  };

  return (
    <header className="flex place-content-between items-center mb-14 bg-red-950">
      {/* Logos principales */}
      <div className="flex space-x-4">
        {savedLogos.length > 0 ? (
          savedLogos.map((savedLogo, index) => (
            <img 
              key={index}
              src={savedLogo} 
              alt={`Logo ${index + 1}`} 
              className="w-[123px] h-[75px]" 
            />
          ))
        ) : (
          <p className="text-white">Sin logo configurado</p>
        )}
      </div>
      
      {isAdmin && (
        <div className="flex items-center space-x-4">
          {/* Input para subir imagen */}
          <input 
            type="file" 
            accept="image/jpeg,image/png,image/svg+xml" 
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            disabled={isLoading || selectedImages.length >= 2}
          />
          <label 
            htmlFor="image-upload" 
            className={`
              cursor-pointer 
              px-4 py-2 
              rounded 
              ${isLoading || selectedImages.length >= 2
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
              }
            `}
          >
            {isLoading ? 'Subiendo...' : 'Subir Imagen'}
          </label>

          {/* Imágenes seleccionadas */}
          <div className="flex space-x-2">
            {selectedImages.map((image, index) => (
              <div key={index} className="flex items-center space-x-2">
                <img 
                  src={image} 
                  alt={`Imagen seleccionada ${index + 1}`} 
                  className="w-[123px] h-[75px]"
                />
                <button
                  onClick={() => handleDeleteLogo(image)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            ))}

            {selectedImages.length > 0 && (
              <button
                onClick={handleSaveLogos}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Guardar Logos
              </button>
            )}
          </div>
        </div>
      )}
      
      <NavBar />
    </header>
  );
};
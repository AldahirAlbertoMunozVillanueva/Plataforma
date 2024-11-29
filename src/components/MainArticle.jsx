import { useState } from 'react';
import { Edicion } from './Edicion';
import supabase from './client'; // Asegúrate de que la ruta es correcta
import { v4 as uuidv4 } from 'uuid'; // Importa la librería para generar UUIDs

export const MainArticle = () => {
  const [contenido, setContenido] = useState('<p>Escribe aquí o sube una imagen...</p>');
  const [titulo, setTitulo] = useState(''); // Añade un estado para el título

  const handleSave = async () => {
    try {
      const { data, error } = await supabase
        .from('inicio') // Nombre de la tabla en Supabase
        .upsert([
          {
            id: uuidv4(), // Genera un UUID válido
            titulo, // Incluye el título
            contenido,
          },
        ]);
      
      if (error) {
        console.error("Error al guardar los datos:", error.message);
      } else {
        console.log("Datos guardados exitosamente:", data);
      }
    } catch (err) {
      console.error("Error al intentar guardar:", err.message);
    }
  };

  return (
    <section className="p-4">
      <div className="w-full mt-4">
        <h3 className="text-xl font-semibold mb-2">Contenido Principal</h3>
        <input 
          type="text" 
          value={titulo} 
          onChange={(e) => setTitulo(e.target.value)} 
          placeholder="Título" 
          className="w-full p-2 mb-4 border rounded"
        />
        <Edicion contenido={contenido} setContenido={setContenido} />
      </div>
      
      <button 
        onClick={handleSave} 
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Guardar
      </button>
    </section>
  );
};

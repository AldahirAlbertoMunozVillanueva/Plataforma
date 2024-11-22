import { useState } from 'react';
import { Edicion } from './Edicion';
import supabase from './supabaseClient';

export const MainArticle = () => {
  const [imageDesktop, setImageDesktop] = useState('<p>Escribe aquí o sube una imagen...</p>');
  const [contenedor1, setContenedor1] = useState("Escribe texto aquí");
  const [contenedor2, setContenedor2] = useState("Escribe texto aquí");
  const [contenedor3, setContenedor3] = useState("Escribe texto aquí");
  const [contenedor4, setContenedor4] = useState("Escribe texto aquí");
  const [contenedor5, setContenedor5] = useState("Escribe texto aquí");
  const [contenedor6, setContenedor6] = useState("Escribe texto aquí");

  const handleSave = async () => {
    try {
      const { data, error } = await supabase
        .from('inicio') // Nombre de la tabla en Supabase
        .upsert([
          {
            id: 1, // Cambia este valor según corresponda
            imageDesktop,
            contenedor1,
            contenedor2,
            contenedor3,
            contenedor4,
            contenedor5,
            contenedor6,
          },
        ]);
      
      if (error) {
        console.error("Error al guardar los datos:", error);
      } else {
        console.log("Datos guardados exitosamente:", data);
      }
    } catch (err) {
      console.error("Error al intentar guardar:", err);
    }
  };

  return (
    <section>
      <picture>
        <div className="w-full mt-4">
          <h3 className="text-xl font-semibold mb-2">Imagen para dispositivos de escritorio</h3>
          <Edicion content={imageDesktop} setContent={setImageDesktop} />
        </div>
      </picture>

      <div className="sm:flex my-6">
        <div className="flex-1 py-6">
          <Edicion content={contenedor4} setContent={setContenedor4} />
        </div>
        <div className="flex-1 pt-6 px-4">
          <Edicion content={contenedor1} setContent={setContenedor1} />
        </div>
      </div>

      <div className="sm:flex my-6">
        <div className="flex-1 py-6">
          <Edicion content={contenedor5} setContent={setContenedor5} />
        </div>
        <div className="flex-1 pt-6 px-4">
          <Edicion content={contenedor2} setContent={setContenedor2} />
        </div>
      </div>

      <div className="sm:flex my-6">
        <div className="flex-1 py-6">
          <Edicion content={contenedor6} setContent={setContenedor6} />
        </div>
        <div className="flex-1 pt-6 px-4">
          <Edicion content={contenedor3} setContent={setContenedor3} />
        </div>
      </div>
      
      <button 
        onClick={handleSave} 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Guardar
      </button>
    </section>
  );
};

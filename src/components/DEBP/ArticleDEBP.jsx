import React, { useState } from 'react';
import { Edicion } from '../Edicion';

export const ArticleDEBP = ({ selectedLocation }) => {
  const [contenido, setContenido] = useState({
    1: '<h2 class="text-[40px] leading-none font-bold sm:text-[58px]">Biblioteca 1</h2><p>debe de mostrar los datos de la biblioteca 1</p>',
    2: '<h2 class="text-[40px] leading-none font-bold sm:text-[58px]">Visión</h2><p>debe de mostrar los datos de visión</p>',
    default: '<h2 class="text-[40px] leading-none font-bold sm:text-[58px]">Visitanos en redes sociales</h2><p>debe de mostrar los datos de cómo visitar en redes sociales</p>',
  });

  const [currentContent, setCurrentContent] = useState(contenido[selectedLocation] || contenido.default);

  const handleSave = () => {
    setContenido({ ...contenido, [selectedLocation]: currentContent });
    alert('Contenido guardado');
  };

  const renderContent = () => {
    return (
      <div dangerouslySetInnerHTML={{ __html: contenido[selectedLocation] || contenido.default }} />
    );
  };

  return (
    <section>
      <Edicion contenido={currentContent} setContenido={setCurrentContent} />
      <button onClick={handleSave} className="p-2 bg-blue-500 text-white rounded-md mb-4">Guardar</button>
      {renderContent()}
    </section>
  );
};

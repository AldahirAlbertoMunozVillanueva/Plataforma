import React, { useState } from 'react';
import MapContainer from '../DEBP/CampecheMap';
import ArticleDEBP from '../DEBP/ArticleDEBP';

export const DEBP = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleSelectLocation = (id) => {
    setSelectedLocation(id);
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold text-center my-4">Mapa Interactivo de la Red Estatal de Bibliotecas</h1>
      <MapContainer onSelectLocation={handleSelectLocation} />
      <ArticleDEBP selectedLocation={selectedLocation} />
    </div>
  );
};
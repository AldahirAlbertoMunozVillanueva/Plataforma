import React, { useState } from 'react';
import { MapContainer } from '../DEBP/MapContainer';
import { ArticleDEBP } from '../DEBP/ArticleDEBP';

export const DEBP = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleSelectLocation = (id) => {
    setSelectedLocation(id);
  };

  return (
    <div>
      <h1>Esto es la página DEBP</h1>
      <div className="flex">
        <MapContainer onSelectLocation={handleSelectLocation} />
        <ArticleDEBP selectedLocation={selectedLocation} />
      </div>
    </div>
  );
};

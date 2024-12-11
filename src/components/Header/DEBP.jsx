import React, { useState } from 'react';
import MapContainer from '../DEBP/CampecheMap';
import ArticleDEBP from '../DEBP/ArticleDEBP';

export const DEBP = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleSelectLocation = (id) => {
    setSelectedLocation(id);
  };

  return (
    <div className="flex flex-col"> {/* Cambia flex a flex-col */}
      <MapContainer onSelectLocation={handleSelectLocation} />
      <ArticleDEBP selectedLocation={selectedLocation} />
    </div>
  );
};
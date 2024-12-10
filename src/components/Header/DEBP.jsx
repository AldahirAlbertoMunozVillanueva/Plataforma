import React, { useState } from 'react';
import MapContainer from '../DEBP/CampecheMap';
import ArticleDEBP from '../DEBP/ArticleDEBP';

export const DEBP = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleSelectLocation = (id) => {
    setSelectedLocation(id);
  };

  return (
    <div>
      <div className="flex">
        <MapContainer onSelectLocation={handleSelectLocation} />
        <ArticleDEBP selectedLocation={selectedLocation} />
      </div>
    </div>
  );
};
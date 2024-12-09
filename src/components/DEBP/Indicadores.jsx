import React from 'react';

export const Indicadores = ({ locations, onClick }) => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      {locations.map((location, index) => (
        <button
          key={index}
          className="p-2 bg-blue-500 text-white rounded"
          onClick={() => onClick(location.id)}
        >
          Indicador {location.id}
        </button>
      ))}
    </div>
  );
};

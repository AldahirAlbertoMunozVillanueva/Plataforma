import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// IMPORTANTE: Reemplazar con tu token de Mapbox
mapboxgl.accessToken = 'tu_token_mapbox_aqui';

const CampecheMap = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // Inicializar mapa centrado en Campeche
    const initializeMap = () => {
      const mapInstance = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-90.5322, 19.8438], // Coordenadas de Campeche
        zoom: 8,
        maxBounds: [
          [-92.5, 18.5], // Límites suroeste de Campeche
          [-89.0, 20.5]  // Límites noreste de Campeche
        ]
      });

      mapInstance.on('load', () => {
        setMap(mapInstance);
      });
    };

    initializeMap();
  }, []);

  const addMarker = (address, type) => {
    // Aquí iría la geocodificación de la dirección
    // Por simplicidad, usaremos coordenadas directas como ejemplo
    const geocodeAddress = async () => {
      try {
        // En un escenario real, usarías un servicio de geocodificación
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}&country=MX&bbox=-92.5,18.5,-89.0,20.5}`);
        const data = await response.json();
        
        if (data.features.length > 0) {
          const [longitude, latitude] = data.features[0].center;
          
          const markerColor = type === 'green' ? '#00FF00' : '#FF0000';
          
          const marker = new mapboxgl.Marker({ color: markerColor })
            .setLngLat([longitude, latitude])
            .addTo(map);
          
          setMarkers(prevMarkers => [...prevMarkers, {
            address,
            type,
            marker
          }]);
        }
      } catch (error) {
        console.error('Error al geocodificar:', error);
      }
    };

    geocodeAddress();
  };

  return (
    <div className="w-full h-[600px] relative">
      <div 
        id="map" 
        className="absolute top-0 left-0 w-full h-full"
      />
      <div className="absolute top-2 right-2 z-10 bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Añadir Marcador</h3>
        <input 
          type="text" 
          placeholder="Dirección en Campeche"
          className="w-full mb-2 p-1 border"
          id="addressInput"
        />
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              const address = document.getElementById('addressInput').value;
              addMarker(address, 'green');
            }}
            className="bg-green-500 text-white p-2 rounded"
          >
            Marcar Verde
          </button>
          <button 
            onClick={() => {
              const address = document.getElementById('addressInput').value;
              addMarker(address, 'red');
            }}
            className="bg-red-500 text-white p-2 rounded"
          >
            Marcar Rojo
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampecheMap;
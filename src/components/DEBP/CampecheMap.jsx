import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import supabase from '../client';
import { useAuth } from '../AuthContext';

// IMPORTANTE: Reemplazar con tu token de Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoibGVpcm8iLCJhIjoiY200aHg5ODdhMGJmejJqcHZmdDJndXB3YyJ9.orkZpOAkn5ImDi-Rbu51Vg';

const CampecheMap = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const { user } = useAuth();
  const [address, setAddress] = useState('');

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

  const geocodeAddress = async (address, type) => {
    // Verificar que el usuario sea admin
    if (user?.user_metadata?.role !== 'admin') {
      alert('Solo los administradores pueden añadir marcadores');
      return;
    }

    try {
      // Mejorar la geocodificación añadiendo más contexto
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address + ', Campeche, México')}.json?` +
        `access_token=${mapboxgl.accessToken}` +
        `&country=MX` +
        `&types=address` +
        `&limit=1`
      );
      
      const data = await response.json();
      
      if (data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        const formattedAddress = data.features[0].place_name;
        
        const markerColor = type === 'green' ? '#00FF00' : '#FF0000';
        
        // Crear marcador
        const marker = new mapboxgl.Marker({ color: markerColor })
          .setLngLat([longitude, latitude])
          .addTo(map);

        // Crear popup con dirección
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<p>${formattedAddress}</p>`);
        
        marker.setPopup(popup);

        // Guardar ubicación en Supabase
        const { error } = await supabase
          .from('debp')
          .insert({
            texto: formattedAddress,
            ubicacion: type === 'green' ? '1' : '2',
            imagen: null,
            created_at: new Date().toISOString(),
            longitude,
            latitude
          });

        if (error) throw error;

        // Centrar mapa en el marcador
        map.flyTo({
          center: [longitude, latitude],
          zoom: 15
        });

        setMarkers(prevMarkers => [...prevMarkers, {
          address: formattedAddress,
          type,
          marker,
          longitude,
          latitude
        }]);

        alert('Marcador añadido y guardado exitosamente');
        
        // Limpiar input
        setAddress('');
      } else {
        alert('No se pudo encontrar la dirección. Verifica que sea una dirección válida en Campeche.');
      }
    } catch (error) {
      console.error('Error al geocodificar o guardar:', error);
      alert('No se pudo añadir el marcador');
    }
  };

  const handleAddMarker = (type) => {
    if (address.trim()) {
      geocodeAddress(address, type);
    } else {
      alert('Por favor ingresa una dirección');
    }
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
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className="flex space-x-2">
          <button
            onClick={() => handleAddMarker('green')}
            className="bg-green-500 text-white p-2 rounded"
          >
            Marcar Verde
          </button>
          <button
            onClick={() => handleAddMarker('red')}
            className="bg-red-500 text-white p-2 rounded"
          >
            Marcar Rojo
          </button>
        </div>
        {markers.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold">Marcadores:</h4>
            <ul className="text-sm">
              {markers.map((marker, index) => (
                <li key={index} className={marker.type === 'green' ? 'text-green-600' : 'text-red-600'}>
                  {marker.address}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampecheMap;
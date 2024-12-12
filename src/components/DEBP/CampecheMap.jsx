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
  const [publicMarkers, setPublicMarkers] = useState([]);
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [editingMarker, setEditingMarker] = useState(null);

  // Coordenadas para cubrir todo el estado de Campeche
  const CAMPECHE_BOUNDS = {
    southwest: [-92.5, 18.2], // Punto más al suroeste
    northeast: [-89.0, 20.8]  // Punto más al noreste
  };

  // Coordenada central del estado de Campeche
  const CAMPECHE_CENTER = [-90.5322, 19.5438];

  // Cargar marcadores públicos al inicializar
  useEffect(() => {
    const fetchPublicMarkers = async () => {
      try {
        const { data, error } = await supabase
          .from('debp')
          .select('*')
          .like('ubicacion', '%location_type:public%');

        if (error) throw error;

        // Filtrar solo marcadores con coordenadas válidas dentro de Campeche
        const validMarkers = data.filter(marker => {
          const lng = parseFloat(marker.longitude);
          const lat = parseFloat(marker.latitude);
          
          return (
            !isNaN(lng) && !isNaN(lat) &&
            lng >= CAMPECHE_BOUNDS.southwest[0] &&
            lng <= CAMPECHE_BOUNDS.northeast[0] &&
            lat >= CAMPECHE_BOUNDS.southwest[1] &&
            lat <= CAMPECHE_BOUNDS.northeast[1]
          );
        });

        setPublicMarkers(validMarkers);
      } catch (error) {
        console.error('Error al cargar marcadores públicos:', error);
      }
    };

    fetchPublicMarkers();
  }, []);

  useEffect(() => {
    const initializeMap = () => {
      const mapInstance = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: CAMPECHE_CENTER,
        zoom: 7, // Zoom para mostrar todo el estado
        maxBounds: [
          CAMPECHE_BOUNDS.southwest,
          CAMPECHE_BOUNDS.northeast
        ]
      });
      
      mapInstance.on('load', () => {
        setMap(mapInstance);

        // Añadir marcadores públicos al mapa
        publicMarkers.forEach(marker => {
          // Validar coordenadas antes de crear marcador
          const lng = parseFloat(marker.longitude);
          const lat = parseFloat(marker.latitude);

          if (!isNaN(lng) && !isNaN(lat)) {
            new mapboxgl.Marker({ color: '#0000FF' })
              .setLngLat([lng, lat])
              .setPopup(new mapboxgl.Popup().setHTML(`
                <p>${marker.texto.split(' | ')[0]}</p>
                <small>Lat: ${lat}, Lng: ${lng}</small>
              `))
              .addTo(mapInstance);
          }
        });

        // Ajustar vista si hay marcadores
        if (publicMarkers.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          publicMarkers.forEach(marker => {
            const lng = parseFloat(marker.longitude);
            const lat = parseFloat(marker.latitude);
            if (!isNaN(lng) && !isNaN(lat)) {
              bounds.extend([lng, lat]);
            }
          });
          mapInstance.fitBounds(bounds, { 
            padding: 50,
            maxZoom: 10 // Limitar zoom máximo para no acercarse demasiado
          });
        }
      });
    };
    
    initializeMap();
  }, [publicMarkers]);

  const geocodeAddress = async (address, type) => {
    if (user?.role !== 'admin') {
      alert('Solo los administradores pueden añadir marcadores');
      return;
    }

    try {
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
        
        // Verificar que la coordenada esté dentro de Campeche
        if (
          longitude >= CAMPECHE_BOUNDS.southwest[0] &&
          longitude <= CAMPECHE_BOUNDS.northeast[0] &&
          latitude >= CAMPECHE_BOUNDS.southwest[1] &&
          latitude <= CAMPECHE_BOUNDS.northeast[1]
        ) {
          const markerColor = type === 'green' ? '#00FF00' : '#FF0000';
          
          const marker = new mapboxgl.Marker({ color: markerColor })
            .setLngLat([longitude, latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`<p>${formattedAddress}</p>`))
            .addTo(map);

          // Guardar ubicación con información de tipo en el texto
          const { data: insertedData, error: insertError } = await supabase
            .from('debp')
            .insert({
              ubicacion: `${formattedAddress} | location_type:${type}`,
              created_at: new Date().toISOString(),
              longitude: longitude.toString(),
              latitude: latitude.toString()
            })
            .select(); // Retorna los datos insertados

          if (insertError) throw insertError;

          // Si la inserción es exitosa, añadir al estado de marcadores
          setMarkers(prevMarkers => [...prevMarkers, {
            id: insertedData[0].id, // Guardar el ID de Supabase
            address: formattedAddress,
            type,
            marker,
            longitude: longitude.toString(),
            latitude: latitude.toString()
          }]);

          alert('Marcador añadido y guardado');
          setAddress('');
        } else {
          alert('La dirección no está dentro del estado de Campeche');
        }
      } else {
        alert('No se pudo encontrar la dirección. Verifica que sea una dirección válida en Campeche.');
      }
    } catch (error) {
      console.error('Error al geocodificar o guardar:', error);
      alert('No se pudo añadir el marcador');
    }
  };

  const handlePublicMarker = async (marker) => {
    if (user?.role !== 'admin') {
      alert('Solo los administradores pueden hacer públicos los marcadores');
      return;
    }

    try {
      // Validación detallada de coordenadas
      const lng = parseFloat(marker.longitude);
      const lat = parseFloat(marker.latitude);

      // Verificaciones exhaustivas
      if (isNaN(lng) || isNaN(lat)) {
        console.error('Coordenadas inválidas:', { 
          longitude: marker.longitude, 
          latitude: marker.latitude 
        });
        alert('Error: Coordenadas inválidas');
        return;
      }

      // Verificar límites de Campeche
      if (
        lng < CAMPECHE_BOUNDS.southwest[0] || 
        lng > CAMPECHE_BOUNDS.northeast[0] ||
        lat < CAMPECHE_BOUNDS.southwest[1] || 
        lat > CAMPECHE_BOUNDS.northeast[1]
      ) {
        console.error('Coordenadas fuera de los límites de Campeche:', { lng, lat });
        alert('El marcador está fuera de los límites de Campeche');
        return;
      }

      // Actualizar marcador a público
      const { error, data } = await supabase
        .from('debp')
        .update({ 
          ubicacion: `${marker.address} | location_type:public`,
          longitude: lng.toString(),
          latitude: lat.toString()
        })
        .eq('id', marker.id)
        .select();

      if (error) throw error;

      // Crear marcador público en el mapa con validación adicional
      if (!isNaN(lng) && !isNaN(lat)) {
        new mapboxgl.Marker({ color: '#0000FF' })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <p>${marker.address}</p>
            <small>Lat: ${lat}, Lng: ${lng}</small>
          `))
          .addTo(map);
      } else {
        console.error('No se puede crear marcador - coordenadas inválidas');
        alert('No se puede crear el marcador - coordenadas inválidas');
        return;
      }

      // Actualizar estado de marcadores
      setMarkers(prevMarkers => 
        prevMarkers.filter(m => m.id !== marker.id)
      );

      // Actualizar marcadores públicos
      const { data: publicData } = await supabase
        .from('debp')
        .select('*')
        .like('ubicacion', '%location_type:public%');

      // Filtrar marcadores válidos
      const validPublicMarkers = publicData.filter(m => 
        !isNaN(parseFloat(m.longitude)) && 
        !isNaN(parseFloat(m.latitude))
      );

      setPublicMarkers(validPublicMarkers);

      alert('Marcador publicado exitosamente');
    } catch (error) {
      console.error('Error al publicar marcador:', error);
      alert('No se pudo publicar el marcador');
    }
  };

  const handleAddMarker = (type) => {
    if (user?.role !== 'admin') {
      alert('Solo los administradores pueden añadir marcadores');
      return;
    }

    if (address.trim()) {
      setSelectedType(type);
      geocodeAddress(address, type);
    } else {
      alert('Por favor ingresa una dirección');
    }
  };

  const handleEditMarker = async () => {
    if (!editingMarker || !user || user.role !== 'admin') {
      alert('No tienes permisos para editar marcadores');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('debp')
        .update({
          ubicacion: `${editingMarker.newAddress} | ${editingMarker.texto.split(' | ')[1]}`,
          longitude: editingMarker.newLongitude.toString(),
          latitude: editingMarker.newLatitude.toString()
        })
        .eq('id', editingMarker.id);

      if (error) throw error;

      // Actualizar marcadores públicos
      const updatedPublicMarkers = publicMarkers.map(marker => 
        marker.id === editingMarker.id 
          ? { 
              ...marker, 
              ubicacion: `${editingMarker.newAddress} | ${marker.texto.split(' | ')[1]}`,
              longitude: editingMarker.newLongitude.toString(),
              latitude: editingMarker.newLatitude.toString()
            } 
          : marker
      );

      setPublicMarkers(updatedPublicMarkers);

      // Actualizar mapa
      map.getSource('markers')?.setData({
        type: 'FeatureCollection',
        features: updatedPublicMarkers.map(marker => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [
              parseFloat(marker.longitude), 
              parseFloat(marker.latitude)
            ]
          },
          properties: { 
            texto: marker.texto 
          }
        }))
      });

      alert('Marcador editado exitosamente');
      setEditingMarker(null);
    } catch (error) {
      console.error('Error al editar marcador:', error);
      alert('No se pudo editar el marcador');
    }
  };

  return (
    <div className="w-full h-[600px] relative">
      <div 
        id="map"
        className="absolute top-0 left-0 w-full h-full"
      />
      {/* Información pública de disponibilidad de marcadores */}
      <div className="absolute top-2 left-2 z-10 bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Estado de Marcadores</h3>
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 bg-green-500 mr-2"></div>
          <span className="text-green-600">Marcadores Verdes: Disponibles</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 mr-2"></div>
          <span className="text-red-600">Marcadores Rojos: No disponibles por el momento</span>
        </div>
      </div>

      {/* Modal de Edición de Marcador */}
      {editingMarker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Editar Marcador</h2>
            <input
              type="text"
              placeholder="Nueva dirección"
              className="w-full mb-2 p-2 border"
              value={editingMarker.newAddress}
              onChange={(e) => setEditingMarker({
                ...editingMarker,
                newAddress: e.target.value
              })}
            />
            <input
              type="number"
              placeholder="Longitud"
              className="w-full mb-2 p-2 border"
              value={editingMarker.newLongitude}
              onChange={(e) => setEditingMarker({
                ...editingMarker,
                newLongitude: parseFloat(e.target.value)
              })}
            />
            <input
              type="number"
              placeholder="Latitud"
              className="w-full mb-2 p-2 border"
              value={editingMarker.newLatitude}
              onChange={(e) => setEditingMarker({
                ...editingMarker,
                newLongitude: parseFloat(e.target.value)
              })}
            />
            <input
              type="number"
              placeholder="Latitud"
              className="w-full mb-2 p-2 border"
              value={editingMarker.newLatitude}
              onChange={(e) => setEditingMarker({
                ...editingMarker,
                newLatitude: parseFloat(e.target.value)
              })}
            />
            <div className="flex justify-between">
              <button 
                onClick={handleEditMarker}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Guardar Cambios
              </button>
              <button 
                onClick={() => setEditingMarker(null)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resto del código anterior: sección de añadir marcadores, lista de marcadores */}
      {user?.role === 'admin' && (
        <div className="absolute top-2 right-2 z-10 bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Añadir Marcador</h3>
          <input
            type="text"
            placeholder="Dirección en Campeche"
            className="w-full mb-2 p-1 border"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className="flex space-x-2 mb-2">
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

          {/* Lista de marcadores con opción de hacer públicos y editar */}
          {markers.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Marcadores Añadidos:</h4>
              <ul className="text-sm">
                {markers.map((marker, index) => (
                  <li 
                    key={marker.id} 
                    className={`flex justify-between items-center ${marker.type === 'green' ? 'text-green-600' : 'text-red-600'} mb-2`}
                  >
                    <span>{marker.address}</span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handlePublicMarker(marker)}
                        className="bg-blue-500 text-white text-xs p-1 rounded"
                      >
                        Hacer Público
                      </button>
                      <button
                        onClick={() => setEditingMarker({
                          id: marker.id,
                          newAddress: marker.address,
                          newLongitude: parseFloat(marker.longitude),
                          newLatitude: parseFloat(marker.latitude)
                        })}
                        className="bg-yellow-500 text-white text-xs p-1 rounded"
                      >
                        Editar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CampecheMap;
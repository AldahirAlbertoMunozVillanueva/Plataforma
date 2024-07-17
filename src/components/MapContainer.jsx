import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls, ScaleLine } from 'ol/control';

export const MapContainer = () => {
  const mapElement = useRef();
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return; // Si el mapa ya existe, no lo reinicialices

    mapRef.current = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([-90.32, 19.47]),
        zoom: 8,
        extent: [
          ...fromLonLat([-92.47, 17.67]),
          ...fromLonLat([-88.22, 20.93]),
        ],
      }),
      controls: defaultControls().extend([new ScaleLine()]),
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(null);
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.updateSize();
    }
  }, []);

  return (
    <div className="flex justify-end w-full"> {/* Cambio aquí */}
      <div className="w-[640px]"> {/* Contenedor del mapa */}
        <div ref={mapElement} className="w-full h-[400px]"></div>
      </div>
    </div>
  );
};
import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import { Indicadores } from './Indicadores';

export const MapContainer = ({ onSelectLocation }) => {
  const mapElement = useRef();
  const mapRef = useRef(null);
  const [locations, setLocations] = useState([
    { id: 1, position: [19.47, -90.32] },
    { id: 2, position: [19.50, -90.35] },
  ]);

  useEffect(() => {
    if (mapRef.current) return;

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
    <div className="flex w-full">
      <Indicadores locations={locations} onClick={onSelectLocation} />
      <div className="flex-1">
        <div ref={mapElement} className="w-full h-[400px] relative"></div>
      </div>
    </div>
  );
};

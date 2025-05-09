import React from 'react';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapComponentProps {
  longitude?: number;
  latitude?: number;
  zoom?: number;
  width?: string;
  height?: string;
  mapStyle?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  longitude = -122.4,
  latitude = 37.8,
  zoom = 14,
  width = '100vw',
  height = '50vh',
  mapStyle = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
}) => {
  return (
    <Map
      initialViewState={{
        longitude,
        latitude,
        zoom
      }}
      style={{ width, height }}
      mapStyle={mapStyle}
    />
  );
};

export default MapComponent;

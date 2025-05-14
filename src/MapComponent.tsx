import React, { useRef, useEffect, useState } from 'react';
import maplibregl, { Map, Marker, NavigationControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Define types for map state and markers
interface MapState {
  lng: number;
  lat: number;
  zoom: number;
}

interface MarkerData {
  lng: string;
  lat: string;
  marker: Marker;
}

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const [mapState, setMapState] = useState<MapState>({
    lng: -115.16643, // The Venetian
    lat: 36.12107,
    zoom: 16,
  });
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // Initialize map only once

    // Test the style URL fetch manually
    fetch('https://tiles.openfreemap.org/styles/liberty', { method: 'GET' })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch style: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(style => {
        console.log('Style JSON fetched successfully:', style);

        try {
          map.current = new maplibregl.Map({
            container: mapContainer.current!,
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: [mapState.lng, mapState.lat],
            zoom: mapState.zoom,
          });

          // Add navigation controls
          map.current.addControl(new NavigationControl());

          // Log when map is fully loaded
          map.current.on('load', () => {
            console.log('Map fully loaded');
            setMapInitialized(true);

            // Apply custom styles
            if (map.current) {
              // Background
              map.current.setPaintProperty('background', 'background-color', '#f0f4f8');

              // Water (ocean)
              map.current.setPaintProperty('water', 'fill-color', '#4a90e2');

              // Roads
              const roadLayers = map.current.getStyle().layers
                .filter(layer => layer.id.includes('road') || layer.id.includes('motorway') || layer.id.includes('secondary') || layer.id.includes('tertiary'))
                .map(layer => layer.id);

              roadLayers.forEach(layer => {
                if (map.current) {
                  map.current.setPaintProperty(layer, 'line-color', '#ff6b6b');
                  map.current.setPaintProperty(layer, 'line-width', 2);
                  map.current.setPaintProperty(layer, 'line-dasharray', [2, 2]);
                }
              });

              // Labels
              const labelLayers = map.current.getStyle().layers
                .filter(layer => layer.id.includes('label') && layer.id.includes('place'))
                .map(layer => layer.id);

              labelLayers.forEach(layer => {
                if (map.current) {
                  map.current.setPaintProperty(layer, 'text-color', '#333');
                  map.current.setPaintProperty(layer, 'text-halo-color', '#fff');
                  map.current.setPaintProperty(layer, 'text-halo-width', 1);
                }
              });
            }
          });

          // Detailed error logging
          map.current.on('error', (e) => {
            console.error('MapLibre error:', e);
            setError('MapLibre error: ' + JSON.stringify(e));
          });

          map.current.on('sourcedataerror', (e) => {
            console.error('Source data error:', e);
            setError('Source data error: ' + JSON.stringify(e));
          });

          map.current.on('tileload', (e) => {
            console.log('Tile loaded:', e);
          });

          map.current.on('sourcedataloading', (e) => {
            console.log('Source data loading:', e);
          });

          // Update state on map move
          map.current.on('move', () => {
            if (map.current) {
              setMapState({
                lng: Number(map.current.getCenter().lng.toFixed(4)),
                lat: Number(map.current.getCenter().lat.toFixed(4)),
                zoom: Number(map.current.getZoom().toFixed(2)),
              });
            }
          });

          // Add custom marker on click
          map.current.on('click', (e: maplibregl.MapMouseEvent) => {
            const { lng, lat } = e.lngLat;

            const markerElement = document.createElement('div');
            markerElement.style.backgroundColor = '#2ecc71'; // Green marker
            markerElement.style.width = '12px';
            markerElement.style.height = '12px';
            markerElement.style.borderRadius = '50%';
            markerElement.style.border = '2px solid #fff';

            const marker = new maplibregl.Marker({ element: markerElement })
              .setLngLat([lng, lat])
              .addTo(map.current!);

            setMarkers((prev) => [
              ...prev,
              { lng: lng.toFixed(4), lat: lat.toFixed(4), marker },
            ]);
          });

          // Force map to resize
          setTimeout(() => {
            if (map.current) {
              map.current.resize();
              console.log('Map resized to force render');
            }
          }, 100);
        } catch (error) {
          console.error('Failed to initialize map:', error);
          setError('Failed to initialize map: ' + String(error));
        }
      })
      .catch(error => {
        console.error('Failed to fetch style JSON:', error);
        setError('Failed to fetch style JSON: ' + String(error));
      });

    return () => {
      if (map.current) {
        map.current.remove(); // Clean up
      }
    };
  }, []);

  return (
    <div>
      <div
        ref={mapContainer}
        style={{ width: '100%', height: '600px' }}
      />
      <div>
        <h3>Map State</h3>
        <p>Longitude: {mapState.lng}</p>
        <p>Latitude: {mapState.lat}</p>
        <p>Zoom: {mapState.zoom}</p>
      </div>
      <div>
        <h3>Markers</h3>
        <ul>
          {markers.map((marker, index) => (
            <li key={index}>
              Marker {index + 1}: ({marker.lat}, {marker.lng})
            </li>
          ))}
        </ul>
      </div>
      {!mapInitialized && !error && <p>Loading map...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default MapComponent;
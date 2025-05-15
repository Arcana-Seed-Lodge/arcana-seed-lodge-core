import React, { useRef, useEffect, useState } from 'react';
import maplibregl, { Map, Marker, AttributionControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapOptions } from 'react-map-gl/mapbox';

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
  const mapTilerKey = 'lhlGVte7aCUtTfVIhH9R	'; // Replace with your MapTiler API key
  const darkMatterStyleUrl = `https://api.maptiler.com/maps/darkmatter/style.json?key=${mapTilerKey}`;
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

    const initializeMap = (style: string | object) => {
      try {
        map.current = new maplibregl.Map({
          container: mapContainer.current!,
          style: darkMatterStyleUrl, // Use MapTiler's Dark Matter style
          center: [mapState.lng, mapState.lat],
          zoom: mapState.zoom,
          bearing: 0,
          pitch: 0,
          maxPitch: 0,
          minPitch: 0,
          dragRotate: false,
          doubleClickZoom: false,
          touchZoomRotate: false,
          keyboard: false,
          attributionControl: false,
        } as MapOptions);

        // Add navigation controls
        map.current.addControl(new AttributionControl({
          customAttribution: []
        }));


        // Log when map is fully loaded
        map.current.on('load', () => {
          console.log('Map fully loaded');
          setMapInitialized(true);

          // Apply custom styles
          if (map.current) {
            // Country borders
            const borderLayers = map.current.getStyle().layers
              .filter(layer => 
                layer.id.includes('boundary_1') || 
                layer.id.includes('boundary_2') || 
                layer.id.includes('boundary_disputed') ||
                layer.id.includes('boundary_country') || 
                layer.id.includes('boundary_state')
              )
              .map(layer => layer.id);

            borderLayers.forEach(layer => {
              if (map.current) {
                map.current.setPaintProperty(layer, 'line-color', '#F98029'); // Orange country borders
                // Optionally adjust line width for better visibility
                map.current.setPaintProperty(layer, 'line-width', [
                  'interpolate', ['linear'], ['zoom'],
                  3, 1,  // Thinner at low zoom
                  12, 3  // Thicker at high zoom
                ]);
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
    };

    // Use MapTiler's Dark Matter style
    

    fetch(darkMatterStyleUrl, { method: 'GET' })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch style: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(style => {
        console.log('Style JSON fetched successfully:', style);
        initializeMap(darkMatterStyleUrl);
      })
      .catch(error => {
        console.error('Failed to fetch Dark Matter style:', error);
        setError('Failed to fetch Dark Matter style: ' + String(error));
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
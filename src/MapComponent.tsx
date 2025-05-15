import React, { useRef, useEffect, useState } from 'react';
import maplibregl, { Map, Marker, AttributionControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapOptions } from 'react-map-gl/mapbox';
import * as ngeohash from 'ngeohash';

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
  const mapTilerKey = 'lhlGVte7aCUtTfVIhH9R'; // Replace with your MapTiler API key
  const darkMatterStyleUrl = `https://api.maptiler.com/maps/darkmatter/style.json?key=${mapTilerKey}`;
  const fallbackStyle = 'https://demotiles.maplibre.org/style.json'; // Fallback style
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const initializedRef = useRef<boolean>(false); // Ref to track initialization
  const [mapState, setMapState] = useState<MapState>({
    lng: -115.16643, // The Venetian
    lat: 36.12107,
    zoom: 16,
  });
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const textMarkerRef = useRef<Marker | null>(null);

  // Log state changes
  useEffect(() => {
    console.log('mapInitialized state changed:', mapInitialized);
  }, [mapInitialized]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // Initialize map only once

    const initializeMap = (style: string) => {
      try {
        console.log('Initializing map with style:', style);
        map.current = new maplibregl.Map({
          container: mapContainer.current!,
          style,
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

        map.current.addControl(
          new AttributionControl({
            customAttribution: [],
          })
        );

        map.current.on('load', () => {
          console.log('Map fully loaded, map.current:', !!map.current);
          initializedRef.current = true; // Set ref
          setMapInitialized(true); // Set state
          console.log('Setting mapInitialized to true');

          if (map.current) {
            const borderLayers = map.current
              .getStyle()
              .layers.filter((layer) =>
                layer.id.includes('boundary_1') ||
                layer.id.includes('boundary_2') ||
                layer.id.includes('boundary_disputed') ||
                layer.id.includes('boundary_country') ||
                layer.id.includes('boundary_state')
              )
              .map((layer) => layer.id);

            borderLayers.forEach((layer) => {
              if (map.current) {
                map.current.setPaintProperty(layer, 'line-color', '#F98029');
                map.current.setPaintProperty(layer, 'line-width', [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  3,
                  1,
                  12,
                  3,
                ]);
              }
            });
          }

          // Bind click handler
          console.log('Binding click handler');
          map.current!.on('click', handleMapClick);
        });

        map.current.on('error', (e) => {
          console.error('MapLibre error:', e);
          setError(`MapLibre error: ${JSON.stringify(e)}`);
        });

        map.current.on('sourcedataerror', (e) => {
          console.error('Source data error:', e);
          setError(`Source data error: ${JSON.stringify(e)}`);
        });

        map.current.on('tileload', (e) => {
          console.log('Tile loaded:', e);
        });

        map.current.on('sourcedataloading', (e) => {
          console.log('Source data loading:', e);
        });

        map.current.on('move', () => {
          if (map.current) {
            setMapState({
              lng: Number(map.current.getCenter().lng.toFixed(4)),
              lat: Number(map.current.getCenter().lat.toFixed(4)),
              zoom: Number(map.current.getZoom().toFixed(2)),
            });
          }
        });

        setTimeout(() => {
          if (map.current) {
            map.current.resize();
            console.log('Map resized to force render');
          }
        }, 3000);
      } catch (error) {
        console.error('Failed to initialize map:', error);
        setError(`Failed to initialize map: ${String(error)}`);
      }
    };

    console.log('Fetching style:', darkMatterStyleUrl);
    fetch(darkMatterStyleUrl)
      .then((response) => {
        console.log('Style fetch response:', response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`Failed to fetch style: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((style) => {
        console.log('Style JSON fetched successfully');
        initializeMap(darkMatterStyleUrl);
      })
      .catch((error) => {
        console.error('Failed to fetch Dark Matter style:', error);
        setError(`Failed to fetch Dark Matter style: ${String(error)}`);
        console.log('Using fallback style:', fallbackStyle);
        initializeMap(fallbackStyle);
      });

    return () => {
      if (map.current) {
        map.current.remove();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (textMarkerRef.current) {
        textMarkerRef.current.remove();
      }
    };
  }, []);

  const handleMapClick = (e: maplibregl.MapMouseEvent) => {
    console.log('Click handler called with map.current:', !!map.current, 'mapInitialized:', mapInitialized, 'initializedRef:', initializedRef.current);
    if (!map.current || !initializedRef.current) {
      console.warn('Map not fully loaded, ignoring click');
      return;
    }

    console.log('Map clicked at:', e.lngLat);

    const { lng, lat } = e.lngLat;

    // Add point marker
    try {
      const markerElement = document.createElement('div');
      markerElement.style.backgroundColor = '#2ecc71';
      markerElement.style.width = '12px';
      markerElement.style.height = '12px';
      markerElement.style.borderRadius = '50%';
      markerElement.style.border = '2px solid #fff';
      markerElement.style.zIndex = '2000';

      const marker = new maplibregl.Marker({ element: markerElement })
        .setLngLat([lng, lat])
        .addTo(map.current);
      console.log('Marker added at:', lng, lat);

      setMarkers((prev) => [
        ...prev,
        { lng: lng.toFixed(4), lat: lat.toFixed(4), marker },
      ]);
    } catch (err) {
      console.error('Failed to add marker:', err);
      setError('Failed to add marker');
      return;
    }

    // Calculate geohash and bounding box
    let geohash: string, bbox: number[];
    try {
      geohash = ngeohash.encode(lat, lng, 6);
      bbox = ngeohash.decode_bbox(geohash);
    } catch (err) {
      console.error('Failed to calculate geohash or bbox:', err);
      setError('Failed to calculate geohash or bounding box');
      return;
    }
    const lastChar = geohash.slice(-1);
    const [minLat, minLng, maxLat, maxLng] = bbox;

    console.log('Bounding box coordinates:', { minLat, minLng, maxLat, maxLng });

    // Define GeoJSON LineString for bounding box edge
    const bboxGeoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [minLng, minLat],
          [maxLng, minLat],
          [maxLng, maxLat],
          [minLng, maxLat],
          [minLng, minLat],
        ],
      },
    };

    // Clean up existing layers and sources
    try {
      if (map.current.getLayer('geohash-bbox')) {
        map.current.removeLayer('geohash-bbox');
        console.log('Removed existing geohash-bbox layer');
      }
      if (map.current.getSource('geohash-bbox')) {
        map.current.removeSource('geohash-bbox');
        console.log('Removed existing geohash-bbox source');
      }
      if (textMarkerRef.current) {
        textMarkerRef.current.remove();
        textMarkerRef.current = null;
        console.log('Removed existing text marker');
      }
    } catch (err) {
      console.error('Error during cleanup:', err);
    }

    // Add GeoJSON source
    try {
      map.current.addSource('geohash-bbox', {
        type: 'geojson',
        data: bboxGeoJSON,
      });
      console.log('Added geohash-bbox source');
    } catch (err) {
      console.error('Failed to add geohash-bbox source:', err);
      setError('Failed to add bounding box source');
      return;
    }

    // Add bounding box edge layer
    try {
      map.current.addLayer({
        id: 'geohash-bbox',
        type: 'line',
        source: 'geohash-bbox',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#ff4500',
          'line-width': 3,
          'line-opacity': 0, // Fade-in animation
        },
      });
      console.log('Added geohash-bbox layer');
    } catch (err) {
      console.error('Failed to add geohash-bbox layer:', err);
      setError('Failed to add bounding box layer');
      if (map.current) {
        console.log('Current map layers:', map.current.getStyle().layers.map((l) => l.id));
      }
      return;
    }

    // Add last character as a rune-like text marker
    try {
      const textElement = document.createElement('div');
      textElement.style.color = '#ff4500';
      textElement.style.fontFamily = 'monospace';
      textElement.style.fontSize = '20px';
      textElement.style.fontWeight = 'bold';
      textElement.style.textShadow = '0 0 8px #ff4500, 0 0 16px #ff4500';
      textElement.style.opacity = '0';
      textElement.style.transition = 'opacity 1s';
      textElement.style.pointerEvents = 'none';
      textElement.style.zIndex = '2000';
      textElement.textContent = lastChar;

      const centerLng = (minLng + maxLng) / 2;
      const centerLat = (minLat + maxLat) / 2;

      textMarkerRef.current = new maplibregl.Marker({ element: textElement })
        .setLngLat([centerLng, centerLat])
        .addTo(map.current);
      console.log('Added text marker');
    } catch (err) {
      console.error('Failed to add text marker:', err);
      setError('Failed to add text marker');
      return;
    }

    // Animation logic
    const animationDuration = 1000;
    const startTime = performance.now();

    const animateFade = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      if (map.current && map.current.getLayer('geohash-bbox')) {
        map.current.setPaintProperty('geohash-bbox', 'line-opacity', progress);
      } else {
        console.warn('geohash-bbox layer not found during animation');
        if (map.current) {
          console.log('Current map layers:', map.current.getStyle().layers.map((l) => l.id));
        }
      }

      if (textMarkerRef.current) {
        textElement.style.opacity = `${progress}`;
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateFade);
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animateFade);
  };

  return (
    <div>
      <div ref={mapContainer} style={{ width: '100%', height: '600px' }} />
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
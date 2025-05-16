import React, { useRef, useEffect, useState } from 'react';
import maplibregl, { Map, Marker, AttributionControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapOptions } from 'react-map-gl/mapbox';
import * as ngeohash from 'ngeohash';
import { GeohashMarker } from './MapPage';

// Define types
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

interface MapComponentProps {
  markers: GeohashMarker[];
  handlers: {
    addMarker: (marker: GeohashMarker) => void;
  };
}

const MapComponent: React.FC<MapComponentProps> = ({ markers, handlers }) => {
  const mapTilerKey = 'lhlGVte7aCUtTfVIhH9R';
  const darkMatterStyleUrl = `https://api.maptiler.com/maps/darkmatter/style.json?key=${mapTilerKey}`;
  const fallbackStyle = 'https://demotiles.maplibre.org/style.json';
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const initializedRef = useRef<boolean>(false);
  const [mapState, setMapState] = useState<MapState>({
    lng: -115.16643, // The Venetian
    lat: 36.12107,
    zoom: 16,
  });
  const [localMarkers, setLocalMarkers] = useState<MarkerData[]>([]);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const textMarkerRef = useRef<Marker | null>(null);

  // Log state changes
  useEffect(() => {
    console.log('mapInitialized state changed:', mapInitialized);
  }, [mapInitialized]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

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
          doubleClickZoom: true, // Enable for Tauri click debugging
          touchZoomRotate: true, // Enable for touch compatibility
          keyboard: false,
          attributionControl: false,
          interactive: true, // Ensure interactivity
        } as MapOptions);

        map.current.addControl(
          new AttributionControl({
            customAttribution: [],
          })
        );

        map.current.on('load', () => {
          console.log('Map fully loaded, map.current:', !!map.current);
          initializedRef.current = true;
          setMapInitialized(true);
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
          map.current!.on('click', (e) => {
            console.log('Raw click event:', e.lngLat, 'originalEvent:', e.originalEvent);
            handleMapClick(e);
          });

          // Debug touch events
          map.current!.on('touchstart', (e) => {
            console.log('Touchstart event:', e.lngLat, 'originalEvent:', e.originalEvent);
          });
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

  const addMapFeatures = (lng: number, lat: number) => {
    if (!map.current || !initializedRef.current) {
      console.warn('Map not fully loaded, cannot add features');
      return;
    }

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

      setLocalMarkers((prev) => [
        ...prev,
        { lng: lng.toFixed(4), lat: lat.toFixed(4), marker },
      ]);

      // Calculate geohash
      const geohash = ngeohash.encode(lat, lng, 7);
      handlers.addMarker({ lng: lng.toFixed(4), lat: lat.toFixed(4), geohash });
    } catch (err) {
      console.error('Failed to add marker:', err);
      setError('Failed to add marker');
      return;
    }

    // Calculate bounding box
    let bbox: number[];
    try {
      bbox = ngeohash.decode_bbox(ngeohash.encode(lat, lng, 7));
    } catch (err) {
      console.error('Failed to calculate bbox:', err);
      setError('Failed to calculate bounding box');
      return;
    }
    const lastChar = ngeohash.encode(lat, lng, 7).slice(-1);
    const [minLat, minLng, maxLat, maxLng] = bbox;

    console.log('Bounding box coordinates:', { minLat, minLng, maxLat, maxLng });
    console.log('GeoJSON for bounding box:', JSON.stringify({
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
    }, null, 2));

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
        data: {
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
        },
      });
      console.log('Added geohash-bbox source');
    } catch (err) {
      console.error('Failed to add geohash-bbox source:', err);
      setError('Failed to add bounding box source');
      return;
    }

    // Add bounding box layer
    try {
      console.log('Attempting to add geohash-bbox layer');
      map.current.addLayer({
        id: 'geohash-bbox',
        type: 'line',
        source: 'geohash-bbox',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#ff0000',
          'line-width': 5,
          'line-opacity': 1,
        },
      });
      console.log('Added geohash-bbox layer');
      console.log('Current map layers:', map.current.getStyle().layers.map((l) => l.id));
    } catch (err) {
      console.error('Failed to add geohash-bbox layer:', err);
      setError('Failed to add bounding box layer');
      return;
    }

    // Add rune
    let textElement: HTMLDivElement | null = null;
    try {
      textElement = document.createElement('div');
      textElement.style.color = '#ff0000';
      textElement.style.fontFamily = 'monospace';
      textElement.style.fontSize = '20px';
      textElement.style.fontWeight = 'bold';
      textElement.style.textShadow = '0 0 8px #ff0000, 0 0 16px #ff0000';
      textElement.style.opacity = '1';
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

    // Animation
    const animationDuration = 1000;
    const startTime = performance.now();

    const animateFade = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      if (map.current && map.current.getLayer('geohash-bbox')) {
        console.log('Setting line-opacity to:', progress);
        map.current.setPaintProperty('geohash-bbox', 'line-opacity', progress);
      } else {
        console.warn('geohash-bbox layer not found during animation');
        if (map.current) {
          console.log('Current map layers:', map.current.getStyle().layers.map((l) => l.id));
        }
      }

      if (textElement) {
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

  const handleMapClick = (e: maplibregl.MapMouseEvent) => {
    console.log('Click handler called with map.current:', !!map.current, 'mapInitialized:', mapInitialized, 'initializedRef:', initializedRef.current);
    if (!map.current || !initializedRef.current) {
      console.warn('Map not fully loaded, ignoring click');
      return;
    }

    const { lng, lat } = e.lngLat;
    addMapFeatures(lng, lat);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ width: '50vw', height: '38vw', position: 'relative' }} />
      {error && <div style={{ color: 'red', position: 'absolute', top: 10, left: 10 }}>{error}</div>}
    </div>
  );
};

export default MapComponent;
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
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
  geohash: string;
  marker: Marker;
}

export interface MapComponentRef {
  getMap: () => Map | null;
  addMapFeatures: (lng: number, lat: number) => void;
  removeMarker: (geohash: string) => void;
}

interface MapComponentProps {
  markers: GeohashMarker[];
  handlers: {
    addMarker: (marker: GeohashMarker) => void;
    onLocationTooClose: () => void;
  };
  onMaxMarkersReached?: () => void;
}

const MapComponent = forwardRef<MapComponentRef, MapComponentProps>(({ markers, handlers, onMaxMarkersReached }, ref) => {
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
  const [error, setError] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const textMarkerRef = useRef<Marker | null>(null);
  const isAddingFeatures = useRef<boolean>(false);
  const markerRefs = useRef<MarkerData[]>([]);

  useEffect(() => {
  }, [initializedRef.current]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const initializeMap = (style: string) => {
      try {
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
          doubleClickZoom: true,
          touchZoomRotate: true,
          keyboard: false,
          attributionControl: false,
          interactive: true,
        } as MapOptions);

        map.current.addControl(
          new AttributionControl({
            customAttribution: [],
          })
        );

        map.current.on('load', () => {
          initializedRef.current = true;

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

          map.current!.on('click', (e) => {
            handleMapClick(e);
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

    fetch(darkMatterStyleUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch style: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((style) => {
        initializeMap(darkMatterStyleUrl);
      })
      .catch((error) => {
        console.error('Failed to fetch Dark Matter style:', error);
        setError(`Failed to fetch Dark Matter style: ${String(error)}`);
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

  useEffect(() => {
    if (!map.current) return;
  
    // Remove markers not in props
    markerRefs.current.forEach(({ geohash }) => {
      if (!markers.some((m) => m.geohash === geohash)) {
        removeMarker(geohash);
      }
    });
  
    // Add missing markers (if needed)
    markers.forEach((marker) => {
      if (!markerRefs.current.some((m) => m.geohash === marker.geohash)) {
        addMapFeatures(Number(marker.lng), Number(marker.lat));
      }
    });
  }, [markers]);

  const addMapFeatures = (lng: number, lat: number) => {
    if (!map.current || !initializedRef.current) {
      console.warn('Map not fully loaded, cannot add features');
      return;
    }

    if (isAddingFeatures.current) {
      console.warn('addMapFeatures already in progress, skipping');
      return;
    }

    if (markerRefs.current.length >= 6) {
      console.warn('Maximum number of markers reached');
      onMaxMarkersReached?.();
      return;
    }

    isAddingFeatures.current = true;
    
    let geohash: string;

    try {
      // Calculate geohash first to check similarity
      geohash = ngeohash.encode(lat, lng, 7);
      const firstFourChars = geohash.slice(0, 4);
      
      // Check if any existing marker has matching first four characters
      const isTooClose = markerRefs.current.some(({ geohash: existingGeohash }) => {
        const existingFirstFour = existingGeohash.slice(0, 4);
        return existingFirstFour === firstFourChars;
      });

      if (isTooClose) {
        handlers.onLocationTooClose();
        isAddingFeatures.current = false;
        return;
      }

      // Add point marker
      const markerElement = document.createElement('div');
      markerElement.style.backgroundColor = '#ff0000';
      markerElement.style.width = '12px';
      markerElement.style.height = '12px';
      markerElement.style.borderRadius = '50%';
      markerElement.style.border = '2px solid #fff';
      markerElement.style.zIndex = '2000';

      const marker = new maplibregl.Marker({ element: markerElement })
        .setLngLat([lng, lat])
        .addTo(map.current);

      handlers.addMarker({ lng: lng.toFixed(4), lat: lat.toFixed(4), geohash });

      // Store marker reference
      markerRefs.current.push({ geohash, marker });
    } catch (err) {
      console.error('Failed to add marker:', err);
      setError('Failed to add marker');
      isAddingFeatures.current = false;
      return;
    }

    // Calculate bounding box
    let bbox: number[];
    try {
      bbox = ngeohash.decode_bbox(geohash);
    } catch (err) {
      console.error('Failed to calculate bbox:', err);
      setError('Failed to calculate bounding box');
      isAddingFeatures.current = false;
      return;
    }
    const lastChar = geohash.slice(-1);
    const [minLat, minLng, maxLat, maxLng] = bbox;

    // Clean up existing layers and sources
    try {
      if (map.current.getLayer('geohash-bbox')) {
        map.current.removeLayer('geohash-bbox');
      }
      if (map.current.getSource('geohash-bbox')) {
        map.current.removeSource('geohash-bbox');
      }
      if (textMarkerRef.current) {
        textMarkerRef.current.remove();
        textMarkerRef.current = null;
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
    } catch (err) {
      console.error('Failed to add geohash-bbox source:', err);
      setError('Failed to add bounding box source');
      isAddingFeatures.current = false;
      return;
    }

    // Add bounding box layer
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
          'line-color': '#ff0000',
          'line-width': 5,
          'line-opacity': 0,
        },
      });
    } catch (err) {
      console.error('Failed to add geohash-bbox layer:', err);
      setError('Failed to add bounding box layer');
      isAddingFeatures.current = false;
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
      textElement.style.opacity = '0';
      textElement.style.pointerEvents = 'none';
      textElement.style.zIndex = '2000';
      textElement.textContent = lastChar;

      const centerLng = (minLng + maxLng) / 2;
      const centerLat = (minLat + maxLat) / 2;

      textMarkerRef.current = new maplibregl.Marker({ element: textElement })
        .setLngLat([centerLng, centerLat])
        .addTo(map.current);
    } catch (err) {
      console.error('Failed to add text marker:', err);
      setError('Failed to add text marker');
      isAddingFeatures.current = false;
      return;
    }

    // Animation
    const animationDuration = 1000;
    const startTime = performance.now();

    const animateFade = (currentTime: number) => {
      if (!map.current || !map.current.getLayer('geohash-bbox')) {
        console.warn('Map or geohash-bbox layer missing, stopping animation');
        isAddingFeatures.current = false;
        return;
      }

      const elapsed = Math.max(0, currentTime - startTime);
      const progress = Math.max(0, Math.min(elapsed / animationDuration, 1));

      try {
        map.current.setPaintProperty('geohash-bbox', 'line-opacity', progress);
      } catch (err) {
        console.error('Failed to set line-opacity:', err);
        setError(`Failed to set line-opacity: ${String(err)}`);
      }

      if (textElement) {
        textElement.style.opacity = `${progress}`;
      }

      if (progress < 1 && animationRef.current) {
        animationRef.current = requestAnimationFrame(animateFade);
      } else {
        isAddingFeatures.current = false;
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animateFade);

    // Reset isAddingFeatures after a short delay
    setTimeout(() => {
      isAddingFeatures.current = false;
    }, 100);
  };

  const removeMarker = (geohash: string) => {
    if (!map.current) {
      console.warn('Map not initialized, cannot remove marker');
      return;
    }

    try {
      // Remove marker from map and refs
      const markerData = markerRefs.current.find((m) => m.geohash === geohash);
      if (markerData) {
        markerData.marker.remove();
        markerRefs.current = markerRefs.current.filter((m) => m.geohash !== geohash);
      }

      // Clear bounding box and rune if no markers remain
      if (markerRefs.current.length === 0) {
        if (map.current.getLayer('geohash-bbox')) {
          map.current.removeLayer('geohash-bbox');
        }
        if (map.current.getSource('geohash-bbox')) {
          map.current.removeSource('geohash-bbox');
        }
        if (textMarkerRef.current) {
          textMarkerRef.current.remove();
          textMarkerRef.current = null;
        }
      }
    } catch (err) {
      console.error('Failed to remove marker:', err);
      setError(`Failed to remove marker: ${String(err)}`);
    }
  };

  const handleMapClick = (e: maplibregl.MapMouseEvent) => {
    if (!map.current || !initializedRef.current) {
      console.warn('Map not fully loaded, ignoring click');
      return;
    }

    const { lng, lat } = e.lngLat;
    addMapFeatures(lng, lat);
  };

  useImperativeHandle(ref, () => ({
    getMap: () => map.current,
    addMapFeatures,
    removeMarker,
  }), [map.current]);

  return (
    <div className="map-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ width: '50vw', height: '38vw', position: 'relative' }} />
      {error && <div style={{ color: 'red', position: 'absolute', top: 10, left: 10 }}>{error}</div>}
    </div>
  );
});

export default MapComponent;
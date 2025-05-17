import React, { useState, useCallback, useRef, MutableRefObject } from 'react';
import MapComponent, { MapComponentRef } from './MapComponent';
import { TextField, Autocomplete, debounce, IconButton } from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';

export interface GeohashMarker {
  lng: string;
  lat: string;
  geohash: string;
}

interface SearchResult {
  place_name: string;
  center: [number, number];
}

export default function MapPage() {
  const [markers, setMarkers] = useState<GeohashMarker[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [inputValue, setInputValue] = useState('');
  const mapRef = useRef<MapComponentRef>(null) as MutableRefObject<MapComponentRef | null>;

  const mapTilerKey = 'lhlGVte7aCUtTfVIhH9R';

  const removeMarker = (e: React.MouseEvent<HTMLButtonElement>, geohash: string) => {
    e.stopPropagation();
    setMarkers((prev) => prev.filter((marker) => marker.geohash !== geohash));
  };

  const handlers = {
    addMarker: (marker: GeohashMarker) => {
      setMarkers((prev) => [...prev, marker]);
    },
  };

  const fetchSearchResults = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setSearchResults([]);
        return;
      }
      try {
        const response = await fetch(
          `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${mapTilerKey}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch search results: ${response.statusText}`);
        }
        const data = await response.json();
        const results = data.features.map((feature: any) => ({
          place_name: feature.place_name,
          center: feature.center,
        }));
        setSearchResults(results);
      } catch (error) {
        console.error('Failed to fetch search results:', error);
      }
    }, 300),
    []
  );

  const handleSearchSelect = (result: SearchResult | null) => {
    if (result && mapRef.current?.getMap()) {
      const [lng, lat] = result.center;
      const map = mapRef.current.getMap();
      if (map) {
        map.flyTo({ center: [lng, lat], zoom: 16 });
        mapRef.current.addMapFeatures(lng, lat); // Directly call addMapFeatures
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#181406',
        color: '#FFA500',
        fontFamily: "'Cinzel', serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 40,
        letterSpacing: 1.5,
      }}
    >
      <div
        style={{
          width: '90%',
          maxWidth: '80vw',
          marginBottom: 16,
        }}
      >
        <Autocomplete
          freeSolo
          options={searchResults}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.place_name)}
          onInputChange={(_, value) => {
            setInputValue(value);
            fetchSearchResults(value);
          }}
          onChange={(_, value) => handleSearchSelect(value as SearchResult)}
          slotProps={{
            paper: {
              sx: {
                background: '#1a1200',
                color: '#FFA500',
                '& .MuiAutocomplete-option': {
                  color: '#FFA500',
                  '&:hover': {
                    background: '#FFA50033',
                  },
                  '&[aria-selected="true"]': {
                    background: '#FFA50022',
                  },
                },
              },
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Location"
              variant="outlined"
              style={{ background: '#1a1200', color: '#FFA500' }}
              InputLabelProps={{
                style: { color: '#FFA500' },
              }}
              InputProps={{
                ...params.InputProps,
                style: { color: '#FFA500' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FFA500',
                  },
                },
              }}
            />
          )}
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: 32,
          width: '90%',
          maxWidth: '80vw',
          marginTop: 32,
          maxHeight: '80vh',
        }}
      >
        <div
          style={{
            flex: 2,
            background: '#1a1200',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 0 12px #FFA50033',
            minHeight: '600px',
          }}
        >
          <MapComponent
            markers={markers}
            handlers={handlers}
            ref={mapRef}
          />
        </div>
        <div
          style={{
            flex: 1,
            background: '#1a1200',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 0 12px #FFA50033',
            minHeight: '600px',
            overflowY: 'auto',
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: 24,
              fontSize: 24,
              textAlign: 'center',
              textShadow: '0 0 8px #FFA50055',
            }}
          >
            Geohash Markers
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {markers.map((marker, index) => (
              <div
                key={index}
                style={{
                  background: '#181406',
                  border: '1px solid #FFA50033',
                  borderRadius: 8,
                  padding: 16,
                  boxShadow: '0 0 8px #FFA50022',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 18,
                    marginBottom: 8,
                    color: '#FFA500',
                    textShadow: '0 0 4px #FFA50055',
                  }}
                >
                  {marker.geohash}
                </div>
                <IconButton onClick={(e) => removeMarker(e, marker.geohash)}>
                  <WhatshotIcon sx={{ color: '#FFA500' }} />
                </IconButton>
              </div>
            ))}
            {markers.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  color: '#FFA50055',
                  fontStyle: 'italic',
                }}
              >
                Click on the map or search to add markers
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
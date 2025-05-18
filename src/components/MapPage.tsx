import React, { useState, useCallback, useRef, MutableRefObject, useEffect } from 'react';
import MapComponent, { MapComponentRef } from './MapComponent';
import { TextField, Autocomplete, IconButton, Snackbar, Alert, Button } from '@mui/material';
import { debounce } from '@mui/material/utils';
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

interface MapPageProps {
  onContinue?: () => void;
  onSkip?: () => void;
  onBack?: () => void;
}

export default function MapPage({ onContinue, onSkip, onBack }: MapPageProps) {
  const [markers, setMarkers] = useState<GeohashMarker[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const mapRef = useRef<MapComponentRef>(null) as MutableRefObject<MapComponentRef | null>;

  const mapTilerKey = 'lhlGVte7aCUtTfVIhH9R';

  useEffect(() => {
    if (markers.length > 6) {
      setAlertMessage('You cannot have more than 6 hashes.');
      setSnackbarOpen(true);
    }
  }, [markers.length]);

  const removeGeohash = (e: React.MouseEvent<HTMLButtonElement>, geohash: string) => {
    e.stopPropagation();
    setMarkers((prev) => prev.filter((marker) => marker.geohash !== geohash));
    // Call removeMarker on MapComponent to remove the marker from the map
    if (mapRef.current) {
      mapRef.current.removeMarker(geohash);
    }
  };

  const clearAllHashes = () => {
    setMarkers([]);
    if (mapRef.current) {
      // Remove all markers from the map
      markers.forEach(marker => {
        mapRef.current?.removeMarker(marker.geohash);
      });
    }
  };

  const handlers = {
    addMarker: (marker: GeohashMarker) => {
      if (markers.length >= 6) {
        setAlertMessage('You cannot have more than 6 hashes.');
        setSnackbarOpen(true);
        return;
      }
      setMarkers((prev) => [...prev, marker]);
    },
    onLocationTooClose: () => {
      setAlertMessage('The location you chose was too close to one of your previous locations. Please select a different location. All locations must be at least 100 kM apart for sufficient entropy.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
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
      }
    }
  };

  const handleSubmit = () => {
    if (onContinue) {
      onContinue();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
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
        position: 'relative', // For positioning the back button
      }}
    >
      {/* Back Arrow */}
      {onBack && (
        <button
          onClick={handleBack}
          aria-label="Back"
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            background: 'none',
            border: 'none',
            color: '#FFA500',
            cursor: 'pointer',
            zIndex: 2,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFA500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}
      
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
            onMaxMarkersReached={() => {
              setAlertMessage('You cannot have more than 6 hashes.');
              setSnackbarOpen(true);
            }}
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
              justifyContent: 'space-between',
              gap: 16,
              height: '85%',
              width: '100%',
              maxHeight: '90%',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                <IconButton onClick={(e) => removeGeohash(e, marker.geohash)}>
                  <WhatshotIcon sx={{ color: '#FFA500' }} />
                </IconButton>
              </div>
            ))}
            </div>
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
              <Button 
                variant="outlined"
                fullWidth
                onClick={clearAllHashes}
                sx={{
                  color: '#FFA500',
                  borderColor: '#FFA50033',
                  '&:hover': {
                    borderColor: '#FFA500',
                    backgroundColor: '#FFA50011'
                  }
                }}
              >
                Clear All
              </Button>
              <Button 
                variant="outlined"
                fullWidth
                disabled={markers.length !== 6}
                onClick={handleSubmit}
                sx={{
                  color: '#FFA500',
                  borderColor: '#FFA50033',
                  '&:hover': {
                    borderColor: '#FFA500',
                    backgroundColor: '#FFA50011'
                  },
                  '&.Mui-disabled': {
                    color: '#FFA50055',
                    borderColor: '#FFA50022',
                    backgroundColor: '#FFA50008'
                  }
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="warning"
          sx={{
            background: '#1a1200',
            color: '#FFA500',
            fontFamily: "'Cinzel', serif",
            boxShadow: '0 0 12px #FFA50033',
            border: '1px solid #FFA50033',
            '& .MuiAlert-icon': {
              color: '#FFA500',
            },
            '& .mui-1vooibu-MuiSvgIcon-root': {
              color: '#FFA500 !important',
            },
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
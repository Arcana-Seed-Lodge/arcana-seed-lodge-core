import React, { useState, useCallback, useRef, MutableRefObject, useEffect } from 'react';
import MapComponent, { MapComponentRef } from './MapComponent';
import SymbolSelectionComponent from './SymbolSelectionComponent';
import { TextField, Autocomplete, IconButton, Snackbar, Alert, Button } from '@mui/material';
import { debounce } from '@mui/material/utils';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { StorageService } from '../services/StorageService';
import { SYMBOLS } from '../symbols';
import { DEBUG, TEST_GEOHASHES, TEST_SYMBOLS } from './MapComponent';

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

// Add a new enum for tracking MapPage state
enum MapPageState {
  SELECTING_GEOHASHES = 'selecting_geohashes',
  SELECTING_SYMBOLS = 'selecting_symbols'
}

export default function MapPage({ onContinue, onSkip, onBack }: MapPageProps) {
  const [markers, setMarkers] = useState<GeohashMarker[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [pageState, setPageState] = useState<MapPageState>(MapPageState.SELECTING_GEOHASHES);
  const mapRef = useRef<MapComponentRef>(null) as MutableRefObject<MapComponentRef | null>;
  const storageService = useRef(StorageService.getInstance());

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

  const handleSubmit = async () => {
    // If we've selected all 6 geohashes, move to the symbols selection screen
    if (markers.length === 6) {
      setPageState(MapPageState.SELECTING_SYMBOLS);
    } else {
      setAlertMessage('Please select 6 locations before continuing.');
      setSnackbarOpen(true);
    }
  };

  const handleSymbolsSelected = async (symbols: string[]) => {
    try {
      // Extract just the geohash strings
      const geohashes = markers.map(marker => marker.geohash);
      
      // Store the geohashes
      await storageService.current.saveGeohashes(geohashes);
      
      // Store the selected symbols
      await storageService.current.saveSymbols(symbols);
      
      // Now continue to the next screen
      if (onContinue) {
        onContinue();
      }
    } catch (error) {
      console.error('Error saving selections:', error);
      setAlertMessage('Failed to save your selections. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleSymbolsBack = () => {
    // Go back to geohash selection
    setPageState(MapPageState.SELECTING_GEOHASHES);
  };

  const handleSkip = async () => {
    try {
      // Save the test geohashes and symbols
      await storageService.current.saveGeohashes(TEST_GEOHASHES);
      await storageService.current.saveSymbols(TEST_SYMBOLS);
      
      // Continue to the next screen
      if (onContinue) {
        onContinue();
      }
    } catch (error) {
      console.error('Error saving test values:', error);
      setAlertMessage('Failed to save test values. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  // If we're in symbol selection state, render the SymbolSelectionComponent
  if (pageState === MapPageState.SELECTING_SYMBOLS) {
    return (
      <SymbolSelectionComponent 
        onSymbolsSelected={handleSymbolsSelected}
        onBack={handleSymbolsBack}
      />
    );
  }

  // Otherwise render the map for geohash selection
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#181406',
        color: '#F98029',
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
            color: '#F98029',
            cursor: 'pointer',
            zIndex: 2,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F98029" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                color: '#F98029',
                '& .MuiAutocomplete-option': {
                  color: '#F98029',
                  '&:hover': {
                    background: '#F9802933',
                  },
                  '&[aria-selected="true"]': {
                    background: '#F9802922',
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
              style={{ background: '#1a1200', color: '#F98029' }}
              InputLabelProps={{
                style: { color: '#F98029' },
              }}
              InputProps={{
                ...params.InputProps,
                style: { color: '#F98029' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#F98029',
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
            boxShadow: '0 0 12px #F9802933',
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
            boxShadow: '0 0 12px #F9802933',
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
              textShadow: '0 0 8px #F9802955',
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
                  border: '1px solid #F9802933',
                  borderRadius: 8,
                  padding: 16,
                  boxShadow: '0 0 8px #F9802922',
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
                    color: '#F98029',
                    textShadow: '0 0 4px #F9802955',
                  }}
                >
                  {marker.geohash}
                </div>
                <IconButton onClick={(e) => removeGeohash(e, marker.geohash)}>
                  <WhatshotIcon sx={{ color: '#F98029' }} />
                </IconButton>
              </div>
            ))}
            </div>
            {markers.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  color: '#F9802955',
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
                  color: '#F98029',
                  borderColor: '#F9802933',
                  '&:hover': {
                    borderColor: '#F98029',
                    backgroundColor: '#F9802911'
                  }
                }}
              >
                Clear All
              </Button>
              {DEBUG && (
                <Button 
                  variant="outlined"
                  fullWidth
                  onClick={handleSkip}
                  sx={{
                    color: '#F98029',
                    borderColor: '#F9802933',
                    '&:hover': {
                      borderColor: '#F98029',
                      backgroundColor: '#F9802911'
                    }
                  }}
                >
                  SKIP
                </Button>
              )}
              <Button 
                variant="outlined"
                fullWidth
                disabled={markers.length !== 6}
                onClick={handleSubmit}
                sx={{
                  color: '#F98029',
                  borderColor: '#F9802933',
                  '&:hover': {
                    borderColor: '#F98029',
                    backgroundColor: '#F9802911'
                  },
                  '&.Mui-disabled': {
                    color: '#F9802955',
                    borderColor: '#F9802922',
                    backgroundColor: '#F9802908'
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
            color: '#F98029',
            fontFamily: "'Cinzel', serif",
            boxShadow: '0 0 12px #F9802933',
            border: '1px solid #F9802933',
            '& .MuiAlert-icon': {
              color: '#F98029',
            },
            '& .mui-1vooibu-MuiSvgIcon-root': {
              color: '#F98029 !important',
            },
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
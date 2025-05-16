import React, { useState } from 'react';
import MapComponent from './MapComponent';

interface GeohashMarker {
  lng: string;
  lat: string;
  geohash: string;
}

export default function MapPage() {
  const [markers, setMarkers] = useState<GeohashMarker[]>([]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#181406",
      color: "#FFA500",
      fontFamily: "'Cinzel', serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 40,
      letterSpacing: 1.5,
    }}>

      {/* Main content container */}
      <div style={{
        display: "flex",
        gap: 32,
        width: "90%",
        maxWidth: "80vw",
        marginTop: 32,
        maxHeight: "80vh",
      }}>
        {/* Map container */}
        <div style={{
          flex: 2,
          background: "#1a1200",
          borderRadius: 16,
          padding: 16,
          boxShadow: "0 0 12px #FFA50033",
          minHeight: "600px",
        }}>
          <MapComponent />
        </div>

        {/* Geohash list container */}
        <div style={{
          flex: 1,
          background: "#1a1200",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 0 12px #FFA50033",
          minHeight: "600px",
          overflowY: "auto",
        }}>
          <h2 style={{
            marginTop: 0,
            marginBottom: 24,
            fontSize: 24,
            textAlign: "center",
            textShadow: "0 0 8px #FFA50055",
          }}>
            Geohash Markers
          </h2>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}>
            {markers.map((marker, index) => (
              <div
                key={index}
                style={{
                  background: "#181406",
                  border: "1px solid #FFA50033",
                  borderRadius: 8,
                  padding: 16,
                  boxShadow: "0 0 8px #FFA50022",
                }}
              >
                <div style={{
                  fontFamily: "monospace",
                  fontSize: 18,
                  marginBottom: 8,
                  color: "#FFA500",
                  textShadow: "0 0 4px #FFA50055",
                }}>
                  {marker.geohash}
                </div>
                <div style={{
                  fontSize: 14,
                  color: "#FFA50099",
                }}>
                  Lat: {marker.lat}
                </div>
                <div style={{
                  fontSize: 14,
                  color: "#FFA50099",
                }}>
                  Lng: {marker.lng}
                </div>
              </div>
            ))}
            {markers.length === 0 && (
              <div style={{
                textAlign: "center",
                color: "#FFA50055",
                fontStyle: "italic",
              }}>
                Click on the map to add markers
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";

const xpub = "xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKp7rTtqA1Yy..."; // Placeholder

export default function BitcoinWallet() {
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
      paddingTop: 60,
      letterSpacing: 1.5,
    }}>
      {/* Google Fonts link for Cinzel */}
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap" rel="stylesheet" />
      <h1 style={{
        fontSize: 48,
        fontWeight: 700,
        textShadow: "0 0 8px #FFA500, 0 0 24px #FFA50055",
        marginBottom: 8,
        letterSpacing: 2,
      }}>
        ARCANA SEED LODGE
      </h1>
      <div style={{
        fontSize: 14,
        background: "#1a1200",
        borderRadius: 8,
        padding: "8px 16px",
        marginBottom: 32,
        boxShadow: "0 0 8px #FFA50055",
        fontFamily: "monospace",
        wordBreak: "break-all",
      }}>
        {xpub}
      </div>
      <div style={{
        display: "flex",
        gap: 32,
        marginBottom: 32,
      }}>
        {/* Send Button */}
        <button style={{
          background: "#181406",
          border: "2px solid #FFA500",
          borderRadius: 16,
          color: "#FFA500",
          width: 100,
          height: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 600,
          boxShadow: "0 0 12px #FFA50033",
          cursor: "pointer",
          transition: "background 0.2s, box-shadow 0.2s",
        }}>
          {/* Send Icon (SVG) */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}>
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
          Send
        </button>
        {/* Receive Button */}
        <button style={{
          background: "#181406",
          border: "2px solid #FFA500",
          borderRadius: 16,
          color: "#FFA500",
          width: 100,
          height: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 600,
          boxShadow: "0 0 12px #FFA50033",
          cursor: "pointer",
          transition: "background 0.2s, box-shadow 0.2s",
        }}>
          {/* Receive Icon (SVG) */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}>
            <path d="M12 19V5" />
            <path d="M5 12l7 7 7-7" />
          </svg>
          Receive
        </button>
      </div>
    </div>
  );
} 
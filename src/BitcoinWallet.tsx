import React, { useState } from "react";

const xpub = "xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKp7rTtqA1Yy..."; // Placeholder

export default function BitcoinWallet() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(xpub);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

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
      {/* Logo instead of title */}
      <img
        src="/arcana-logo.jpeg"
        alt="Arcana Seed Lodge Logo"
        style={{
          width: "auto",
          maxWidth: 480,
          height: "auto",
          maxHeight: 270,
          marginBottom: 12,
          borderRadius: 12,
          boxShadow: "0 0 24px #FFA50033",
        }}
      />
      {/* xpub display with copy button */}
      <div style={{
        display: "flex",
        alignItems: "center",
        background: "#1a1200",
        borderRadius: 8,
        padding: "8px 8px 8px 16px",
        marginBottom: 32,
        boxShadow: "0 0 8px #FFA50055",
        fontFamily: "monospace",
        maxWidth: 420,
        width: "90%",
        overflow: "hidden",
      }}>
        <div
          style={{
            fontSize: 14,
            overflowX: "auto",
            whiteSpace: "nowrap",
            flex: 1,
            color: "#FFA500",
          }}
          title={xpub}
        >
          {xpub}
        </div>
        <button
          onClick={handleCopy}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            marginLeft: 8,
            padding: 4,
            display: "flex",
            alignItems: "center",
            color: "#FFA500",
          }}
          aria-label="Copy xpub"
        >
          {/* Copy icon (SVG) */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
        </button>
        {copied && (
          <span style={{
            color: "#FFA500",
            fontSize: 12,
            marginLeft: 8,
            textShadow: "0 0 6px #FFA50099",
            transition: "opacity 0.2s",
          }}>
            Copied!
          </span>
        )}
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
import React, { useState } from "react";
import QRCodeModal from "./QRCodeModal";
import { SYMBOLS } from "../symbols";
import { SeedSigner } from "../lib/signer";
import { generate_map_seed } from "../lib/hash";
// import { GenerateSeedLogic } from "../GenerateSeedLogic";

// const seedLogic = new GenerateSeedLogic();
const testGeohashes = [
  'dp3wqdh', //B15 - End of Navy Pier
  '9v6e6nk', //B16 - Circuit of the Americas Grand Plaza Entrance
  '9q8yyk8', //B17 - SVN West in SF
  'dhx48x9', //B21/22/23 Miami Beach Convention Center
  'dn6m9q3', //B24 - Nashville Music City Center	 
  '9qqj7pz' //B25 - The Venetian Vegas
];

const testSymbols = [
    SYMBOLS[1],  // 👁️ All-Seeing Eye
    SYMBOLS[2],  // 🐝 Beehive
    SYMBOLS[5],  // 🗿 Pillar Jachin
    SYMBOLS[6],  // 🪨 Pillar Boaz
  ];

const seed = generate_map_seed(testGeohashes, testSymbols);
const signer = new SeedSigner(seed, { network: 'regtest' });
const xpub = signer.account_xpub; //seedLogic.getSeedHex();

// Add prop type for onBack
interface BitcoinWalletProps {
  onBack?: () => void;
}

export default function BitcoinWallet({ onBack }: BitcoinWalletProps) {
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(xpub);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleShowQR = () => {
    setShowQRModal(true);
  };

  const handleCloseQR = () => {
    setShowQRModal(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#181406",
      color: "#F98029",
      fontFamily: "'Cinzel', serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 40,
      letterSpacing: 1.5,
      position: "relative",
    }}>
      {/* Back Arrow */}
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            background: "none",
            border: "none",
            color: "#F98029",
            cursor: "pointer",
            zIndex: 2,
            padding: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F98029" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}
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
          boxShadow: "0 0 24px #F9802933",
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
        boxShadow: "0 0 8px #F9802955",
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
            color: "#F98029",
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
            color: "#F98029",
          }}
          aria-label="Copy xpub"
        >
          {/* Copy icon (SVG) */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F98029" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
        </button>
        {/* QR Code Button */}
        <button
          onClick={handleShowQR}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            marginLeft: 8,
            padding: 4,
            display: "flex",
            alignItems: "center",
            color: "#F98029",
          }}
          aria-label="Show QR Code"
        >
          {/* QR Code icon (SVG) */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F98029" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        </button>
        {copied && (
          <span style={{
            color: "#F98029",
            fontSize: 12,
            marginLeft: 8,
            textShadow: "0 0 6px #F9802999",
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
          border: "2px solid #F98029",
          borderRadius: 16,
          color: "#F98029",
          width: 100,
          height: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 600,
          boxShadow: "0 0 12px #F9802933",
          cursor: "pointer",
          transition: "background 0.2s, box-shadow 0.2s",
        }}>
          {/* Send Icon (SVG) */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F98029" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}>
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
          Send
        </button>
        {/* Receive Button */}
        <button style={{
          background: "#181406",
          border: "2px solid #F98029",
          borderRadius: 16,
          color: "#F98029",
          width: 100,
          height: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 600,
          boxShadow: "0 0 12px #F9802933",
          cursor: "pointer",
          transition: "background 0.2s, box-shadow 0.2s",
        }}>
          {/* Receive Icon (SVG) */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F98029" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}>
            <path d="M12 19V5" />
            <path d="M5 12l7 7 7-7" />
          </svg>
          Receive
        </button>
      </div>
      
      {/* QR Code Modal */}
      {showQRModal && <QRCodeModal onClose={handleCloseQR} content={xpub} />}
    </div>
  );
} 
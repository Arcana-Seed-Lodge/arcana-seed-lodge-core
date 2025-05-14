import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeModalProps {
  onClose: () => void;
  content: string;
  title?: string;
  qrSize?: number;
}

export default function QRCodeModal({ 
  onClose, 
  content, 
  title = "Scan QR Code", 
  qrSize = 200 
}: QRCodeModalProps) {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      zIndex: 10,
    }}>
      <div style={{
        background: "#181406",
        borderRadius: 16,
        padding: 24,
        position: "relative",
        maxWidth: "80%",
        boxShadow: "0 0 24px #F9802966",
        border: "1px solid #F98029",
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "none",
            border: "none",
            color: "#F98029",
            fontSize: 20,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
          }}
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F98029" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div style={{
          textAlign: "center",
          marginTop: 8,
          marginBottom: 16,
          fontSize: 20,
          fontWeight: 600,
        }}>
          {title}
        </div>
        <div style={{
          background: "#fff",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          borderRadius: 8,
          width: "fit-content",
          boxShadow: "0 0 8px rgba(249, 128, 41, 0.3)",
        }}>
          <QRCodeSVG 
            value={content}
            size={qrSize}
            bgColor="#ffffff"
            fgColor="#000000"
            level="L"
            includeMargin={false}
          />
        </div>
        <div style={{
          marginTop: 16,
          fontSize: 14,
          textAlign: "center",
          color: "#F98029",
          opacity: 0.8,
          wordBreak: "break-all",
          padding: "0 8px"
        }}>
          {content}
        </div>
      </div>
    </div>
  );
} 
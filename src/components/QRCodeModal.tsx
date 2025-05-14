import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export enum PresentationContext {
  DEFAULT = "DEFAULT",
  RECEIVE_ADDRESS_RENDERING = "RECEIVE_ADDRESS_RENDERING"
}

interface QRCodeModalProps {
  onClose: () => void;
  content: string;
  title?: string;
  qrSize?: number;
  presentationContext?: PresentationContext;
  addressIndex?: number;
  onNextAddress?: () => void;
}

export default function QRCodeModal({ 
  onClose, 
  content, 
  title = "Scan QR Code", 
  qrSize = 200,
  presentationContext = PresentationContext.DEFAULT,
  addressIndex = 0,
  onNextAddress
}: QRCodeModalProps) {
  
  const isReceiveAddressContext = presentationContext === PresentationContext.RECEIVE_ADDRESS_RENDERING;
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  
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
          {isReceiveAddressContext ? `Address #${addressIndex}` : title}
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
        
        {/* Buttons - Copy and Next Address */}
        {isReceiveAddressContext && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginTop: 20,
          }}>
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "none",
                border: "1px solid #F98029",
                borderRadius: 8,
                padding: "12px 20px",
                color: "#F98029",
                cursor: "pointer",
                transition: "background 0.2s",
                fontSize: 14,
                position: "relative",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F98029" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
              </svg>
              <span style={{ marginTop: 8 }}>
                {copied ? "Copied!" : "Copy"}
              </span>
            </button>
            
            {/* Next Button */}
            {onNextAddress && (
              <button
                onClick={onNextAddress}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "none",
                  border: "1px solid #F98029",
                  borderRadius: 8,
                  padding: "12px 20px",
                  color: "#F98029",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  fontSize: 14,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F98029" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
                <span style={{ marginTop: 8 }}>Next</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 
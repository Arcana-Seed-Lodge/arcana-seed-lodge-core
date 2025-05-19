import React, { useEffect, useState } from "react";

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function InfoModal({ open, onClose, children }: InfoModalProps) {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    if (open) {
      setAnimationStage(1);
      const timeout = setTimeout(() => setAnimationStage(2), 50);
      return () => clearTimeout(timeout);
    } else {
      setAnimationStage(0);
    }
  }, [open]);

  if (!open) return null;

  const getModalStyle = () => {
    const baseStyle = {
      background: "#181406",
      borderRadius: 16,
      padding: 24,
      position: "relative" as const,
      maxWidth: "90%" as const,
      width: 500,
      boxShadow: "0 0 24px #F9802966",
      border: "1px solid #F98029",
      color: "#F98029",
      transition: "all 0.3s ease-out",
    };
    if (animationStage === 0) {
      return { ...baseStyle, transform: "scale(0.5)", opacity: 0 };
    } else if (animationStage === 1) {
      return { ...baseStyle, transform: "scale(0.8)", opacity: 0.7 };
    } else {
      return { ...baseStyle, transform: "scale(1)", opacity: 1 };
    }
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
      <div style={getModalStyle()}>
        <div style={{
          textAlign: "center",
          marginTop: 8,
          marginBottom: 24,
          fontSize: 24,
          fontWeight: 600,
        }}>
          <span role="img" aria-label="info" style={{ fontSize: 36, display: "block", marginBottom: 16 }}>ℹ️</span>
        </div>
        <div style={{
          fontSize: 16,
          lineHeight: 1.6,
          textAlign: "center",
          marginBottom: 32,
        }}>
          {children}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={onClose}
            style={{
              background: "#F98029",
              color: "#181406",
              border: "none",
              borderRadius: 8,
              padding: "12px 32px",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 0 12px rgba(249, 128, 41, 0.2)",
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
} 
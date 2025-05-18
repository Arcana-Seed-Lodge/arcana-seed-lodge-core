import React, { useState, useEffect } from "react";

interface DisclaimerModalProps {
  onClose: () => void;
}

export default function DisclaimerModal({ onClose }: DisclaimerModalProps) {
  const [understood, setUnderstood] = useState(false);
  const [animationStage, setAnimationStage] = useState(0); // For animation stages
  
  // Start animation when component mounts
  useEffect(() => {
    // Trigger the animation in a sequence
    setAnimationStage(1);
    
    // Set a timeout to move to the next animation stage
    const timeout = setTimeout(() => {
      setAnimationStage(2);
    }, 50); // Short delay to trigger the CSS transition
    
    return () => clearTimeout(timeout);
  }, []);
  
  const handleConfirm = () => {
    onClose();
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnderstood(e.target.checked);
  };
  
  // Calculate styles based on animation stage
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
    
    // Different styling based on animation stage
    if (animationStage === 0) {
      return {
        ...baseStyle,
        transform: "scale(0.5)",
        opacity: 0,
      };
    } else if (animationStage === 1) {
      return {
        ...baseStyle,
        transform: "scale(0.8)",
        opacity: 0.7,
      };
    } else {
      return {
        ...baseStyle,
        transform: "scale(1)",
        opacity: 1,
      };
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
          Warning
        </div>
        
        <div style={{
          fontSize: 16,
          lineHeight: 1.6,
          textAlign: "center",
          marginBottom: 32,
        }}>
          <span role="img" aria-label="warning" style={{ fontSize: 36, display: "block", marginBottom: 16 }}>⚠️</span>
          This wallet is in beta. It is experimental and has not been fully evaluated for security and reliability. Proceed with caution when using it to move funds.
        </div>
        
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 24,
          marginBottom: 32,
          padding: "12px 16px",
          background: "#1a1200",
          borderRadius: 8,
          border: "1px solid #F9802966",
        }}>
          <label
            htmlFor="understood-checkbox"
            style={{
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            I understand the risks and I am willing to proceed
          </label>
          <input
            type="checkbox"
            id="understood-checkbox"
            checked={understood}
            onChange={handleCheckboxChange}
            style={{
              width: 20,
              height: 20,
              accentColor: "#F98029",
              cursor: "pointer",
            }}
          />
        </div>
        
        <div style={{
          display: "flex",
          justifyContent: "center",
        }}>
          <button
            onClick={handleConfirm}
            disabled={!understood}
            style={{
              background: understood ? "#F98029" : "#6d3913",
              color: understood ? "#181406" : "#a08571",
              border: "none",
              borderRadius: 8,
              padding: "12px 32px",
              fontSize: 16,
              fontWeight: 600,
              cursor: understood ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              boxShadow: understood ? "0 0 12px rgba(249, 128, 41, 0.4)" : "none",
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
} 
import React, { useState, useEffect } from "react";

interface ConfirmDeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({ onClose, onConfirm }: ConfirmDeleteModalProps) {
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
  
  const handleDelete = () => {
    onConfirm();
  };
  
  const handleCancel = () => {
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
          color: "#C02F1D",
        }}>
          Delete Seed
        </div>
        
        <div style={{
          fontSize: 16,
          lineHeight: 1.6,
          textAlign: "center",
          marginBottom: 24,
        }}>
          <span role="img" aria-label="warning" style={{ fontSize: 36, display: "block", marginBottom: 16 }}>⚠️</span>
          You are about to delete your wallet seed. This action <strong>cannot be undone</strong>.
          <br />
          <br />
          You will lose access to any funds controlled by this wallet.
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
            htmlFor="understood-delete-checkbox"
            style={{
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            I understand this is permanent and I will lose access to my funds
          </label>
          <input
            type="checkbox"
            id="understood-delete-checkbox"
            checked={understood}
            onChange={handleCheckboxChange}
            style={{
              width: 20,
              height: 20,
              accentColor: "#C02F1D",
              cursor: "pointer",
            }}
          />
        </div>
        
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
        }}>
          <button
            onClick={handleCancel}
            style={{
              background: "#181406",
              color: "#F98029",
              border: "1px solid #F98029",
              borderRadius: 8,
              padding: "12px 24px",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              flex: 1,
            }}
          >
            Cancel
          </button>
          
          <button
            onClick={handleDelete}
            disabled={!understood}
            style={{
              background: understood ? "#C02F1D" : "#6d2113",
              color: understood ? "white" : "#a08571",
              border: "none",
              borderRadius: 8,
              padding: "12px 24px",
              fontSize: 16,
              fontWeight: 600,
              cursor: understood ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              boxShadow: understood ? "0 0 12px rgba(192, 47, 29, 0.4)" : "none",
              flex: 1,
            }}
          >
            Delete Seed
          </button>
        </div>
      </div>
    </div>
  );
} 
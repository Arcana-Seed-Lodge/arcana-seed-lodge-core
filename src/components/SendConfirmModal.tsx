import React, { useState } from "react";
import { SeedSigner } from "../lib/signer";

interface SendConfirmModalProps {
  onClose: () => void;
  onSignComplete?: (signedPsbt: string) => void;
  signer: SeedSigner;
}

enum SendStep {
  PASTE_PSBT = 0,
  CONFIRM_TRANSACTION = 1,
  TRANSACTION_SIGNED = 2
}

export default function SendConfirmModal({ onClose, onSignComplete, signer }: SendConfirmModalProps) {
  const [currentStep, setCurrentStep] = useState<SendStep>(SendStep.PASTE_PSBT);
  const [psbtValue, setPsbtValue] = useState("");
  const [signedPsbt, setSignedPsbt] = useState("");
  const [transactionDetails, setTransactionDetails] = useState<{
    spend_address: string;
    spend_amount: number;
    recv_address: string;
    recv_amount: number;
    change_address: string;
    change_amount: number;
    tx_fee: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handlePsbtChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPsbtValue(e.target.value);
    setError(null);
  };
  
  const handleContinue = () => {
    if (currentStep === SendStep.PASTE_PSBT) {
      try {
        // Validate and decode PSBT
        const details = signer.decode_psbt(psbtValue);
        console.log('[DEV] Transaction details:', details);
        setTransactionDetails(details);
        setCurrentStep(SendStep.CONFIRM_TRANSACTION);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Invalid PSBT format');
        return;
      }
    } else if (currentStep === SendStep.CONFIRM_TRANSACTION) {
      try {
        // Sign the transaction
        const signedPsbt = signer.sign_psbt(psbtValue);
        setSignedPsbt(signedPsbt.toString());
        setCurrentStep(SendStep.TRANSACTION_SIGNED);
        
        // Notify parent component
        if (onSignComplete) {
          onSignComplete(signedPsbt.toString());
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to sign transaction');
        return;
      }
    } else {
      // Close the modal
      onClose();
    }
  };
  
  const getStepTitle = () => {
    switch (currentStep) {
      case SendStep.PASTE_PSBT:
        return "Step 1: Paste PSBT";
      case SendStep.CONFIRM_TRANSACTION:
        return "Step 2: Confirm Transaction";
      case SendStep.TRANSACTION_SIGNED:
        return "Step 3: Transaction Signed";
      default:
        return "";
    }
  };
  
  const getButtonText = () => {
    switch (currentStep) {
      case SendStep.PASTE_PSBT:
        return "Continue";
      case SendStep.CONFIRM_TRANSACTION:
        return "Sign";
      case SendStep.TRANSACTION_SIGNED:
        return "OK";
      default:
        return "";
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case SendStep.PASTE_PSBT:
        return (
          <div style={{ margin: "24px 12px" }}>
            {error && (
              <div style={{
                color: "#C02F1D",
                background: "#2A0A07",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "14px",
              }}>
                {error}
              </div>
            )}
            <textarea
              value={psbtValue}
              onChange={handlePsbtChange}
              placeholder="Paste your PSBT data here..."
              style={{
                width: "100%",
                minHeight: 140,
                padding: 16,
                borderRadius: 8,
                background: "#1a1200",
                border: "1px solid #F98029",
                color: "#F98029",
                fontFamily: "monospace",
                resize: "vertical",
                boxShadow: "0 0 8px rgba(249, 128, 41, 0.1)",
                paddingRight: 0,
              }}
            />
          </div>
        );
      case SendStep.CONFIRM_TRANSACTION:
        if (!transactionDetails) return null;
        return (
          <div style={{
            marginTop: 16,
            lineHeight: 1.6,
            padding: "0 12px",
          }}>
            <p style={{ textAlign: "center" }}>
              Send <span style={{ fontWeight: "bold" }}>{transactionDetails.recv_amount}</span> satoshis
            </p>
            <div style={{ margin: "16px 0" }}>
              <div style={{ fontSize: 14, opacity: 0.8 }}>From:</div>
              <div style={{
                padding: 8,
                background: "#1a1200",
                borderRadius: 6,
                marginTop: 4,
                fontFamily: "monospace",
                wordBreak: "break-all",
              }}>
                {transactionDetails.spend_address}
              </div>
            </div>
            <div style={{ margin: "16px 0" }}>
              <div style={{ fontSize: 14, opacity: 0.8 }}>To:</div>
              <div style={{
                padding: 8,
                background: "#1a1200",
                borderRadius: 6,
                marginTop: 4,
                fontFamily: "monospace",
                wordBreak: "break-all",
              }}>
                {transactionDetails.recv_address}
              </div>
            </div>
            <div style={{ margin: "16px 0" }}>
              <div style={{ fontSize: 14, opacity: 0.8 }}>Change Address:</div>
              <div style={{
                padding: 8,
                background: "#1a1200",
                borderRadius: 6,
                marginTop: 4,
                fontFamily: "monospace",
                wordBreak: "break-all",
              }}>
                {transactionDetails.change_address}
              </div>
            </div>
            <div style={{ margin: "16px 0" }}>
              <div style={{ fontSize: 14, opacity: 0.8 }}>Network Fee:</div>
              <div style={{
                padding: 8,
                background: "#1a1200",
                borderRadius: 6,
                marginTop: 4,
                fontFamily: "monospace",
                display: "flex",
                justifyContent: "space-between",
              }}>
                <span>{transactionDetails.tx_fee} sats</span>
                <span style={{ opacity: 0.7 }}>≈ {transactionDetails.tx_fee / 100000000} BTC</span>
              </div>
            </div>
          </div>
        );
      case SendStep.TRANSACTION_SIGNED:
        return (
          <div style={{
            marginTop: 16,
            textAlign: "center",
            lineHeight: 1.6,
            padding: "0 12px",
          }}>
            <p>
              Your transaction has been successfully signed.
            </p>
            <div style={{
              marginTop: 16,
              padding: 12,
              background: "#1a1200",
              borderRadius: 8,
              fontFamily: "monospace",
              fontSize: 13,
              overflow: "auto",
              maxHeight: 100,
              textAlign: "left",
              wordBreak: "break-all",
            }}>
              {signedPsbt}
            </div>
          </div>
        );
      default:
        return null;
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
      <div style={{
        background: "#181406",
        borderRadius: 16,
        padding: 24,
        position: "relative",
        maxWidth: "90%",
        width: 500,
        boxShadow: "0 0 24px #F9802966",
        border: "1px solid #F98029",
        color: "#F98029",
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
        
        {/* Step indicator */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 24,
        }}>
          {[SendStep.PASTE_PSBT, SendStep.CONFIRM_TRANSACTION, SendStep.TRANSACTION_SIGNED].map((step) => (
            <div 
              key={step}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: currentStep >= step ? "#F98029" : "transparent",
                border: `2px solid ${currentStep >= step ? "#F98029" : "#F9802966"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: currentStep >= step ? "#181406" : "#F98029",
                fontWeight: "bold",
                margin: "0 8px",
              }}
            >
              {step + 1}
            </div>
          ))}
        </div>
        
        <div style={{
          textAlign: "center",
          marginTop: 8,
          marginBottom: 16,
          fontSize: 20,
          fontWeight: 600,
        }}>
          {getStepTitle()}
        </div>
        
        {renderStepContent()}
        
        <div style={{
          marginTop: 24,
          display: "flex",
          justifyContent: "center",
        }}>
          <button
            onClick={handleContinue}
            style={{
              background: "#F98029",
              color: "#181406",
              border: "none",
              borderRadius: 8,
              padding: "12px 24px",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
              minWidth: 120,
            }}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
} 
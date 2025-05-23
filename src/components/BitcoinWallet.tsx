import React, { useState, useEffect } from "react";
import QRCodeModal, { PresentationContext } from "./QRCodeModal";
import SendConfirmModal from "./SendConfirmModal";
import DisclaimerModal from "./DisclaimerModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { BitcoinWalletService } from "../services/BitcoinWalletService";
import { StorageService } from "../services/StorageService";

// Add prop type for onBack
interface BitcoinWalletProps {
  onBack?: () => void;
}

export default function BitcoinWallet({ onBack }: BitcoinWalletProps) {
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(true);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [currentReceiveAddress, setCurrentReceiveAddress] = useState('');
  const [signedTransaction, setSignedTransaction] = useState<string | null>(null);
  const [walletService] = useState(new BitcoinWalletService());
  const [isLoading, setIsLoading] = useState(true);
  
  // Reference to signer to access in component functions
  const signerRef = React.useRef<any>(null);

  // Initialize the wallet service
  useEffect(() => {
    async function initializeWallet() {
      try {
        setIsLoading(true);
        await walletService.initialize();
        if (walletService.signerInstance) {
          signerRef.current = walletService.signerInstance;
          // Initialize the first address
          getCurrentReceiveAddress();
        }
      } catch (error) {
        console.error("Error initializing wallet:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    initializeWallet();
  }, []);

  // Get the current receive address and return its string representation
  const getCurrentReceiveAddress = () => {
    try {
      console.log("Getting current receive address");
      if (!signerRef.current) {
        console.error("Signer not initialized");
        return "Wallet not initialized";
      }
      
      const address = signerRef.current.recv_address;
      console.log("Spend address object:", address);
      
      // Get address string representation
      // Check if address has an address property
      if (address && address.address) {
        console.log("Address from address property:", address.address);
        return address.address;
      } else if (typeof address.toString === 'function') {
        const addressString = address.toString();
        console.log("Address as string:", addressString);
        return addressString;
      } else {
        console.error("Cannot get string representation of address", address);
        return String(address); // Fallback conversion
      }
    } catch (error) {
      console.error("Error in getCurrentReceiveAddress:", error);
      return "Error getting address";
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(walletService.xpub);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleShowQR = () => {
    setShowQRModal(true);
  };

  const handleCloseQR = () => {
    setShowQRModal(false);
  };
  
  const handleReceive = () => {
    console.log("Receive button clicked");
    try {
      // Get the current receive address
      const address = getCurrentReceiveAddress();
      console.log("Received address:", address);
      setCurrentReceiveAddress(address);
      setShowReceiveModal(true);
    } catch (error) {
      console.error("Error in handleReceive:", error);
    }
  };
  
  const handleCloseReceive = () => {
    setShowReceiveModal(false);
  };
  
  const handleNextAddress = () => {
    console.log("Next address button clicked");
    try {
      // Simply increment the signer's internal index 
      // (the set_index method does this if no index is provided)
      if (signerRef.current) {
        signerRef.current.set_index();
        console.log("New index:", signerRef.current.wallet_index);
        
        // Get the new address based on the incremented index
        const address = getCurrentReceiveAddress();
        console.log("New address:", address);
        setCurrentReceiveAddress(address);
      }
    } catch (error) {
      console.error("Error in handleNextAddress:", error);
    }
  };
  
  const handleSend = () => {
    console.log("Send button clicked");
    setShowSendModal(true);
  };
  
  const handleCloseSend = () => {
    setShowSendModal(false);
  };
  
  const handleSignComplete = (signedPsbt: string) => {
    console.log("Transaction signed:", signedPsbt);
    setSignedTransaction(signedPsbt);
  };

  const handleCloseDisclaimer = () => {
    setShowDisclaimerModal(false);
  };

  const handleShowDeleteConfirm = () => {
    setShowDeleteConfirmModal(true);
  };

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirmModal(false);
  };

  const handleDeleteSeed = async () => {
    try {
      const storageService = StorageService.getInstance();
      await storageService.clearWalletData();
      // Call onBack to navigate back to IntroScreen
      if (onBack) onBack();
    } catch (error) {
      console.error("Error deleting wallet data:", error);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#181406",
        color: "#F98029",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Cinzel', serif",
      }}>
        Loading wallet...
      </div>
    );
  }

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
      {/* Logo instead of title */}
      <img
        src="/arcana-logo-no-bg2.png"
        alt="Arcana Seed Lodge Logo"
        style={{
          width: "auto",
          maxWidth: 480,
          height: "auto",
          maxHeight: 220,
          marginBottom: 12,
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
          title={walletService.xpub}
        >
          {walletService.xpub}
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
        gap: 16,
        marginBottom: 16,
      }}>
        {/* Send Button */}
        <button 
          onClick={handleSend}
          style={{
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
        <button 
          onClick={handleReceive}
          style={{
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
      
      {/* Add Delete Seed button */}
      <button
        onClick={handleShowDeleteConfirm}
        style={{
          background: "#2A0A07",
          border: "2px solid #C02F1D",
          borderRadius: 8,
          color: "#C02F1D",
          padding: "10px 20px",
          marginTop: 40,
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C02F1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
        Delete Seed
      </button>
      
      {/* QR Code Modal for xpub */}
      {showQRModal && <QRCodeModal onClose={handleCloseQR} content={walletService.xpub} />}
      
      {/* QR Code Modal for receive address */}
      {showReceiveModal && (
        <QRCodeModal 
          onClose={handleCloseReceive} 
          content={currentReceiveAddress}
          presentationContext={PresentationContext.RECEIVE_ADDRESS_RENDERING}
          addressIndex={signerRef.current?.wallet_index}
          onNextAddress={handleNextAddress}
        />
      )}
      
      {/* Send Confirm Modal */}
      {showSendModal && (
        <SendConfirmModal 
          onClose={handleCloseSend} 
          onSignComplete={handleSignComplete}
          signer={signerRef.current}
        />
      )}

      {/* Disclaimer Modal */}
      {showDisclaimerModal && (
        <DisclaimerModal 
          onClose={handleCloseDisclaimer} 
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <ConfirmDeleteModal
          onClose={handleCloseDeleteConfirm}
          onConfirm={handleDeleteSeed}
        />
      )}
    </div>
  );
} 
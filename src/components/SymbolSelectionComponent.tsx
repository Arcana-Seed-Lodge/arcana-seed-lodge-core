import React, { useState, useEffect } from 'react';
import { SYMBOLS } from '../symbols';

interface SymbolSelectionComponentProps {
  onSymbolsSelected: (selectedSymbols: string[]) => void;
  onBack?: () => void;
}

const SymbolSelectionComponent: React.FC<SymbolSelectionComponentProps> = ({ 
  onSymbolsSelected,
  onBack
}) => {
  // Store selected indexes with their positions
  const [selectedSequence, setSelectedSequence] = useState<number[]>([]);
  const [imagesExist, setImagesExist] = useState(false);
  
  // Constants for styling
  const ORANGE = "#F98029";
  const BACKGROUND = "#181406";

  // Check if symbol images exist
  useEffect(() => {
    // Try to load one of the images to see if they exist
    const img = new Image();
    img.onload = () => setImagesExist(true);
    img.onerror = () => setImagesExist(false);
    img.src = '/symbol-images/symbol0.png';
  }, []);

  // Handle symbol selection with a completely new approach
  const handleSymbolClick = (index: number) => {
    // If we have 4 selections, do nothing (unless clicking one already selected to remove it)
    if (selectedSequence.length === 4) {
      // For removal, find and remove the first occurrence of this index
      const position = selectedSequence.indexOf(index);
      if (position !== -1) {
        const newSequence = [...selectedSequence];
        newSequence.splice(position, 1);
        setSelectedSequence(newSequence);
      }
      return;
    }
    
    // Add the symbol to our sequence
    setSelectedSequence([...selectedSequence, index]);
  };
  
  // Handle individual selected symbol removal
  const handleRemoveSymbol = (position: number) => {
    const newSequence = [...selectedSequence];
    newSequence.splice(position, 1);
    setSelectedSequence(newSequence);
  };

  // Handle completion - convert indexes to symbols
  const handleComplete = () => {
    const symbols = selectedSequence.map(index => SYMBOLS[index] || String(index));
    onSymbolsSelected(symbols);
  };

  // Count occurrences of a symbol in our selection
  const countOccurrences = (index: number) => {
    return selectedSequence.filter(i => i === index).length;
  };

  // Check if a symbol is the most recently selected one
  const isLastSelected = (index: number) => {
    return selectedSequence.length > 0 && 
           selectedSequence[selectedSequence.length - 1] === index;
  };

  // Render a symbol - either image or text
  const renderSymbol = (symbol: string, index: number) => {
    if (imagesExist) {
      return (
        <img 
          src={`/symbol-images/symbol${index}.png`} 
          alt={`Symbol ${index}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      );
    }
    
    // Fallback to showing either the emoji or the index number
    return symbol !== String(index) ? symbol : (
      <span style={{ color: ORANGE }}>{index}</span>
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: BACKGROUND,
        color: ORANGE,
        fontFamily: "'Cinzel', serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '20px 20px 40px',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Back Arrow */}
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            background: 'none',
            border: 'none',
            color: ORANGE,
            cursor: 'pointer',
            zIndex: 2,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Scrollable Symbol Grid - 4x8 layout */}
      <div
        style={{
          maxHeight: '50vh',
          overflowY: 'auto',
          width: '100%',
          maxWidth: 650,
          padding: '0 20px',
          marginBottom: 20,
          marginTop: 20,
          scrollbarWidth: 'thin',
          scrollbarColor: `${ORANGE}44 ${BACKGROUND}`,
        }}
        className="symbol-grid-container"
      >
        {/* Add a style tag for the webkit scrollbar styles */}
        <style>
          {`
            .symbol-grid-container::-webkit-scrollbar {
              width: 8px;
            }
            .symbol-grid-container::-webkit-scrollbar-track {
              background: ${BACKGROUND};
            }
            .symbol-grid-container::-webkit-scrollbar-thumb {
              background-color: ${ORANGE}44;
              border-radius: 4px;
            }
          `}
        </style>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            padding: '10px 5px',
          }}
        >
          {Array.from({ length: 32 }).map((_, index) => {
            const symbol = SYMBOLS[index] || String(index);
            const count = countOccurrences(index);
            const isSelected = count > 0;
            const isLast = isLastSelected(index);
            
            return (
              <div
                key={index}
                onClick={() => handleSymbolClick(index)}
                style={{
                  background: BACKGROUND,
                  border: `2px solid ${isSelected ? ORANGE : ORANGE + '66'}`,
                  borderRadius: 8,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 8,
                  cursor: 'pointer',
                  fontSize: 22,
                  aspectRatio: '1',
                  transition: 'all 0.2s',
                  boxShadow: isLast ? `0 0 16px ${ORANGE}` : isSelected ? `0 0 12px ${ORANGE}99` : 'none',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  margin: '6px 0',
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '100%',
                  position: 'relative',
                }}
              >
                {renderSymbol(symbol, index)}
                
                {/* Show selection count badge if selected multiple times */}
                {count > 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 4,
                      right: 4,
                      background: ORANGE,
                      color: BACKGROUND,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: 10,
                      boxShadow: `0 0 4px ${ORANGE}66`,
                    }}
                  >
                    {count}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Title in the middle */}
      <h2
        style={{
          textAlign: 'center',
          margin: '20px 0 30px',
          fontSize: 24,
          textShadow: `0 0 8px ${ORANGE}55`,
          letterSpacing: 1.5,
          color: ORANGE,
          maxWidth: '80%',
        }}
      >
        Select 4 symbols to finalize the transportation to portus aeruelius (Passphrase).
      </h2>

      {/* Selected Symbols Display with sequence numbers */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          marginBottom: 30,
        }}
      >
        {Array.from({ length: 4 }).map((_, position) => {
          const selectedIndex = selectedSequence[position];
          const hasSymbol = selectedIndex !== undefined;
          const symbol = hasSymbol ? SYMBOLS[selectedIndex] || String(selectedIndex) : undefined;
          
          return (
            <div
              key={position}
              onClick={() => hasSymbol && handleRemoveSymbol(position)}
              style={{
                position: 'relative',
                width: 70,
                height: 70,
                border: `2px solid ${ORANGE}`,
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 24,
                background: BACKGROUND,
                boxShadow: `0 0 8px ${ORANGE}44`,
                cursor: hasSymbol ? 'pointer' : 'default',
              }}
            >
              {/* Sequence number */}
              {hasSymbol && (
                <div
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: ORANGE,
                    color: BACKGROUND,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: 12,
                    boxShadow: `0 0 6px ${ORANGE}66`,
                  }}
                >
                  {position + 1}
                </div>
              )}
              
              {hasSymbol && renderSymbol(symbol!, selectedIndex)}
            </div>
          );
        })}
      </div>

      {/* Complete Button */}
      <button
        onClick={handleComplete}
        disabled={selectedSequence.length !== 4}
        style={{
          background: selectedSequence.length === 4 ? ORANGE : ORANGE + '44',
          color: selectedSequence.length === 4 ? BACKGROUND : ORANGE + '66',
          border: 'none',
          borderRadius: 8,
          padding: '10px 28px',
          fontSize: 16,
          fontWeight: 600,
          cursor: selectedSequence.length === 4 ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
          boxShadow: selectedSequence.length === 4 ? `0 0 12px ${ORANGE}66` : 'none',
          fontFamily: "'Cinzel', serif",
          marginTop: 10,
        }}
      >
        Complete
      </button>
    </div>
  );
};

export default SymbolSelectionComponent; 
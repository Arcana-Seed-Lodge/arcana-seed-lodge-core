import React from "react";
import RaindropBackground from "./RaindropBackground";

const ORANGE = "#F98029";

type IntroScreenProps = {
  onSkip: () => void;
};

export default function IntroScreen({ onSkip }: IntroScreenProps) {
  // Height of the background image in vh (e.g., 60vh) to match the reference
  const bgHeightVh = 65;

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "#181406",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      flexDirection: "column",
    }}>
      {/* Background image at the very back, aligned to top and sides, not stretching to bottom */}
      <img
        src="/intro-page-background.png"
        alt="Intro Background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: `${bgHeightVh}vh`,
          objectFit: "cover",
          objectPosition: "top center",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <RaindropBackground rainEndVh={bgHeightVh*1.5} />
      <img
        src="/arcana-logo-no-bg2.png"
        alt="Arcana Seed Lodge Logo"
        style={{
          maxWidth: 300,
          width: "60vw",
          height: "auto",
          filter: "drop-shadow(0 0 32px #F9802933)",
          zIndex: 1,
          position: "relative",
          marginBottom: 8,
          opacity: 1.0,
        }}
      />
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        zIndex: 1,
      }}>
        <button
          style={{
            background: ORANGE,
            color: "#181406",
            border: "none",
            borderRadius: 999,
            padding: "16px 48px",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 1.2,
            marginBottom: 8,
            cursor: "pointer",
            boxShadow: "0 0 12px #F9802933",
            width: 260,
            maxWidth: "80vw",
            transition: "background 0.2s, color 0.2s",
          }}
        >
          Enter the Story
        </button>
        <button
          style={{
            background: "#181406",
            color: ORANGE,
            border: `2px solid ${ORANGE}`,
            borderRadius: 999,
            padding: "16px 48px",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 1.2,
            cursor: "pointer",
            width: 260,
            maxWidth: "80vw",
            marginBottom: 24,
            transition: "background 0.2s, color 0.2s",
          }}
          onClick={onSkip}
        >
          Skip Story
        </button>
      </div>
    </div>
  );
} 
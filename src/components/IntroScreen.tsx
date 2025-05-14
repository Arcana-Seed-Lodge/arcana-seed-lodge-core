import React, { useRef, useLayoutEffect, useState } from "react";
import RaindropBackground from "./RaindropBackground";

const ORANGE = "#F98029";

type IntroScreenProps = {
  onSkip: () => void;
  onEnterStory: () => void;
};

export default function IntroScreen({ onSkip, onEnterStory }: IntroScreenProps) {
  // Height of the background area in vh
  const bgHeightVh = 60;
  const bgRef = useRef<HTMLDivElement>(null);
  const [bgHeightPx, setBgHeightPx] = useState<number>(0);

  useLayoutEffect(() => {
    function updateHeight() {
      if (bgRef.current) {
        setBgHeightPx(bgRef.current.offsetHeight);
      }
    }
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "#181406",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Cinzel', serif",
      }}
    >
      {/* Google Fonts link for Cinzel */}
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap" rel="stylesheet" />
      {/* Top background area with background image and raindrops */}
      <div
        ref={bgRef}
        style={{
          position: "relative",
          width: "100vw",
          height: `${bgHeightVh}vh`,
          backgroundImage: "url(/intro-page-background.png)",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          overflow: "hidden",
          zIndex: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        {/* Gradient blend at the bottom */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100vw",
            height: 80,
            pointerEvents: "none",
            zIndex: 2,
            background: "linear-gradient(to bottom, rgba(24,20,6,0) 0%, #181406 100%)",
          }}
        />
        {bgHeightPx > 0 && <RaindropBackground rainEndPx={bgHeightPx} />}
        {/* Logo absolutely positioned at the bottom center */}
        <img
          src="/arcana-logo-no-bg2.png"
          alt="Arcana Seed Lodge Logo"
          style={{
            maxWidth: 300,
            width: "60vw",
            height: "auto",
            filter: "drop-shadow(0 0 32px #F9802933)",
            zIndex: 3,
            position: "absolute",
            left: "50%",
            bottom: 0,
            transform: "translateX(-50%)",
            marginBottom: '-6vh',
            opacity: 1.0,
          }}
        />
      </div>
      {/* Buttons below the background area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          zIndex: 1,
          marginTop: 32,
        }}
      >
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
          onClick={onEnterStory}
        >
          Enter Story
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
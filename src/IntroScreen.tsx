import React from "react";
import RaindropBackground from "./RaindropBackground";

export default function IntroScreen() {
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
    }}>
      <RaindropBackground />
      <img
        src="/arcana-logo-no-bg2.png"
        alt="Arcana Seed Lodge Logo"
        style={{
          maxWidth: 400,
          width: "80vw",
          height: "auto",
          filter: "drop-shadow(0 0 32px #F9802933)",
          zIndex: 1,
          position: "relative",
        }}
      />
    </div>
  );
} 
import React from "react";

const NUM_DROPS = 400;
const ORANGE = "#F98029";
const ANGLE_DEGREES = -30;

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function RaindropBackground() {
  // To cover the screen at an angle, allow drops to start off-screen left and end off-screen right
  // The horizontal travel is tan(angle) * vertical travel
  // For 100vh vertical, horizontal = tan(30deg) * 100vh ≈ 0.577 * 100vh ≈ 58vw
  // So, start drops from -30vw to 100vw
  const minLeft = -30;
  const maxLeft = 100;

  // Shorten average length by 30%, randomize within 10%
  const BASE_MIN = 60 * 0.7; // 42
  const BASE_MAX = 120 * 0.7; // 84

  const drops = Array.from({ length: NUM_DROPS }).map((_, i) => {
    // Randomize within 10% of the base
    const baseLength = getRandom(BASE_MIN, BASE_MAX);
    const length = baseLength * getRandom(0.9, 1.1);
    const left = getRandom(minLeft, maxLeft); // vw
    const duration = getRandom(1.5, 3.5); // seconds
    const delay = getRandom(0, 2.5); // seconds
    const thickness = getRandom(1, 2.2); // px
    const opacity = getRandom(0.12, 0.22); // subtle, layered look
    return (
      <span
        key={i}
        style={{
          position: "absolute",
          top: 0,
          left: `${left}vw`,
          width: thickness,
          height: length,
          background: ORANGE,
          opacity,
          borderRadius: thickness,
          filter: "blur(0.5px)",
          transform: `rotate(${ANGLE_DEGREES}deg)`,
          animation: `raindrop-fall-angled ${duration}s linear ${delay}s infinite`,
          zIndex: 0,
        }}
      />
    );
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <style>{`
        @keyframes raindrop-fall-angled {
          0% { transform: translate(0, -10vh) rotate(${ANGLE_DEGREES}deg); opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(58vw, 85vh) rotate(${ANGLE_DEGREES}deg); opacity: 0; }
        }
      `}</style>
      {drops}
    </div>
  );
} 
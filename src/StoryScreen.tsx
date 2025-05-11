import React, { useState } from "react";

const ORANGE = "#F98029";

type StoryScreenProps = {
  onBack: () => void;
};

const slides = [
  {
    image: "/storyboard-images/storyboard-part1-image.png",
    text: (
      <>
        <div style={{ fontWeight: 700 }}>
          The Crown has come for your father's gold. You were<br />
          given no trial. No recourse.
        </div>
        <div style={{ marginTop: 16 }}>Just decree.</div>
      </>
    ),
  },
  {
    image: "/storyboard-images/storyboard-part2-image.png",
    text: (
      <>
        <div style={{ fontWeight: 700 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
          Pellentesque euismod, nisi eu consectetur.
        </div>
        <div style={{ marginTop: 16 }}>Lorem ipsum.</div>
      </>
    ),
  },
];

export default function StoryScreen({ onBack }: StoryScreenProps) {
  const [slide, setSlide] = useState(0);
  const current = slides[slide];

  const handleBack = () => {
    if (slide === 0) {
      onBack();
    } else {
      setSlide((s) => s - 1);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "#181406",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap" rel="stylesheet" />
      <img
        src={current.image}
        alt="story"
        style={{
          maxHeight: 320,
          maxWidth: 320,
          width: "auto",
          height: "auto",
          marginBottom: 32,
          display: "block",
        }}
      />
      <div
        style={{
          color: ORANGE,
          fontSize: 20,
          textAlign: "center",
          marginBottom: 24,
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
        }}
      >
        {current.text}
      </div>
      <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
        <button
          style={{
            background: "#181406",
            color: ORANGE,
            border: `2px solid ${ORANGE}`,
            borderRadius: 999,
            padding: "10px 32px",
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 1.1,
            cursor: "pointer",
            minWidth: 80,
            fontFamily: "'Cinzel', serif",
            transition: "background 0.2s, color 0.2s",
          }}
          onClick={handleBack}
        >
          Back
        </button>
        <button
          style={{
            background: ORANGE,
            color: "#181406",
            border: "none",
            borderRadius: 12,
            padding: "8px 28px",
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 1.1,
            cursor: "pointer",
            minWidth: 80,
            fontFamily: "'Cinzel', serif",
          }}
          onClick={() => setSlide((s) => Math.min(s + 1, slides.length - 1))}
          disabled={slide === slides.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
} 
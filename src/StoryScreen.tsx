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
          Only one option remained: vanish—and bury your legacy in the sacred code.
        </div>
      </>
    ),
  },
  {
    image: "/storyboard-images/storyboard-part3-image.png",
    text: (
      <>
        <div style={{ fontWeight: 700 }}>
          You wake up in a Charleston tavern, whispered to by Silas.<br />
          The Crown is coming - best to change location.
        </div>
      </>
    ),
  },
  {
    image: "/storyboard-images/storyboard-part4-image.png",
    text: (
      <>
        <div style={{ fontWeight: 700 }}>
          You follow the instructions from the tavern goer the night before... 
        </div>
        <div>
        ...instructions engraved on a coin alongside the symbol of the Lodge.
        </div>
      </>
    ),
  },
  {
    image: "/storyboard-images/storyboard-part5-image.png",
    text: (
      <>
        <div style={{ fontWeight: 700 }}>
          You come upon the alley described on the coin where you meet Brother Alder Blackpaw. He says:
        </div>
        <div style={{ marginTop: 16, fontStyle: "italic" }}>
          "We do not bury gold. We transmute it. Into something incorruptible."<br />
          "You will pass the Rite of Twelve Segments. And only then will your seed be sovereign."
        </div>
      </>
    ),
  },
  {
    image: "/storyboard-images/storyboard-part6-image.png",
    text: (
      <>
        <div style={{ fontWeight: 700 }}>
          You are blindfolded and taken in a horse-drawn carriage through mist and moonlight. Dialogues are riddles. The terrain echoes Charleston's marshlands and ruins.
        </div>
      </>
    ),
  },
  {
    image: "/storyboard-images/storyboard-part7-image.png",
    text: (
      <>
        <div style={{ fontWeight: 700 }}>
          At the Lodge:<br />
          You step through the heavy wooden doors, their iron hinges groaning like the throat of an ancient crypt. The scent of beeswax, damp parchment, and charred incense fills the air.<br />
          Candlelight flickers across a vaulted chamber. Stone walls breathe with age. A circle of hooded figures watches from the shadows—silent, motionless, eternal.
        </div>
      </>
    ),
  },
  {
    image: "/storyboard-images/storyboard-part8-image.png",
    text: (
      <>
        <div style={{ fontWeight: 700 }}>
          Brother Alder Blackpaw emerges from the darkness. His robe shimmers slightly in the flame's glow, lined with glyphs you half-recognize from dreams you never remembered having. He speaks:
        </div>
        <div style={{ marginTop: 16, fontStyle: "italic" }}>
          "The Rite of Twelve Segments begins with memory."<br />
          "Six places that echo in your bones. Not merely known… but felt."<br />
          "Where your spirit once stood, your seed shall find form."
        </div>
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
          borderRadius: 8,
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
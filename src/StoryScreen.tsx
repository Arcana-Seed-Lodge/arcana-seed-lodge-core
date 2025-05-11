import React, { useState, useEffect } from "react";

const ORANGE = "#F98029";
const IMAGE_FADE_DURATION = 1200; // ms
const TEXT_FADE_DURATION = 800; // ms
const TEXT_DELAY = 400; // ms delay after image starts fading
const TEXT_STAGGER_DELAY = 200; // ms between each line of text

type StoryScreenProps = {
  onBack: () => void;
};

const slides = [
  {
    image: "/storyboard-images/storyboard-part1-image.png",
    text: [
      " The Crown has come for your father's gold. You were given no trial. No recourse.",
      " Just decree."
    ],
  },
  {
    image: "/storyboard-images/storyboard-part2-image.png",
    text: [
      " Only one option remained: vanish—",
      " and bury your legacy in the sacred code."
    ],
  },
  {
    image: "/storyboard-images/storyboard-part3-image.png",
    text: [
      " You wake up in the inn on the countryside village, whispered to by Silas.",
      " The Crown is coming - best to change location."
    ],
  },
  {
    image: "/storyboard-images/storyboard-part4-image.png",
    text: [
      " You follow the instructions from the tavern goer the night before...",
      "...instructions engraved on a coin alongside the symbol of the Lodge."
    ],
  },
  {
    image: "/storyboard-images/storyboard-part5-image.png",
    text: [
      " Brother Alder Blackpaw appears in the alley. He says:",
      ' "We do not bury gold. We transmute it. Into something incorruptible."',
      ' "You will pass the Rite of Twelve Segments. And only then will your seed be sovereign."'
    ],
  },
  {
    image: "/storyboard-images/storyboard-part6-image.png",
    text: [
      " You are blindfolded and taken in a horse-drawn carriage through mist and moonlight—",
      " Dialogues are riddles. The terrain echoes Charleston's marshlands and ruins."
    ],
  },
  {
    image: "/storyboard-images/storyboard-part7-image.png",
    text: [
      " You step through the heavy wooden doors, their iron hinges groaning like the throat of an ancient crypt. The scent of damp parchment, and incense fills the air.",
      " Stone walls breathe with age. A circle of hooded figures watches from the shadows—silent, motionless, eternal."
    ],
  },
  {
    image: "/storyboard-images/storyboard-part8-image.png",
    text: [
      " Brother Alder Blackpaw emerges from the darkness, his robes aglow. He speaks:",
      ' "The Rite of Twelve Segments begins with memory."',
      ' "Six places that echo in your bones. Not merely known… but felt."',
      ' "Where your spirit once stood, your seed shall find form."'
    ],
  },
];

export default function StoryScreen({ onBack }: StoryScreenProps) {
  const [slide, setSlide] = useState(0); // logical slide
  const [displayedSlide, setDisplayedSlide] = useState(0); // image/text being shown
  const [imgVisible, setImgVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [textVisible, setTextVisible] = useState<boolean[]>([]);
  const current = slides[displayedSlide];

  // Initialize text visibility array
  useEffect(() => {
    setTextVisible(new Array(current.text.length).fill(false));
  }, [displayedSlide]);

  // On navigation, instantly hide image, swap, then fade in
  const goToSlide = (target: number, onDone?: () => void) => {
    if (isAnimating || target === displayedSlide) return;
    setIsAnimating(true);
    setImgVisible(false); // instantly hide
    setTextVisible(new Array(slides[target].text.length).fill(false)); // reset text visibility
    
    setTimeout(() => {
      setDisplayedSlide(target); // swap image
      setTimeout(() => {
        setImgVisible(true); // fade in image
        // Start text animations after image starts fading
        setTimeout(() => {
          // Stagger text animations
          slides[target].text.forEach((_, index) => {
            setTimeout(() => {
              setTextVisible(prev => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }, index * TEXT_STAGGER_DELAY);
          });
          
          setTimeout(() => {
            setIsAnimating(false);
            if (onDone) onDone();
          }, Math.max(IMAGE_FADE_DURATION, TEXT_DELAY + (slides[target].text.length * TEXT_STAGGER_DELAY) + TEXT_FADE_DURATION));
        }, TEXT_DELAY);
      }, 20);
    }, 20);
  };

  useEffect(() => {
    // Trigger fade in on first mount
    setTimeout(() => {
      setImgVisible(true);
      // Start text animations after image starts fading
      setTimeout(() => {
        current.text.forEach((_, index) => {
          setTimeout(() => {
            setTextVisible(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }, index * TEXT_STAGGER_DELAY);
        });
      }, TEXT_DELAY);
    }, 20);
  }, []);

  const handleBack = () => {
    if (isAnimating) return;
    if (slide === 0) {
      setImgVisible(false);
      setTextVisible(new Array(current.text.length).fill(false)); // Immediately reset text visibility
      setTimeout(() => onBack(), 20); // instantly hide, then go back
    } else {
      setTextVisible(new Array(current.text.length).fill(false)); // Immediately reset text visibility
      setSlide((s) => s - 1);
      goToSlide(slide - 1);
    }
  };

  const handleNext = () => {
    if (isAnimating) return;
    if (slide < slides.length - 1) {
      setTextVisible(new Array(current.text.length).fill(false)); // Immediately reset text visibility
      setSlide((s) => s + 1);
      goToSlide(slide + 1);
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
        boxSizing: "border-box",
        paddingLeft: "20vw",
        paddingRight: "20vw",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap" rel="stylesheet" />
      <img
        key={displayedSlide}
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
          opacity: imgVisible ? 1 : 0,
          transition: `opacity ${IMAGE_FADE_DURATION}ms cubic-bezier(.4,0,.2,1)`,
          userSelect: "none",
          pointerEvents: "none",
        }}
        draggable={false}
      />
      <div
        style={{
          color: ORANGE,
          fontSize: 20,
          textAlign: "center",
          marginBottom: 24,
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          minHeight: 60,
          userSelect: "none",
          pointerEvents: "none",
        }}
        key={`text-container-${displayedSlide}`}
      >
        {current.text.map((line, i) => (
          <div
            key={i}
            style={{
              marginTop: i === 0 ? 0 : 16,
              fontStyle: i > 0 ? "italic" : undefined,
              opacity: textVisible[i] ? 1 : 0,
              transform: `translateX(${textVisible[i] ? '0' : '20px'})`,
              transition: `opacity ${TEXT_FADE_DURATION}ms cubic-bezier(.4,0,.2,1), transform ${TEXT_FADE_DURATION}ms cubic-bezier(.4,0,.2,1)`,
              willChange: 'transform, opacity',
            }}
          >
            {line}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", pointerEvents: "auto", userSelect: "auto" }}>
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
            cursor: isAnimating ? "not-allowed" : "pointer",
            minWidth: 80,
            fontFamily: "'Cinzel', serif",
            transition: "background 0.2s, color 0.2s",
            opacity: isAnimating ? 0.5 : 1,
          }}
          onClick={handleBack}
          disabled={isAnimating}
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
            cursor: isAnimating ? "not-allowed" : "pointer",
            minWidth: 80,
            fontFamily: "'Cinzel', serif",
            opacity: isAnimating ? 0.5 : 1,
          }}
          onClick={handleNext}
          disabled={slide === slides.length - 1 || isAnimating}
        >
          Next
        </button>
      </div>
    </div>
  );
}

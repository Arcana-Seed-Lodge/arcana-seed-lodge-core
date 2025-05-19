import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import BitcoinWallet from "./components/BitcoinWallet";
import IntroScreen from "./components/IntroScreen";
import StoryScreen from "./components/StoryScreen";
import MapPage from "./components/MapPage";
import { StorageService } from "./services/StorageService";

// Define enums for tracking application state
enum Screen {
  INTRO = "intro",
  STORY = "story",
  MAP = "map",
  WALLET = "wallet"
}

enum StoryPart {
  PART1 = "part1",
  PART2 = "part2"
}

// Track how user arrived at the map
enum MapEntryPoint {
  FROM_INTRO = "from_intro",
  FROM_STORY = "from_story"
}

function App() {
  // Track which screen to show
  const [screen, setScreen] = useState<Screen>(Screen.INTRO);
  // Track which story part is active
  const [storyPart, setStoryPart] = useState<StoryPart>(StoryPart.PART1);
  // Track how user arrived at the map
  const [mapEntryPoint, setMapEntryPoint] = useState<MapEntryPoint>(MapEntryPoint.FROM_INTRO);
  
  // Check if user has a bitcoin PK stored
  const [hasBitcoinPK, setHasBitcoinPK] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user has stored wallet data
  useEffect(() => {
    async function checkStoredWallet() {
      try {
        const storageService = StorageService.getInstance();
        const geohashes = await storageService.getGeohashes();
        const symbols = await storageService.getSymbols();
        
        // Only set hasWallet to true if both geohashes and symbols are available
        const hasWallet = geohashes && symbols && 
                          Array.isArray(geohashes) && geohashes.length > 0 &&
                          Array.isArray(symbols) && symbols.length > 0;
                          
        setHasBitcoinPK(hasWallet);
        
        if (hasWallet) {
          setScreen(Screen.WALLET);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking stored wallet:", error);
        setIsLoading(false);
      }
    }
    
    checkStoredWallet();
  }, []);

  // Function to handle story completion
  const handleStoryComplete = () => {
    if (storyPart === StoryPart.PART1) {
      setMapEntryPoint(MapEntryPoint.FROM_STORY);
      setScreen(Screen.MAP);
    } else {
      setScreen(Screen.WALLET);
    }
  };

  // Function to handle map back button
  const handleMapBack = () => {
    if (mapEntryPoint === MapEntryPoint.FROM_INTRO) {
      setScreen(Screen.INTRO);
    } else {
      // Go back to Part 1 of the story
      setStoryPart(StoryPart.PART1);
      setScreen(Screen.STORY);
    }
  };

  // Function to handle map completion
  const handleMapComplete = () => {
    // Skip story part 2 if user came directly from intro (skipped story)
    if (mapEntryPoint === MapEntryPoint.FROM_INTRO) {
      setScreen(Screen.WALLET);
    } else {
      setStoryPart(StoryPart.PART2);
      setScreen(Screen.STORY);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        background: "#181406",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#F98029",
        fontFamily: "'Cinzel', serif",
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ background: "#181406", minHeight: "100vh", width: "100vw" }}>
      {screen === Screen.MAP && (
        <MapPage 
          onContinue={handleMapComplete} 
          onBack={handleMapBack}
        />
      )}
      {screen === Screen.INTRO && (
        <IntroScreen 
          onSkip={() => {
            setMapEntryPoint(MapEntryPoint.FROM_INTRO);
            setScreen(Screen.MAP);
          }} 
          onEnterStory={() => {
            setStoryPart(StoryPart.PART1);
            setScreen(Screen.STORY);
          }} 
        />
      )}
      {screen === Screen.STORY && (
        <StoryScreen 
          onBack={() => setScreen(Screen.INTRO)} 
          onComplete={handleStoryComplete}
          storyPart={storyPart}
        />
      )}
      {screen === Screen.WALLET && (
        <BitcoinWallet onBack={() => setScreen(Screen.INTRO)} />
      )}
    </div>
  );
}

export default App;

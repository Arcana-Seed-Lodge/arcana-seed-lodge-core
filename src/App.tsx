import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import BitcoinWallet from "./components/BitcoinWallet";
import IntroScreen from "./components/IntroScreen";
import StoryScreen from "./components/StoryScreen";
import MapPage from "./components/MapPage";

function App() {
  // Track which screen to show
  const [screen, setScreen] = useState("map"); // 'intro', 'story', 'wallet', or 'map'

  return (
    <div style={{ background: "#181406", minHeight: "100vh", width: "100vw" }}>
      {screen === "map" && <MapPage />}
      {screen === "intro" && (
        <IntroScreen onSkip={() => setScreen("wallet")} onEnterStory={() => setScreen("story")} />
      )}
      {screen === "story" && <StoryScreen onBack={() => setScreen("intro")} />}
      {screen === "wallet" && <BitcoinWallet onBack={() => setScreen("intro")} />}
    </div>
  );
}

export default App;

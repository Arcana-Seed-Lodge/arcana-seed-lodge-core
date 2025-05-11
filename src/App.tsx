import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import BitcoinWallet from "./BitcoinWallet";
import IntroScreen from "./IntroScreen";
import StoryScreen from "./StoryScreen";

function App() {
  // Track which screen to show
  const [screen, setScreen] = useState("intro"); // 'intro', 'story', or 'wallet'

  return (
    <div style={{ background: "#181406", minHeight: "100vh", width: "100vw" }}>
      {screen === "intro" && (
        <IntroScreen onSkip={() => setScreen("wallet")} onEnterStory={() => setScreen("story")} />
      )}
      {screen === "story" && <StoryScreen onBack={() => setScreen("intro")} />}
      {screen === "wallet" && <BitcoinWallet onBack={() => setScreen("intro")} />}
    </div>
  );
}

export default App;

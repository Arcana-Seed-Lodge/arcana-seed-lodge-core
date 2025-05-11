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

  if (screen === "intro") {
    return <IntroScreen onSkip={() => setScreen("wallet")} onEnterStory={() => setScreen("story")} />;
  }
  if (screen === "story") {
    return <StoryScreen onBack={() => setScreen("intro")} />;
  }
  return <BitcoinWallet onBack={() => setScreen("intro")} />;
}

export default App;

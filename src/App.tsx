import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import BitcoinWallet from "./BitcoinWallet";
import IntroScreen from "./IntroScreen";

function App() {
  // Track which screen to show
  const [screen, setScreen] = useState("intro"); // 'intro' or 'wallet'

  // Example: you can later call setScreen('wallet') to switch

  if (screen === "intro") {
    return <IntroScreen onSkip={() => setScreen("wallet")} />;
  }
  return <BitcoinWallet onBack={() => setScreen("intro")} />;
}

export default App;

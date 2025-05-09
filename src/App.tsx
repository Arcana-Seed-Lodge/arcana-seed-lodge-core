import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import BitcoinWallet from "./BitcoinWallet";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://v1.tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return <BitcoinWallet />;
}

export default App;

"use client";
import { useState } from "react";
import LanguageScreen from "./components/LanguageScreen";
import RegisterScreen from "./components/RegisterScreen";
import PolicyModal from "./components/PolicyModal";
import ItemScreen from "./components/ItemScreen";
import type { ItemConfig } from "./components/ItemScreen";
import GaugeScreen from "./components/GaugeScreen";
import type { GaugeConfig } from "./components/GaugeScreen";
import ImageScreen from "./components/ImageScreen";
import type { ImageResult } from "./components/ImageScreen";
import ResultScreen from "./components/ResultScreen";

type Screen = "lang" | "register" | "item" | "gauge" | "image" | "result";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("lang");
  const [showPolicy, setShowPolicy] = useState(false);
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [item, setItem] = useState<ItemConfig | null>(null);
  const [gauge, setGauge] = useState<GaugeConfig | null>(null);
  const [imageResult, setImageResult] = useState<ImageResult | null>(null);

  const restart = () => {
    setItem(null); setGauge(null); setImageResult(null);
    setScreen("lang");
  };

  const handleRegisterNext = () => {
    if (!policyAgreed) {
      setShowPolicy(true);
    } else {
      setScreen("item");
    }
  };

  const handlePolicyAgree = () => {
    setPolicyAgreed(true);
    setShowPolicy(false);
    setScreen("item");
  };

  return (
    <div className="app-shell">
      {!["lang", "register"].includes(screen) && (
        <div style={{ background: "#FF9900", padding: "12px 20px", display: "flex", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "0.04em" }}>Knittin</span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", letterSpacing: "0.1em", marginLeft: "auto" }}>
            編み図ジェネレーター
          </span>
        </div>
      )}

      {showPolicy && (
        <PolicyModal
          onAgree={handlePolicyAgree}
          onClose={() => setShowPolicy(false)}
        />
      )}

      {screen === "lang" && <LanguageScreen onNext={() => setScreen("register")} />}
      {screen === "register" && (
        <RegisterScreen
          onNext={handleRegisterNext}
          onBack={() => setScreen("lang")}
        />
      )}
      {screen === "item" && (
        <ItemScreen
          onNext={(config) => { setItem(config); setScreen("gauge"); }}
          onBack={() => setScreen("register")}
        />
      )}
      {screen === "gauge" && item && (
        <GaugeScreen
          item={item}
          onNext={(g) => { setGauge(g); setScreen("image"); }}
          onBack={() => setScreen("item")}
        />
      )}
      {screen === "image" && item && gauge && (
        <ImageScreen
          item={item}
          gauge={gauge}
          onNext={(r) => { setImageResult(r); setScreen("result"); }}
          onBack={() => setScreen("gauge")}
        />
      )}
      {screen === "result" && item && gauge && imageResult && (
        <ResultScreen
          item={item}
          gauge={gauge}
          imageResult={imageResult}
          onBack={() => setScreen("image")}
          onRestart={restart}
        />
      )}
    </div>
  );
}

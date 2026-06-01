"use client";
import { useState } from "react";
import LanguageScreen from "./components/LanguageScreen";
import PolicyScreen from "./components/PolicyScreen";
import ItemScreen, { ItemConfig } from "./components/ItemScreen";
import GaugeScreen, { GaugeConfig } from "./components/GaugeScreen";
import ImageScreen, { ImageResult } from "./components/ImageScreen";
import ResultScreen from "./components/ResultScreen";

type Screen = "lang" | "policy" | "item" | "gauge" | "image" | "result";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("lang");
  const [item, setItem] = useState<ItemConfig | null>(null);
  const [gauge, setGauge] = useState<GaugeConfig | null>(null);
  const [imageResult, setImageResult] = useState<ImageResult | null>(null);

  const restart = () => {
    setItem(null); setGauge(null); setImageResult(null);
    setScreen("lang");
  };

  return (
    <div className="app-shell">
      {/* header (main screens only) */}
      {!["lang", "policy"].includes(screen) && (
        <div style={{ background: "#FF9900", padding: "12px 20px", display: "flex", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "0.04em" }}>Knittin</span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", letterSpacing: "0.1em", marginLeft: "auto" }}>
            編み図ジェネレーター
          </span>
        </div>
      )}

      {screen === "lang" && <LanguageScreen onNext={() => setScreen("policy")} />}
      {screen === "policy" && <PolicyScreen onNext={() => setScreen("item")} onBack={() => setScreen("lang")} />}
      {screen === "item" && (
        <ItemScreen
          onNext={(config) => { setItem(config); setScreen("gauge"); }}
          onBack={() => setScreen("policy")}
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

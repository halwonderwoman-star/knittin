"use client";
import { useState } from "react";

const LANGS = [
  { flag: "🇯🇵", label: "日本語" },
  { flag: "🇺🇸", label: "English" },
  { flag: "🇨🇳", label: "中文" },
  { flag: "🇰🇷", label: "한국어" },
  { flag: "🇫🇷", label: "Français" },
  { flag: "🇩🇪", label: "Deutsch" },
];

type Props = { onNext: () => void };

export default function LanguageScreen({ onNext }: Props) {
  const [selected, setSelected] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Hero */}
      <div style={{
        background: "#FF9900",
        padding: "40px 24px 48px",
        textAlign: "center",
        position: "relative",
      }}>
        <div style={{
          fontSize: 32,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "0.04em",
          marginBottom: 4,
        }}>
          Knittin
        </div>
        <div style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.75)",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}>
          Select Language
        </div>
        {/* wave */}
        <div style={{
          position: "absolute",
          bottom: -1,
          left: 0,
          right: 0,
          height: 32,
          background: "#fff",
          borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
        }} />
      </div>

      {/* Lang grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        padding: "24px 20px 16px",
        flex: 1,
      }}>
        {LANGS.map((lang, i) => (
          <div
            key={i}
            className={`select-card ${selected === i ? "selected" : ""}`}
            style={{ padding: "13px 12px", display: "flex", alignItems: "center", gap: 10 }}
            onClick={() => setSelected(i)}
          >
            <span style={{ fontSize: 22 }}>{lang.flag}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#222" }}>{lang.label}</span>
          </div>
        ))}
      </div>

      <div className="footer-nav one-col">
        <button className="btn-primary" onClick={onNext}>
          次へ →
        </button>
      </div>
    </div>
  );
}

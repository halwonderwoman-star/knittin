"use client";
import { useState } from "react";
import ProgressBar from "./ProgressBar";

const ITEMS = [
  { icon: "◇", name: "クッション", sub: "45×45cm〜", w: 45, h: 45 },
  { icon: "◻", name: "トートバッグ", sub: "A4〜大型", w: 35, h: 40 },
  { icon: "△", name: "セーター", sub: "S / M / L / XL", w: 50, h: 65 },
  { icon: "○", name: "ニット帽", sub: "フリーサイズ", w: 22, h: 24 },
  { icon: "✦", name: "手袋", sub: "S / M / L", w: 10, h: 22 },
  { icon: "⌇", name: "ソックス", sub: "22〜29cm", w: 10, h: 24 },
];

export type ItemConfig = {
  itemName: string;
  stitch: "crochet" | "knit";
  width: number;
  height: number;
};

type Props = { onNext: (config: ItemConfig) => void; onBack: () => void };

export default function ItemScreen({ onNext, onBack }: Props) {
  const [selectedItem, setSelectedItem] = useState(0);
  const [stitch, setStitch] = useState<"crochet" | "knit">("knit");
  const [width, setWidth] = useState(45);
  const [height, setHeight] = useState(45);

  const handleItemSelect = (i: number) => {
    setSelectedItem(i);
    setWidth(ITEMS[i].w);
    setHeight(ITEMS[i].h);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <ProgressBar step={0} />
      <div style={{ padding: "16px 20px", flex: 1, overflowY: "auto" }}>

        <p className="section-label">作りたいアイテム</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className={`select-card ${selectedItem === i ? "selected" : ""}`}
              style={{ padding: "14px 10px", textAlign: "center" }}
              onClick={() => handleItemSelect(i)}
            >
              <div style={{ fontSize: 24, marginBottom: 5, color: selectedItem === i ? "#FF9900" : "#CCCCCC" }}>
                {item.icon}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#222" }}>{item.name}</div>
              <div style={{ fontSize: 10, color: "#AAAAAA", marginTop: 2 }}>{item.sub}</div>
            </div>
          ))}
        </div>

        <p className="section-label">編み方</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { id: "knit" as const, icon: "🧶", name: "棒編み", desc: "なめらかな仕上がり。ウェア向き" },
            { id: "crochet" as const, icon: "🪝", name: "かぎ編み", desc: "立体感ある模様。装飾向き" },
          ].map((s) => {
            const isCircularItem = [3, 5].includes(selectedItem); // ニット帽・ソックス
            const isKnit = s.id === "knit";
            const label = isCircularItem && isKnit ? "輪針 / 4本針" : s.name;
            const desc = isCircularItem && isKnit ? "筒状に編む輪編み。輪針・4本針に対応" : s.desc;
            return (
              <div
                key={s.id}
                className={`select-card ${stitch === s.id ? "selected" : ""}`}
                style={{ padding: "14px 12px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
                onClick={() => setStitch(s.id)}
              >
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#222" }}>{label}</span>
                <span style={{ fontSize: 10, color: "#AAAAAA", lineHeight: 1.4 }}>{desc}</span>
                {isCircularItem && isKnit && (
                  <span style={{ fontSize: 9, background: "#FF9900", color: "#fff", padding: "2px 6px", borderRadius: 4, marginTop: 2 }}>輪編み対応</span>
                )}
              </div>
            );
          })}
        </div>

        <p className="section-label">仕上がりサイズ</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={{ fontSize: 11, color: "#AAAAAA", display: "block", marginBottom: 5 }}>幅</label>
            <div className="input-wrap">
              <input type="number" value={width} min={5} max={200} onChange={e => setWidth(Number(e.target.value))} />
              <span className="unit">cm</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "#AAAAAA", display: "block", marginBottom: 5 }}>高さ / 丈</label>
            <div className="input-wrap">
              <input type="number" value={height} min={5} max={200} onChange={e => setHeight(Number(e.target.value))} />
              <span className="unit">cm</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-nav one-col">
        <button className="btn-primary" onClick={() => onNext({
          itemName: ITEMS[selectedItem].name,
          stitch,
          width,
          height,
        })}>
          ゲージ入力へ →
        </button>
      </div>
    </div>
  );
}

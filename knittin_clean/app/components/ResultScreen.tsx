"use client";
import { useRef, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import { ItemConfig } from "./ItemScreen";
import { GaugeConfig } from "./GaugeScreen";
import { ImageResult } from "./ImageScreen";

type Props = { item: ItemConfig; gauge: GaugeConfig; imageResult: ImageResult; onBack: () => void; onRestart: () => void };

function closest(r: number, g: number, b: number, centers: [number, number, number][]): number {
  let best = 0, bd = Infinity;
  centers.forEach((c, i) => {
    const d = (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;
    if (d < bd) { bd = d; best = i; }
  });
  return best;
}

export default function ResultScreen({ item, gauge, imageResult, onBack, onRestart }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs || !imageResult.imageDataUrl) return;
    const img = new Image();
    img.onload = () => {
      const displayW = cvs.parentElement!.clientWidth;
      cvs.width = displayW;
      cvs.height = Math.min(img.height * (displayW / img.width), 240);
      const ctx = cvs.getContext("2d")!;
      ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
      // watermark
      ctx.save();
      ctx.translate(cvs.width / 2, cvs.height / 2);
      ctx.rotate(-Math.PI / 6);
      ctx.font = "bold 22px sans-serif";
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.textAlign = "center";
      ctx.fillText("PREVIEW ONLY", 0, 0);
      ctx.restore();
    };
    img.src = imageResult.imageDataUrl;
  }, [imageResult]);

  const toHex = ([r, g, b]: [number, number, number]) =>
    "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <ProgressBar step={3} />
      <div style={{ padding: "16px 20px", flex: 1, overflowY: "auto" }}>

        <p className="section-label">生成された編み図</p>
        <div style={{ position: "relative", border: "1px solid #F0F0F0", borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
          <canvas ref={canvasRef} style={{ display: "block", width: "100%", imageRendering: "pixelated" }} />
        </div>

        <div className="result-grid" style={{ marginBottom: 14 }}>
          {[
            { val: gauge.totalCols, label: "目数 / 段" },
            { val: gauge.totalRows, label: "総段数" },
            { val: `${imageResult.colors.length}色`, label: "使用色" },
          ].map((r, i) => (
            <div key={i} className="result-box">
              <div className="val">{r.val}</div>
              <div className="lbl">{r.label}</div>
            </div>
          ))}
        </div>

        {/* lock banner */}
        <div className="lock-banner">
          <span style={{ fontSize: 20, color: "#FF9900" }}>🔒</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#222", marginBottom: 2 }}>フル編み図をダウンロード</div>
            <div style={{ fontSize: 10, color: "#AAAAAA" }}>PDF · ウォーターマークなし · 詳細手順付き</div>
          </div>
          <span className="price">¥480</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <button className="btn-secondary" style={{ fontSize: 13 }}>共有</button>
          <button className="btn-primary" style={{ fontSize: 13, background: "#FF9900" }}>
            🔓 購入 ¥480
          </button>
        </div>

        {/* summary */}
        <div style={{ border: "1px solid #F0F0F0", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ background: "#FF9900", color: "#fff", padding: "10px 14px", fontSize: 12, fontWeight: 600 }}>
            設定サマリー
          </div>
          {[
            { label: "アイテム", val: `${item.itemName} ${item.width}×${item.height}cm` },
            { label: "編み方", val: item.stitch === "crochet" ? "かぎ編み" : "棒編み" },
            { label: "ゲージ", val: `${gauge.stitchPer10}目 / ${gauge.rowPer10}段（10cm）` },
            { label: "必要毛糸", val: `${imageResult.colors.length}色 · 計${imageResult.totalBalls}玉 / ${imageResult.totalMeters}m` },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 14px", borderBottom: i < 3 ? "1px solid #F0F0F0" : "none", fontSize: 12 }}>
              <span style={{ color: "#AAAAAA" }}>{r.label}</span>
              <span style={{ fontWeight: 500, color: "#222" }}>{r.val}</span>
            </div>
          ))}
        </div>

        {/* yarn colors */}
        <p className="section-label">必要な毛糸の色</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
          {imageResult.colors.map((c, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: 60 }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: toHex(c.rgb),
                border: "2px solid rgba(0,0,0,0.08)",
                boxShadow: "inset -3px -3px 7px rgba(0,0,0,0.18), inset 2px 2px 5px rgba(255,255,255,0.22)",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: 5, left: 8, width: 13, height: 8, background: "rgba(255,255,255,0.32)", borderRadius: "50%", transform: "rotate(-30deg)" }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600 }}>{c.balls}玉</span>
              <span style={{ fontSize: 9, color: "#AAAAAA" }}>{c.meters}m</span>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-nav two-col">
        <button className="btn-secondary" onClick={onBack}>← 戻る</button>
        <button className="btn-primary" onClick={onRestart} style={{ background: "#444" }}>
          最初から
        </button>
      </div>
    </div>
  );
}

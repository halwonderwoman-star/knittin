"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import ProgressBar from "./ProgressBar";
import { ItemConfig } from "./ItemScreen";
import { GaugeConfig } from "./GaugeScreen";

const MAX_COLORS = 5;
const METERS_PER_BALL = 40;
const CM_PER_STITCH = 1.2;

export type ColorResult = { rgb: [number, number, number]; balls: number; meters: number; pct: number };
export type ImageResult = { colors: ColorResult[]; totalBalls: number; totalMeters: number; imageDataUrl: string };

function quantize(pixels: Uint8ClampedArray, k: number): [number, number, number][] {
  let centers: [number, number, number][] = [];
  const step = Math.max(1, Math.floor(pixels.length / 4 / k));
  for (let i = 0; i < k; i++) {
    const idx = i * step * 4;
    centers.push([pixels[idx], pixels[idx + 1], pixels[idx + 2]]);
  }
  for (let iter = 0; iter < 10; iter++) {
    const sums: [number, number, number, number][] = centers.map(() => [0, 0, 0, 0]);
    for (let i = 0; i < pixels.length; i += 4) {
      let best = 0, bd = Infinity;
      centers.forEach((c, ci) => {
        const d = (pixels[i] - c[0]) ** 2 + (pixels[i + 1] - c[1]) ** 2 + (pixels[i + 2] - c[2]) ** 2;
        if (d < bd) { bd = d; best = ci; }
      });
      sums[best][0] += pixels[i]; sums[best][1] += pixels[i + 1];
      sums[best][2] += pixels[i + 2]; sums[best][3]++;
    }
    centers = sums.map((s, i) => s[3] > 0
      ? [Math.round(s[0] / s[3]), Math.round(s[1] / s[3]), Math.round(s[2] / s[3])]
      : centers[i]);
  }
  return centers;
}

function detectK(pixels: Uint8ClampedArray): number {
  const B = 40, map = new Map<string, number>();
  for (let i = 0; i < pixels.length; i += 4) {
    const r = Math.round(pixels[i] / B) * B;
    const g = Math.round(pixels[i + 1] / B) * B;
    const b = Math.round(pixels[i + 2] / B) * B;
    const key = `${r},${g},${b}`;
    map.set(key, (map.get(key) || 0) + 1);
  }
  const total = pixels.length / 4;
  let count = 0;
  map.forEach(v => { if (v / total >= 0.02) count++; });
  return Math.min(Math.max(count, 2), MAX_COLORS);
}

function closest(r: number, g: number, b: number, centers: [number, number, number][]): number {
  let best = 0, bd = Infinity;
  centers.forEach((c, i) => {
    const d = (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;
    if (d < bd) { bd = d; best = i; }
  });
  return best;
}

type Props = { item: ItemConfig; gauge: GaugeConfig; onNext: (result: ImageResult) => void; onBack: () => void };

export default function ImageScreen({ item, gauge, onNext, onBack }: Props) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [result, setResult] = useState<ImageResult | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback((src: string) => {
    const img = new Image();
    img.onload = () => {
  const { totalCols, totalRows } = gauge;

  // 画像の縦横比を保ってグリッドに収める
  const imgRatio = img.width / img.height;
  const gridRatio = totalCols / totalRows;

  let drawCols: number, drawRows: number, offsetCol: number, offsetRow: number;

  if (imgRatio > gridRatio) {
    // 画像が横長 → 幅に合わせて高さを縮める
    drawCols = totalCols;
    drawRows = Math.round(totalCols / imgRatio);
    offsetCol = 0;
    offsetRow = Math.floor((totalRows - drawRows) / 2);
  } else {
    // 画像が縦長 → 高さに合わせて幅を縮める
    drawRows = totalRows;
    drawCols = Math.round(totalRows * imgRatio);
    offsetRow = 0;
    offsetCol = Math.floor((totalCols - drawCols) / 2);
  }

  // 画像部分をダウンサンプリング
  const off = document.createElement("canvas");
  off.width = drawCols; off.height = drawRows;
  const c = off.getContext("2d")!;
  c.drawImage(img, 0, 0, drawCols, drawRows);
  const { data: imgPixels } = c.getImageData(0, 0, drawCols, drawRows);

  // 色抽出は画像部分のみで行う
  const k = detectK(imgPixels);
  const centers = quantize(imgPixels, k);

  // デフォルト土台色（白）
  const bgColor: [number, number, number] = [245, 245, 240];

  const counts = new Array(k + 1).fill(0); // k+1番目が土台色

  // プレビューcanvasに描画
  const cvs = canvasRef.current!;
  const containerW = cvs.parentElement!.clientWidth;
  const cellW = Math.max(2, Math.floor(containerW / totalCols));
  const cellH = Math.max(2, Math.round(cellW * 1.1));
  cvs.width = cellW * totalCols;
  cvs.height = cellH * totalRows;
  const ctx = cvs.getContext("2d")!;

  for (let row = 0; row < totalRows; row++) {
    for (let col = 0; col < totalCols; col++) {
      const imgRow = row - offsetRow;
      const imgCol = col - offsetCol;

      let r: number, g: number, b: number;
      let colorIdx: number;

      if (imgRow >= 0 && imgRow < drawRows && imgCol >= 0 && imgCol < drawCols) {
        // 画像エリア
        const idx = (imgRow * drawCols + imgCol) * 4;
        const alpha = imgPixels[idx + 3];
        if (alpha < 128) {
          // 透明部分 → 土台色
          [r, g, b] = bgColor;
          colorIdx = k;
        } else {
          colorIdx = closest(imgPixels[idx], imgPixels[idx + 1], imgPixels[idx + 2], centers);
          [r, g, b] = centers[colorIdx];
        }
      } else {
        // 余白エリア → 土台色
        [r, g, b] = bgColor;
        colorIdx = k;
      }

      counts[colorIdx]++;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(col * cellW, row * cellH, cellW - 1, cellH - 1);
    }
  }

  // グリッド線
  ctx.strokeStyle = "rgba(0,0,0,0.06)"; ctx.lineWidth = 0.5;
  for (let col = 0; col <= totalCols; col++) {
    ctx.beginPath(); ctx.moveTo(col * cellW, 0); ctx.lineTo(col * cellW, cvs.height); ctx.stroke();
  }
  for (let row = 0; row <= totalRows; row++) {
    ctx.beginPath(); ctx.moveTo(0, row * cellH); ctx.lineTo(cvs.width, row * cellH); ctx.stroke();
  }

  // 毛糸計算（土台色は別カウント）
  const totalSt = totalCols * totalRows;
  const totalMeters = Math.round(totalSt * CM_PER_STITCH / 100);
  let totalBalls = 0;

  const colors: ColorResult[] = centers
    .map((c, i) => {
      const pct = counts[i] / totalSt;
      const meters = Math.ceil(totalMeters * pct);
      const balls = Math.ceil(meters / METERS_PER_BALL);
      totalBalls += balls;
      return { rgb: c, balls, meters, pct };
    })
    .filter(c => c.pct > 0.005)
    .sort((a, b) => b.pct - a.pct);

  // 土台色も追加
  const bgPct = counts[k] / totalSt;
  if (bgPct > 0.005) {
    const bgMeters = Math.ceil(totalMeters * bgPct);
    const bgBalls = Math.ceil(bgMeters / METERS_PER_BALL);
    totalBalls += bgBalls;
    colors.unshift({ rgb: bgColor, balls: bgBalls, meters: bgMeters, pct: bgPct });
  }

  setResult({ colors, totalBalls, totalMeters, imageDataUrl: cvs.toDataURL() });
};
    img.src = src;
  }, [gauge]);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const src = e.target?.result as string;
      setImageSrc(src);
      processImage(src);
    };
    reader.readAsDataURL(file);
  };

  const toHex = ([r, g, b]: [number, number, number]) =>
    "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <ProgressBar step={2} />
      <div style={{ padding: "16px 20px", flex: 1, overflowY: "auto" }}>

        <p className="section-label">参考画像</p>
        {!imageSrc ? (
          <div
            style={{
              border: "2px dashed #E0E0E0", borderRadius: 12,
              padding: "28px 20px", textAlign: "center",
              background: "#FAFAFA", cursor: "pointer", marginBottom: 16,
            }}
            onClick={() => fileRef.current?.click()}
          >
            <div style={{ fontSize: 32, color: "#CCCCCC", marginBottom: 8 }}>📷</div>
            <p style={{ fontSize: 13, color: "#AAAAAA" }}>タップして画像を選択</p>
            <p style={{ fontSize: 10, color: "#CCCCCC", marginTop: 4 }}>JPEG / PNG · 最大10MB</p>
          </div>
        ) : (
          <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
            <img src={imageSrc} alt="参考" style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
            <button
              onClick={() => { setImageSrc(null); setResult(null); }}
              style={{
                position: "absolute", top: 8, right: 8,
                background: "rgba(0,0,0,0.5)", color: "#fff", border: "none",
                borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 14,
              }}
            >✕</button>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

        <p className="section-label">編み図プレビュー</p>
        <div style={{ position: "relative", border: "1px solid #F0F0F0", borderRadius: 12, overflow: "hidden", marginBottom: 16, background: "#F5F5F5" }}>
          <canvas ref={canvasRef} style={{ display: "block", width: "100%", imageRendering: "pixelated" }} />
          <div style={{
            position: "absolute", top: 8, right: 8,
            background: "rgba(0,0,0,0.55)", color: "#E8A000",
            fontSize: 10, padding: "3px 8px", borderRadius: 4, fontWeight: 600,
          }}>
            {gauge.totalCols}目 × {gauge.totalRows}段
          </div>
          {!imageSrc && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F0F0" }}>
              <span style={{ fontSize: 12, color: "#AAAAAA" }}>画像をアップロードするとプレビューが表示されます</span>
            </div>
          )}
        </div>

        {result && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span className="section-label" style={{ marginBottom: 0 }}>必要な毛糸</span>
              <span style={{ fontSize: 11, fontWeight: 600, background: "#222", color: "#fff", padding: "2px 10px", borderRadius: 20 }}>
                {result.colors.length}色
              </span>
            </div>
           <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
  {result.colors.map((c, i) => (
    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, width: 60 }}>
      <div style={{ position: "relative", width: 48, height: 48 }}>
        <img
          src="/148415.png"
          alt="毛糸"
          style={{
            width: 48,
            height: 48,
            position: "absolute",
            inset: 0,
            mixBlendMode: "multiply",
          }}
        />
        <div style={{
          position: "absolute",
          inset: 0,
          background: toHex(c.rgb),
          borderRadius: "50%",
          mixBlendMode: "screen",
        }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: "#222" }}>{c.balls}玉</span>
      <span style={{ fontSize: 9, color: "#AAAAAA" }}>{c.meters}m</span>
    </div>
  ))}
</div>
            <div style={{ border: "1px solid #F0F0F0", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
              <div style={{ background: "#FAFAFA", padding: "8px 14px", borderBottom: "1px solid #F0F0F0", fontSize: 10, fontWeight: 600, color: "#AAAAAA", letterSpacing: "0.04em" }}>合計</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                {[
                  { val: result.totalBalls, unit: "玉", label: "毛糸の合計" },
                  { val: result.totalMeters, unit: "m", label: "総使用量の目安" },
                ].map((r, i) => (
                  <div key={i} style={{ padding: "12px 14px", textAlign: "center", borderRight: i === 0 ? "1px solid #F0F0F0" : "none" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#222", lineHeight: 1 }}>{r.val}</div>
                    <div style={{ fontSize: 11, color: "#FF9900", fontWeight: 600, marginTop: 2 }}>{r.unit}</div>
                    <div style={{ fontSize: 10, color: "#AAAAAA", marginTop: 2 }}>{r.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="info-note">
              並太毛糸（約40m/玉）を基準に算出。購入時の参考にしてください。
            </div>
          </>
        )}
      </div>

      <div className="footer-nav two-col">
        <button className="btn-secondary" onClick={onBack}>← 戻る</button>
        <button className="btn-primary" disabled={!result} onClick={() => result && onNext(result)}>
          編み図を生成 →
        </button>
      </div>
    </div>
  );
}

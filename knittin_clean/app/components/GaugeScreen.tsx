"use client";
import { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import { ItemConfig } from "./ItemScreen";

export type GaugeConfig = {
  stitchPer10: number;
  rowPer10: number;
  totalCols: number;
  totalRows: number;
};

type Props = { item: ItemConfig; onNext: (gauge: GaugeConfig) => void; onBack: () => void };

export default function GaugeScreen({ item, onNext, onBack }: Props) {
  const isCrochet = item.stitch === "crochet";
  const [stPer, setStPer] = useState("");
  const [rowPer, setRowPer] = useState("");

  const stNum = parseFloat(stPer) || 0;
  const rowNum = parseFloat(rowPer) || 0;
  const valid = stNum > 0 && rowNum > 0;
  const totalCols = valid ? Math.round(stNum * item.width / 10) : 0;
  const totalRows = valid ? Math.round(rowNum * item.height / 10) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <ProgressBar step={1} />
      <div style={{ padding: "16px 20px", flex: 1, overflowY: "auto" }}>

        <p className="section-label">
          毛糸タグのゲージを入力
          <span style={{ fontWeight: 400, fontSize: 9, marginLeft: 6 }}>10cm × 10cm あたり</span>
        </p>

        {/* gauge card */}
        <div style={{ border: "1px solid #F0F0F0", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ background: "#FAFAFA", padding: "10px 14px", borderBottom: "1px solid #F0F0F0", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, color: "#FF9900" }}>⊞</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#222" }}>
              {isCrochet ? "長編み" : "メリヤス編み"}
            </span>
            <span style={{ fontSize: 10, color: "#AAAAAA", marginLeft: "auto" }}>タグの数値をそのまま入力</span>
          </div>
          <div style={{ padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: "#AAAAAA", display: "block", marginBottom: 5 }}>目数（横）</label>
              <div className="input-wrap">
                <input
                  type="number"
                  value={stPer}
                  placeholder={isCrochet ? "例 23" : "例 24"}
                  min={1} max={99}
                  onChange={e => setStPer(e.target.value)}
                />
                <span className="unit">目</span>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#AAAAAA", display: "block", marginBottom: 5 }}>段数（縦）</label>
              <div className="input-wrap">
                <input
                  type="number"
                  value={rowPer}
                  placeholder={isCrochet ? "例 11" : "例 32"}
                  min={1} max={99}
                  onChange={e => setRowPer(e.target.value)}
                />
                <span className="unit">段</span>
              </div>
            </div>
          </div>
          <p style={{ padding: "0 14px 12px", fontSize: 10, color: "#AAAAAA", lineHeight: 1.5 }}>
            {isCrochet
              ? "例）23〜24目・11〜12段 の場合、中央値を入力"
              : "例）24〜25目・31〜34段 の場合、中央値を入力"}
          </p>
        </div>

        {/* result */}
        <div style={{ border: "2px solid #FF9900", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ background: "#FF9900", padding: "9px 14px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>このデザインの目数・段数</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            {[
              { val: valid ? totalCols : "—", unit: "目", label: "作り目数（横）" },
              { val: valid ? totalRows : "—", unit: "段", label: "総段数（縦）" },
            ].map((r, i) => (
              <div key={i} style={{
                padding: "14px 16px", textAlign: "center",
                borderRight: i === 0 ? "1px solid #F0F0F0" : "none",
              }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#222", lineHeight: 1 }}>{r.val}</div>
                <div style={{ fontSize: 11, color: "#FF9900", fontWeight: 600, marginTop: 2 }}>{r.unit}</div>
                <div style={{ fontSize: 10, color: "#AAAAAA", marginTop: 2 }}>{r.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="info-note">
          この目数・段数がそのまま編み図のマス目になります。毛糸が太いほどマス目が大きくなります。
        </div>
      </div>

      <div className="footer-nav two-col">
        <button className="btn-secondary" onClick={onBack}>← 戻る</button>
        <button
          className="btn-primary"
          disabled={!valid}
          onClick={() => onNext({ stitchPer10: stNum, rowPer10: rowNum, totalCols, totalRows })}
        >
          画像を選ぶ →
        </button>
      </div>
    </div>
  );
}

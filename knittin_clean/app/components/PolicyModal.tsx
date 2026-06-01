"use client";
import { useState } from "react";

type Props = { onAgree: () => void; onClose: () => void };

export default function PolicyModal({ onAgree, onClose }: Props) {
  const [checks, setChecks] = useState([false, false]);
  const allChecked = checks.every(Boolean);

  const toggle = (i: number) => {
    const next = [...checks];
    next[i] = !next[i];
    setChecks(next);
  };

  return (
   <div style={{
  position: "fixed", inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex", alignItems: "flex-end", justifyContent: "center",
  zIndex: 1000,
}}>
  <div style={{
    background: "#fff", width: "100%",
    maxWidth: 430,
    borderRadius: "20px 20px 0 0",
    padding: "24px 20px 40px",
    maxHeight: "80vh", overflowY: "auto",
  }}>
        <div style={{ width: 40, height: 4, background: "#E0E0E0", borderRadius: 2, margin: "0 auto 20px" }} />

        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#222", marginBottom: 4 }}>
          利用規約・プライバシーポリシー
        </h3>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 14, lineHeight: 1.5 }}>
          ご利用前に以下をお読みください。
        </p>

        <div style={{
          background: "#FAFAFA", borderRadius: 10,
          padding: 14, fontSize: 12, color: "#888",
          lineHeight: 1.7, marginBottom: 16, maxHeight: 180, overflowY: "auto",
        }}>
          <strong style={{ color: "#444" }}>利用規約</strong>
          <p style={{ marginTop: 4 }}>本サービス「Knittin」は、アップロードされた画像をもとに編み図を自動生成するツールです。参考画像として他者の作品をアップロードすること自体は問題ありません。ただし生成した編み図を販売・配布する際は、元となった画像の権利にご注意ください。</p>
          <strong style={{ color: "#444", display: "block", marginTop: 10 }}>プライバシーポリシー</strong>
          <p style={{ marginTop: 4 }}>アップロードされた画像はパターン生成のためのみに使用され、処理後に自動削除されます。課金情報は決済代行業者により管理されます。</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {[
            "利用規約を読み、同意します",
            "プライバシーポリシーを読み、同意します",
          ].map((label, i) => (
            <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={checks[i]}
                onChange={() => toggle(i)}
                style={{ width: 18, height: 18, marginTop: 1, accentColor: "#FF9900", flexShrink: 0 }}
              />
              <span style={{ fontSize: 13, color: "#444", lineHeight: 1.4 }}>{label}</span>
            </label>
          ))}
        </div>

        <button
          className="btn-primary"
          disabled={!allChecked}
          onClick={onAgree}
        >
          同意して始める
        </button>
        <button
          onClick={onClose}
          style={{ width: "100%", background: "none", border: "none", color: "#AAAAAA", fontSize: 12, cursor: "pointer", marginTop: 12 }}
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}

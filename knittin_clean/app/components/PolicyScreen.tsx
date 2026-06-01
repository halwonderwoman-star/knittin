"use client";
import { useState } from "react";

type Props = { onNext: () => void; onBack: () => void };

export default function PolicyScreen({ onNext, onBack }: Props) {
  const [checks, setChecks] = useState([false, false, false]);
  const allChecked = checks.every(Boolean);

  const toggle = (i: number) => {
    const next = [...checks];
    next[i] = !next[i];
    setChecks(next);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div style={{ padding: "20px 20px 0" }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: "#222", marginBottom: 4 }}>
          利用規約・プライバシーポリシー
        </h2>
        <p style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>
          ご利用前に以下をお読みください。
        </p>
      </div>

      {/* scroll area */}
      <div style={{
        margin: "14px 20px 0",
        border: "1px solid #F0F0F0",
        borderRadius: 12,
        height: 220,
        overflowY: "auto",
        padding: "14px",
        background: "#FAFAFA",
        fontSize: 12,
        color: "#888",
        lineHeight: 1.7,
        flex: "none",
      }}>
        <strong style={{ color: "#444", fontSize: 12 }}>利用規約</strong>
        <p style={{ marginTop: 4 }}>
          本サービス「Knittin」は、アップロードされた画像をもとに編み図を自動生成するツールです。
          参考画像として他者の作品をアップロードすること自体は問題ありません。
          ただし生成した編み図を販売・配布する際は、元となった画像の権利にご注意ください。
        </p>
        <strong style={{ color: "#444", fontSize: 12, display: "block", marginTop: 12 }}>禁止事項</strong>
        <p style={{ marginTop: 4 }}>
          ・他者の著作物を参考にして生成した編み図を、権利者の許諾なく販売・有償配布すること<br />
          ・本サービスのリバースエンジニアリング・システム解析<br />
          ・不正アクセスや過度なサーバー負荷をかける行為
        </p>
        <strong style={{ color: "#444", fontSize: 12, display: "block", marginTop: 12 }}>プライバシーポリシー</strong>
        <p style={{ marginTop: 4 }}>
          アップロードされた画像はパターン生成のためのみに使用され、処理後に自動削除されます。
          課金情報は決済代行業者により管理されます。
        </p>
        <strong style={{ color: "#444", fontSize: 12, display: "block", marginTop: 12 }}>免責事項</strong>
        <p style={{ marginTop: 4 }}>
          生成された編み図の正確性について当社は保証しません。
          実際の結果は毛糸の素材・編み手の技術により異なります。
        </p>
      </div>

      {/* checkboxes */}
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          <>利用規約を読み、同意します</>,
          <>プライバシーポリシーを読み、同意します</>,
          <>生成した編み図の商業利用時は著作権に配慮することを理解しました</>,
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

      <div style={{ flex: 1 }} />
      <div className="footer-nav two-col">
        <button className="btn-secondary" onClick={onBack}>← 戻る</button>
        <button className="btn-primary" onClick={onNext} disabled={!allChecked}>
          同意して開始
        </button>
      </div>
    </div>
  );
}

"use client";

type Props = { onNext: () => void; onBack: () => void };

export default function RegisterScreen({ onNext, onBack }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div style={{
        background: "#FF9900", padding: "40px 24px 48px",
        textAlign: "center", position: "relative",
      }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "0.04em", marginBottom: 4 }}>
          Knittin
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
          Create Account
        </div>
        <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 32, background: "#fff", borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }} />
      </div>

      <div style={{ padding: "24px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Google */}
        <button
          onClick={onNext}
          style={{
            width: "100%", padding: "13px 16px",
            border: "1px solid #E0E0E0", borderRadius: 12,
            background: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            fontSize: 14, fontWeight: 500, color: "#222",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Googleで続ける
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 1, background: "#E0E0E0" }} />
          <span style={{ fontSize: 12, color: "#AAAAAA" }}>または</span>
          <div style={{ flex: 1, height: 1, background: "#E0E0E0" }} />
        </div>

        {/* Email */}
        <div>
          <label style={{ fontSize: 11, color: "#AAAAAA", display: "block", marginBottom: 5 }}>メールアドレス</label>
          <input
            type="email"
            placeholder="example@email.com"
            style={{
              width: "100%", padding: "11px 14px",
              border: "1px solid #E0E0E0", borderRadius: 10,
              fontSize: 14, outline: "none",
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 11, color: "#AAAAAA", display: "block", marginBottom: 5 }}>パスワード</label>
          <input
            type="password"
            placeholder="8文字以上"
            style={{
              width: "100%", padding: "11px 14px",
              border: "1px solid #E0E0E0", borderRadius: 10,
              fontSize: 14, outline: "none",
            }}
          />
        </div>

        <button className="btn-primary" onClick={onNext} style={{ marginTop: 4 }}>
          登録して始める
        </button>

        <button
          onClick={onNext}
          style={{
            background: "none", border: "none",
            color: "#AAAAAA", fontSize: 12,
            cursor: "pointer", textDecoration: "underline",
            padding: "4px 0",
          }}
        >
          スキップして続ける
        </button>

      </div>

      <div className="footer-nav two-col">
        <button className="btn-secondary" onClick={onBack}>← 戻る</button>
      </div>
    </div>
  );
}

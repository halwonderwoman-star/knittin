# Knittin — 編み図ジェネレーター

画像をアップロードしてゲージを入力するだけで、編み図を自動生成するWebアプリです。

## デプロイ方法（Vercel）

1. このリポジトリをGitHubにpush
2. [vercel.com](https://vercel.com) にGitHubでログイン
3. 「Add New Project」→ このリポジトリを選択
4. そのまま「Deploy」を押すだけ

## ローカル起動

```bash
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開く。

## 技術スタック

- Next.js 15 (App Router)
- TypeScript
- Canvas API（画像ビット変換・色抽出）
- PWA対応（manifest.json）

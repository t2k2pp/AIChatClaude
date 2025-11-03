# Float - AI Chat Client

<p align="center">
  <strong>軽量・高速・美しい ローカルLLMチャットクライアント</strong>
</p>

<p align="center">
  Tauri + Svelte + Tailwind CSS で構築された、Ollama/LMStudio 対応のデスクトップチャットアプリケーション
</p>

---

## ✨ 特徴

### 🚀 軽量・高速
- **Tauri** を使用したネイティブアプリケーション
- OS標準のWebViewを利用し、メモリ消費を最小限に
- Electronの1/10以下のサイズ

### 💬 充実したチャット機能
- **リアルタイムストリーミング応答** - タイプライター効果
- **Markdownレンダリング** - 見やすくフォーマット
- **コードシンタックスハイライト** - 100+言語対応
- **XSS対策** - セキュアな表示

### 🗂️ セッション管理
- 複数チャットセッションの作成・切り替え
- 履歴の自動保存
- Markdownファイルへのエクスポート

### ⚙️ カスタマイズ可能
- **モデル選択** - llama3, mistral, codellama など
- **システムプロンプト** - AIの動作をカスタマイズ
- **APIエンドポイント** - Ollama/LMStudio切り替え

### 🔒 プライバシー重視
- すべてローカルで動作
- インターネット接続不要
- データは外部に送信されません

---

## 📦 インストール方法

### 前提条件
- **Node.js** 18.x 以上
- **Rust** 1.70 以上
- **Ollama** または **LMStudio**

### クイックスタート

```bash
# 1. Ollama をインストール
curl -fsSL https://ollama.com/install.sh | sh

# 2. モデルをダウンロード
ollama pull llama3

# 3. リポジトリをクローン
git clone <repository-url>
cd float-chat

# 4. 依存関係をインストール
npm install

# 5. アプリを起動
npm run tauri dev
```

詳細: [QUICKSTART.md](../QUICKSTART.md) | [SETUP_GUIDE.md](../SETUP_GUIDE.md)

---

## 🎯 使い方

### 基本操作

1. **チャットを開始**
   - サイドバーの「+ New Chat」ボタンをクリック

2. **メッセージを送信**
   - 入力欄にテキストを入力
   - Enter キーまたは Send ボタンで送信

3. **セッションを切り替え**
   - サイドバーのセッションをクリック

### 設定

右上の歯車アイコンから設定を開く：

- **API Endpoint**: Ollama/LMStudio のURL
- **Model**: 使用するAIモデル
- **System Prompt**: AIの動作をカスタマイズ

### エクスポート

サイドバー下部の「Export to Markdown」で現在のセッションを保存

---

## 🛠️ 開発

### 開発モードで起動

```bash
npm run tauri dev
```

### ビルド

```bash
# フロントエンドのビルド
npm run build

# アプリケーションのビルド
npm run tauri build
```

### プロジェクト構造

```
float-chat/
├── src/                    # Svelte フロントエンド
│   ├── lib/
│   │   ├── components/    # UI コンポーネント
│   │   ├── utils/         # API 通信
│   │   └── stores.js      # 状態管理・永続化
│   └── routes/            # ページルーティング
├── src-tauri/             # Tauri バックエンド (Rust)
│   ├── src/
│   │   └── lib.rs         # メインロジック
│   └── Cargo.toml         # Rust 依存関係
└── package.json           # Node 依存関係
```

---

## 🧰 技術スタック

| カテゴリ | 技術 |
|---------|------|
| デスクトップ | Tauri 2.1 |
| フロントエンド | Svelte 5 (Runes) |
| スタイリング | Tailwind CSS + daisyUI |
| Markdown | marked + DOMPurify |
| コードハイライト | highlight.js |
| 永続化 | tauri-plugin-store |

---

## 📸 スクリーンショット

### メインUI
- サイドバー付きチャットインターフェース
- リアルタイムストリーミング応答
- Markdown & コードハイライト

### 設定画面
- APIエンドポイント設定
- モデル選択
- システムプロンプトカスタマイズ

---

## 🤝 貢献

プルリクエスト歓迎！

### 開発の流れ

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

---

## 📝 ライセンス

MIT License - 詳細は [LICENSE](../LICENSE) を参照

---

## 🙏 謝辞

- [Tauri](https://tauri.app/) - デスクトップアプリフレームワーク
- [Svelte](https://svelte.dev/) - リアクティブUIフレームワーク
- [Ollama](https://ollama.com/) - ローカルLLMランタイム
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSS
- [daisyUI](https://daisyui.com/) - Tailwind CSS コンポーネント

---

## 📞 サポート

- **ドキュメント**: [SETUP_GUIDE.md](../SETUP_GUIDE.md)
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

---

**Float で快適なAIチャット体験を！** 🎉

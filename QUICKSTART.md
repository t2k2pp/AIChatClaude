# Float - クイックスタートガイド

最短5ステップでFloatを起動する方法です。

## ⚡ クイックスタート（5ステップ）

### ステップ 1: Ollama をインストール

```bash
# Linux/macOS
curl -fsSL https://ollama.com/install.sh | sh

# Windows: https://ollama.com/ からダウンロード
```

### ステップ 2: モデルをダウンロード

```bash
ollama pull llama3
```

### ステップ 3: リポジトリをクローン

```bash
git clone https://github.com/your-username/AIChatClaude.git
cd AIChatClaude/float-chat
```

### ステップ 4: 依存関係をインストール

```bash
npm install
```

### ステップ 5: アプリを起動

```bash
npm run tauri dev
```

**初回起動は10分ほどかかります（Rustのビルド）。2回目以降は数秒で起動します。**

---

## ✅ 起動確認

アプリが起動したら：

1. メッセージ入力欄に「こんにちは」と入力
2. Send ボタンをクリック
3. AIが応答を返せば成功！

---

## 🔧 事前準備が必要な場合

### Node.js がない場合

```bash
# Ubuntu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS
brew install node

# Windows: https://nodejs.org/ からダウンロード
```

### Rust がない場合

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### Linux の場合の追加パッケージ

```bash
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.0-dev \
  build-essential \
  libssl-dev \
  libgtk-3-dev \
  librsvg2-dev
```

---

## 🚨 トラブルシューティング

### Ollama に接続できない

```bash
# Ollama が起動しているか確認
curl http://localhost:11434/api/version

# 起動していない場合
ollama serve
```

### ビルドエラーが発生

```bash
# 依存関係を再インストール
rm -rf node_modules
npm install
```

---

## 📚 詳細なドキュメント

完全なセットアップガイド: [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

**それでは Float を楽しんでください！** 🚀

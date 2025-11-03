# Float - AIチャットアプリ セットアップガイド

このガイドでは、Float AIチャットアプリをローカル環境で実行するための手順を説明します。

## 📋 目次
1. [前提条件](#前提条件)
2. [セットアップ手順](#セットアップ手順)
3. [アプリの起動](#アプリの起動)
4. [ビルド方法](#ビルド方法)
5. [トラブルシューティング](#トラブルシューティング)

---

## 前提条件

### 必須ソフトウェア

#### 1. Node.js と npm
- **バージョン**: Node.js 18.x 以上
- **インストール方法**:
  ```bash
  # Ubuntuの場合
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs

  # macOSの場合（Homebrewを使用）
  brew install node

  # Windowsの場合
  # https://nodejs.org/ からインストーラーをダウンロード
  ```

- **確認方法**:
  ```bash
  node --version   # v18.0.0 以上であること
  npm --version    # 9.0.0 以上であること
  ```

#### 2. Rust
- **バージョン**: 1.70 以上
- **インストール方法**:
  ```bash
  # Linux/macOS/Windows（WSL）の場合
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  source $HOME/.cargo/env
  ```

- **確認方法**:
  ```bash
  rustc --version   # 1.70.0 以上であること
  ```

#### 3. Tauri の OS 固有の依存関係

##### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.0-dev \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

##### macOS
```bash
xcode-select --install
```

##### Windows
- Microsoft Visual Studio C++ Build Tools
- WebView2 (通常は Windows 10/11 に標準搭載)

#### 4. Ollama または LMStudio

Floatは以下のローカルLLMサーバーと通信します：

##### Ollama のインストール（推奨）

**Linux/macOS**:
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows**:
- https://ollama.com/ からインストーラーをダウンロード

**モデルのダウンロード**:
```bash
# llama3 モデルをダウンロード（推奨）
ollama pull llama3

# または他のモデル
ollama pull mistral
ollama pull codellama
```

**Ollama の起動確認**:
```bash
# Ollamaサーバーを起動（バックグラウンドで自動起動する場合もあります）
ollama serve

# 別のターミナルで動作確認
curl http://localhost:11434/api/version
```

##### LMStudio の代替利用
- https://lmstudio.ai/ からダウンロード
- デフォルトでは `http://localhost:1234` で起動

---

## セットアップ手順

### 1. リポジトリのクローン

```bash
# リポジトリをクローン
git clone https://github.com/your-username/AIChatClaude.git
cd AIChatClaude

# 開発ブランチにチェックアウト
git checkout claude/float-chat-app-design-011CUmA3EJB31kNfDexPJRH8

# float-chatディレクトリに移動
cd float-chat
```

### 2. Node.js 依存関係のインストール

```bash
# npm パッケージをインストール
npm install
```

インストールされる主な依存関係：
- Svelte 5
- Tailwind CSS
- daisyUI
- marked, DOMPurify
- highlight.js
- Tauri プラグイン

**所要時間**: 約1〜2分

### 3. Rust 依存関係のインストール（自動）

Rust の依存関係は、初回ビルド時に自動的にダウンロードされます。
（Cargo.toml に記載されたクレートが自動取得されます）

---

## アプリの起動

### 開発モードで起動

```bash
# float-chat ディレクトリ内で実行
npm run tauri dev
```

**初回起動時の注意**:
- Rust のビルドが行われるため、5〜10分かかる場合があります
- 2回目以降は数秒で起動します

**起動が成功すると**:
1. Vite 開発サーバーが起動（http://localhost:1420）
2. Tauriアプリケーションウィンドウが表示される
3. Float のメインUIが表示される

### 起動後の初期設定

アプリが起動したら：

1. **設定を開く**: 右上の歯車アイコンをクリック

2. **API エンドポイントを確認**:
   - デフォルト: `http://localhost:11434` (Ollama)
   - LMStudio の場合: `http://localhost:1234` に変更

3. **モデルを選択**:
   - デフォルト: `llama3`
   - ダウンロード済みのモデルを選択
   - カスタムモデル名も入力可能

4. **システムプロンプト（任意）**:
   - 例: "あなたは親切なAIアシスタントです。常に日本語で回答してください。"

5. **保存ボタンをクリック**

### 動作確認

1. **新しいチャットを開始**:
   - サイドバーの「+ New Chat」ボタンをクリック

2. **メッセージを送信**:
   - 入力欄に「こんにちは」と入力
   - Sendボタンをクリック

3. **応答を確認**:
   - AIからストリーミングで応答が返ってくる
   - Markdownが正しくレンダリングされる
   - コードブロックはシンタックスハイライト表示される

---

## ビルド方法

### プロダクションビルド

#### 1. フロントエンドのビルド
```bash
npm run build
```

#### 2. Tauriアプリのビルド
```bash
npm run tauri build
```

**ビルド成果物の場所**:
- **Linux**: `src-tauri/target/release/bundle/deb/float-chat_0.1.0_amd64.deb`
- **macOS**: `src-tauri/target/release/bundle/macos/Float Chat.app`
- **Windows**: `src-tauri/target/release/bundle/msi/Float Chat_0.1.0_x64_en-US.msi`

**所要時間**: 初回は10〜20分、2回目以降は5分程度

### ビルドしたアプリの配布

#### Linux (.deb)
```bash
sudo dpkg -i float-chat_0.1.0_amd64.deb
```

#### macOS (.app)
```bash
# Applications フォルダにコピー
cp -r "Float Chat.app" /Applications/
```

#### Windows (.msi)
- インストーラーをダブルクリックして実行

---

## トラブルシューティング

### 問題 1: `npm run tauri dev` でエラーが発生

**エラー**: `webkit2gtk not found`

**解決方法** (Linux):
```bash
sudo apt install libwebkit2gtk-4.0-dev librsvg2-dev
```

---

### 問題 2: Ollama に接続できない

**エラー**: "Sorry, I encountered an error. Please make sure Ollama is running..."

**解決方法**:
```bash
# 1. Ollama が起動しているか確認
curl http://localhost:11434/api/version

# 2. 起動していない場合
ollama serve

# 3. モデルがダウンロードされているか確認
ollama list

# 4. モデルがない場合
ollama pull llama3
```

---

### 問題 3: ビルドが遅い

**原因**: Rust のコンパイルは初回時に時間がかかります

**対処法**:
- 初回ビルド: 10〜20分は正常
- 2回目以降: キャッシュが効くため高速化
- Release ビルド: Debug ビルドより時間がかかる（最適化のため）

---

### 問題 4: 日本語が文字化けする

**解決方法**:
1. システムプロンプトに以下を設定:
   ```
   Please always respond in Japanese.
   ```

2. モデルが日本語に対応しているか確認
   - llama3, llama3.1, llama3.2 は日本語対応
   - Mistral, Qwen も日本語対応

---

### 問題 5: コードブロックがハイライトされない

**確認事項**:
1. highlight.js がインストールされているか:
   ```bash
   npm list highlight.js
   ```

2. 再ビルドが必要な場合:
   ```bash
   npm run build
   npm run tauri dev
   ```

---

## 機能の使い方

### セッション管理
- **新規セッション作成**: サイドバーの「+ New Chat」
- **セッション切り替え**: サイドバーのセッションをクリック
- **セッション削除**: セッション右側の「×」ボタン

### エクスポート
- サイドバー下部の「Export to Markdown」ボタン
- 保存先を選択してファイルを保存

### モデル変更
- 設定アイコン → Model ドロップダウン → 保存

### システムプロンプト
- 設定アイコン → System Prompt テキストエリア → 保存

---

## 推奨スペック

### 最小スペック
- **CPU**: 2コア以上
- **RAM**: 4GB以上
- **ストレージ**: 10GB以上の空き容量
- **OS**: Windows 10/11, macOS 10.15+, Linux (Ubuntu 20.04+)

### 推奨スペック
- **CPU**: 4コア以上
- **RAM**: 8GB以上（LLMモデルは別途RAMを消費）
- **ストレージ**: SSD推奨
- **GPU**: LLMの高速実行にはGPU推奨（Ollamaが自動検出）

---

## よくある質問（FAQ）

### Q1: Float は無料で使えますか？
**A**: はい、完全に無料です。オープンソースプロジェクトです。

### Q2: インターネット接続は必要ですか？
**A**: いいえ、すべてローカルで動作します。Ollama/LMStudioもローカルで実行されます。

### Q3: どのモデルが一番良いですか？
**A**: 用途により異なります：
- 汎用: `llama3.1`
- コード生成: `codellama`
- 軽量・高速: `phi`

### Q4: チャット履歴はどこに保存されますか？
**A**: Tauriのアプリデータディレクトリ：
- Linux: `~/.local/share/com.root.float-chat/`
- macOS: `~/Library/Application Support/com.root.float-chat/`
- Windows: `%APPDATA%\com.root.float-chat\`

### Q5: 設定をリセットしたい
**A**: 上記のアプリデータディレクトリを削除してアプリを再起動

---

## サポート

問題が解決しない場合：
1. GitHub Issues: https://github.com/your-username/AIChatClaude/issues
2. Ollama ドキュメント: https://ollama.com/
3. Tauri ドキュメント: https://tauri.app/

---

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

---

**Float を楽しんでください！** 🎉

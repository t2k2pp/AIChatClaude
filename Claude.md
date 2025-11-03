# Float - AIチャットアプリ開発 実装ルールとメモ

## プロジェクト概要
**プロジェクト名**: Float (軽量なAIチャットクライアント)
**目的**: OllamaやLMStudioなどのローカルLLMと高速かつ手軽に対話できる、美しく軽量なデスクトップチャットクライアント

## 技術スタック
- **コア**: Tauri (Rust + OS WebView)
- **フロントエンド**: Svelte
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: daisyUI (Phase 1-2), shadcn-svelte検討 (Phase 3以降)

## ディレクトリ構造
```
float-chat/
├── src/                      # Svelteフロントエンド
│   ├── lib/
│   │   ├── components/       # Svelteコンポーネント
│   │   │   ├── ChatWindow.svelte
│   │   │   ├── Message.svelte
│   │   │   └── ChatInput.svelte
│   │   ├── stores.js         # (Phase 2以降) 状態管理
│   │   └── utils/
│   │       └── api.js        # API通信ロジック
│   ├── App.svelte
│   ├── main.js
│   └── app.css               # Tailwind用グローバルCSS
├── src-tauri/                # Tauri (Rust) バックエンド
│   ├── src/
│   │   └── main.rs
│   └── tauri.conf.json       # 最重要設定ファイル
```

## 重要な実装ルール

### 1. API通信設定 (tauri.conf.json)
**必須**: Ollama/LMStudioへの通信を許可する設定
```json
"tauri": {
  "allowlist": {
    "http": {
      "scope": [
        "http://localhost:11434/*",
        "http://localhost:1234/*",
        "http://127.0.0.1:11434/*",
        "http://127.0.0.1:1234/*"
      ]
    }
  }
}
```

### 2. Ollama API仕様

#### Phase 1: 非ストリーミング (stream: false)
- **URL**: `http://localhost:11434/api/chat`
- **Method**: POST
- **Request Body**:
```json
{
  "model": "llama3",
  "messages": [
    { "role": "user", "content": "Why is the sky blue?" }
  ],
  "stream": false
}
```
- **Response Body**:
```json
{
  "model": "llama3",
  "message": {
    "role": "assistant",
    "content": "The sky is blue because..."
  },
  "done": true
}
```

#### Phase 2: ストリーミング (stream: true)
- **応答形式**: NDJSON (Newline Delimited JSON)
- **処理方法**: ReadableStream → TextDecoder → `\n`で分割 → JSON.parse
- **各行の例**:
```json
{"model":"llama3","message":{"role":"assistant","content":"The"},"done":false}
```
- **最終行**:
```json
{"model":"llama3","done":true,"total_duration":...}
```

### 3. データフロー (Phase 1 MVP)
1. ユーザーが `ChatInput.svelte` にテキスト入力・送信
2. `ChatInput` が `on:send` イベント発行
3. `App.svelte` が入力テキストとチャット履歴を更新
4. `App.svelte` が `api.js` を呼び出し
5. APIからの応答を受け取り、チャット履歴に追加
6. `ChatWindow.svelte` がリアクティブにレンダリング

### 4. 状態管理の原則
- **Phase 1**: `App.svelte` でローカル状態管理
  - `messages`: 配列 `{ role: 'user'|'assistant', content: string }`
  - `isLoading`: boolean（送信中の状態）
- **Phase 2**: ストリーミング対応
  - 空の `{ role: 'assistant', content: '' }` を追加
  - トークン受信ごとに `content += token`
- **Phase 3**: Svelte Stores + tauri-plugin-store で永続化

### 5. XSS対策とMarkdownレンダリング (Phase 2)
**必須**: `DOMPurify` でサニタイズしてから `marked` でレンダリング
```svelte
<script>
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';
  export let content;
  $: sanitizedHtml = DOMPurify.sanitize(marked(content));
</script>

<div class="prose prose-sm max-w-none">
  {@html sanitizedHtml}
</div>
```

### 6. 自動スクロール実装 (Phase 2)
```svelte
<script>
  import { tick } from 'svelte';
  export let messages;
  let chatContainer;

  $: if (chatContainer && messages) {
    tick().then(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    });
  }
</script>

<div bind:this={chatContainer} class="overflow-y-auto ...">
  <!-- Message loop -->
</div>
```

### 7. 永続化の実装 (Phase 3)
- **Rust側**: `src-tauri/Cargo.toml` に `tauri-plugin-store` 追加、`main.rs` で登録
- **JS側**: `@tauri-apps/plugin-store` の `Store` クラスを使用
- **保存対象**:
  - `apiEndpoint`: APIエンドポイントURL
  - `sessions`: セッション履歴 `{ [sessionId]: { title, messages } }`
  - `activeSessionId`: 現在アクティブなセッションID

### 8. UIレイアウトの基本設計
```svelte
<!-- App.svelte のレイアウト -->
<div class="flex flex-col h-screen">
  <!-- ChatWindow: 残りの高さを占める -->
  <div class="flex-1 overflow-hidden">
    <ChatWindow {messages} />
  </div>

  <!-- ChatInput: 下部に固定 -->
  <div class="flex-shrink-0">
    <ChatInput on:send={handleSend} {isLoading} />
  </div>
</div>
```

## フェーズごとのチェックリスト

### Phase 0: 環境構築
- [ ] Rust, Node.js インストール確認
- [ ] Tauriプロジェクト作成 (`npm create tauri-app@latest`)
- [ ] Tailwind CSS セットアップ
- [ ] daisyUI インストール・設定
- [ ] `npm run tauri dev` で起動確認

### Phase 1: MVP
- [ ] `tauri.conf.json` で http scope 設定
- [ ] `api.js` 作成（非ストリーミング）
- [ ] 3つのコンポーネント作成 (ChatInput, Message, ChatWindow)
- [ ] `App.svelte` にロジック実装
- [ ] 手動テスト（送信・応答・エラーハンドリング）

### Phase 2: UI/UX改善
- [ ] `api.js` ストリーミング対応
- [ ] `App.svelte` トークン逐次更新
- [ ] `marked`, `dompurify`, `@tailwindcss/typography` インストール
- [ ] `Message.svelte` でMarkdownレンダリング
- [ ] `ChatWindow.svelte` で自動スクロール
- [ ] 手動テスト（ストリーミング・Markdown・XSS対策）

### Phase 3: 高度な機能
- [ ] `tauri-plugin-store`, `uuid` インストール
- [ ] Rust側セットアップ (Cargo.toml, main.rs)
- [ ] `stores.js` 作成（永続化ストア）
- [ ] `Sidebar.svelte` 作成（セッション管理）
- [ ] `SettingsModal.svelte` 作成（設定画面）
- [ ] `App.svelte` リファクタリング（ストア使用）
- [ ] 手動テスト（セッション切り替え・永続化）

## 重要な注意事項
1. **絵文字を使わない**: コードやファイルに絵文字は追加しない
2. **daisyUI優先**: Phase 1-2では `daisyUI` を使用（`shadcn-svelte` はPhase 3以降検討）
3. **XSS対策必須**: HTMLレンダリング時は必ず `DOMPurify` を使用
4. **ストリーミング処理**: ReadableStreamの適切な処理（メモリリーク防止）
5. **エラーハンドリング**: API未起動時の適切なエラー表示

## 現在の進捗
- **現在のフェーズ**: Phase 0 (環境構築)
- **ブランチ**: `claude/float-chat-app-design-011CUmA3EJB31kNfDexPJRH8`

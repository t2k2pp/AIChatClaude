<script>
  /**
   * Message component for displaying individual chat messages
   * Enhanced: Markdown rendering with syntax highlighting
   */
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github-dark.css'; // Dark theme for code blocks

  export let role; // 'user' or 'assistant'
  export let content; // message text

  // Configure marked with syntax highlighting
  marked.setOptions({
    breaks: true, // Convert \n to <br>
    gfm: true, // GitHub Flavored Markdown
    highlight: function (code, lang) {
      // Auto-detect language if not specified
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang }).value;
        } catch (err) {
          console.error('Highlight error:', err);
        }
      }
      // Auto-detect language
      try {
        return hljs.highlightAuto(code).value;
      } catch (err) {
        console.error('Auto-highlight error:', err);
        return code;
      }
    }
  });

  // Render and sanitize Markdown content
  $: sanitizedHtml = DOMPurify.sanitize(marked.parse(content));
</script>

<div class="chat {role === 'user' ? 'chat-end' : 'chat-start'}">
  <div class="chat-bubble {role === 'user' ? 'chat-bubble-primary' : 'chat-bubble-secondary'}">
    {#if role === 'assistant'}
      <!-- Render Markdown for assistant messages with prose styling -->
      <div class="prose prose-sm max-w-none prose-invert">
        {@html sanitizedHtml}
      </div>
    {:else}
      <!-- Plain text for user messages -->
      <div class="whitespace-pre-wrap">
        {content}
      </div>
    {/if}
  </div>
</div>

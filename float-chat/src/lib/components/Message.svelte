<script>
  /**
   * Message component for displaying individual chat messages
   * Phase 2: Markdown rendering with XSS protection
   */
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';

  export let role; // 'user' or 'assistant'
  export let content; // message text

  // Configure marked for better code highlighting compatibility
  marked.setOptions({
    breaks: true, // Convert \n to <br>
    gfm: true, // GitHub Flavored Markdown
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

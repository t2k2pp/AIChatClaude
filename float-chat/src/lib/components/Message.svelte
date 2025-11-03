<script>
  /**
   * Message component for displaying individual chat messages
   * Phase 1: Simple text display (no Markdown rendering)
   */
  export let role; // 'user' or 'assistant'
  export let content; // message text
</script>

<div class="chat {role === 'user' ? 'chat-end' : 'chat-start'}">
  <div class="chat-bubble {role === 'user' ? 'chat-bubble-primary' : 'chat-bubble-secondary'}">
    {content}
  </div>
</div>

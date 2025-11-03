<script>
  /**
   * ChatWindow component for displaying chat message history
   * Phase 1: Basic message list display
   */
  import Message from './Message.svelte';

  export let messages = []; // Array of { role, content }
</script>

<div class="flex-1 overflow-y-auto p-4 space-y-2">
  {#if messages.length === 0}
    <div class="flex items-center justify-center h-full text-gray-400">
      <p>No messages yet. Start a conversation!</p>
    </div>
  {:else}
    {#each messages as message, index (index)}
      <Message role={message.role} content={message.content} />
    {/each}
  {/if}
</div>

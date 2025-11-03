<script>
  /**
   * ChatWindow component for displaying chat message history
   * Phase 2: Auto-scroll to bottom when messages update
   */
  import { tick } from 'svelte';
  import Message from './Message.svelte';

  export let messages = []; // Array of { role, content }

  let chatContainer;

  // Auto-scroll to bottom when messages change
  $: if (chatContainer && messages) {
    tick().then(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    });
  }
</script>

<div bind:this={chatContainer} class="flex-1 overflow-y-auto p-4 space-y-2">
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

<script>
  /**
   * ChatInput component for text input and send button
   * Phase 1: Basic text input with loading state
   */
  import { createEventDispatcher } from 'svelte';

  export let isLoading = false; // Loading state from parent

  let inputText = '';
  const dispatch = createEventDispatcher();

  function handleSubmit(event) {
    event.preventDefault();

    if (inputText.trim() === '' || isLoading) {
      return;
    }

    // Dispatch send event with the input text
    dispatch('send', { text: inputText.trim() });

    // Clear input after sending
    inputText = '';
  }

  function handleKeyDown(event) {
    // Submit on Enter (without Shift)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  }
</script>

<div class="p-4 border-t border-gray-200">
  <form onsubmit={handleSubmit} class="flex gap-2">
    <textarea
      class="textarea textarea-bordered flex-1 resize-none"
      placeholder="Type your message..."
      bind:value={inputText}
      onkeydown={handleKeyDown}
      disabled={isLoading}
      rows="2"
    ></textarea>

    <button
      type="submit"
      class="btn btn-primary"
      disabled={isLoading || inputText.trim() === ''}
    >
      {#if isLoading}
        <span class="loading loading-spinner loading-sm"></span>
      {:else}
        Send
      {/if}
    </button>
  </form>
</div>

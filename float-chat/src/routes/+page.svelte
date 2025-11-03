<script>
  /**
   * Float - Main Chat Application
   * Phase 1: MVP with basic send/receive functionality
   */
  import ChatWindow from '$lib/components/ChatWindow.svelte';
  import ChatInput from '$lib/components/ChatInput.svelte';
  import { fetchChatResponse } from '$lib/utils/api.js';

  let messages = $state([]); // Array of { role: 'user' | 'assistant', content: string }
  let isLoading = $state(false); // Loading state

  /**
   * Handle send event from ChatInput component
   */
  async function handleSend(event) {
    const userMessage = event.detail.text;

    // Add user's message to the chat
    messages = [...messages, { role: 'user', content: userMessage }];

    // Set loading state
    isLoading = true;

    try {
      // Call Ollama API
      const response = await fetchChatResponse(messages);

      // Add AI's response to the chat
      messages = [...messages, { role: 'assistant', content: response }];
    } catch (error) {
      console.error('Error fetching response:', error);

      // Add error message to chat
      messages = [
        ...messages,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please make sure Ollama is running on http://localhost:11434'
        }
      ];
    } finally {
      // Reset loading state
      isLoading = false;
    }
  }
</script>

<div class="flex flex-col h-screen bg-base-200">
  <!-- Header -->
  <header class="navbar bg-base-100 shadow-lg">
    <div class="flex-1">
      <h1 class="text-xl font-bold px-4">Float - AI Chat</h1>
    </div>
    <div class="flex-none">
      <span class="text-sm text-gray-500 px-4">Phase 1: MVP</span>
    </div>
  </header>

  <!-- Chat Window -->
  <ChatWindow {messages} />

  <!-- Chat Input -->
  <ChatInput {isLoading} on:send={handleSend} />
</div>

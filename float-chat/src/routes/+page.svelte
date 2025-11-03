<script>
  /**
   * Float - Main Chat Application
   * Phase 2: Streaming responses with typewriter effect
   */
  import ChatWindow from '$lib/components/ChatWindow.svelte';
  import ChatInput from '$lib/components/ChatInput.svelte';
  import { fetchChatResponseStreaming } from '$lib/utils/api.js';

  let messages = $state([]); // Array of { role: 'user' | 'assistant', content: string }
  let isLoading = $state(false); // Loading state

  /**
   * Handle send event from ChatInput component
   * Phase 2: Streaming with incremental token updates
   */
  async function handleSend(event) {
    const userMessage = event.detail.text;

    // Add user's message to the chat
    messages = [...messages, { role: 'user', content: userMessage }];

    // Set loading state
    isLoading = true;

    // Add an empty assistant message to be filled with streaming tokens
    messages = [...messages, { role: 'assistant', content: '' }];
    const assistantMessageIndex = messages.length - 1;

    try {
      // Call Ollama API with streaming
      await fetchChatResponseStreaming(
        messages.slice(0, -1), // Exclude the empty assistant message from the API request
        (token) => {
          // Update the assistant message with each new token
          messages[assistantMessageIndex].content += token;
          // Trigger reactivity by reassigning the array
          messages = [...messages];
        }
      );
    } catch (error) {
      console.error('Error fetching response:', error);

      // Update the assistant message with error text
      messages[assistantMessageIndex].content =
        'Sorry, I encountered an error. Please make sure Ollama is running on http://localhost:11434';
      messages = [...messages];
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
      <span class="text-sm text-gray-500 px-4">Phase 2: Streaming + Markdown</span>
    </div>
  </header>

  <!-- Chat Window -->
  <ChatWindow {messages} />

  <!-- Chat Input -->
  <ChatInput {isLoading} on:send={handleSend} />
</div>

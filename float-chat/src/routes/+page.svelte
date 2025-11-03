<script>
  /**
   * Float - Main Chat Application
   * Phase 3: Session management and settings persistence
   */
  import ChatWindow from '$lib/components/ChatWindow.svelte';
  import ChatInput from '$lib/components/ChatInput.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import SettingsModal from '$lib/components/SettingsModal.svelte';
  import { fetchChatResponseStreaming } from '$lib/utils/api.js';
  import {
    sessions,
    activeSessionId,
    activeSessionMessages,
    activeSessionTitle,
    apiEndpoint
  } from '$lib/stores.js';

  let isLoading = $state(false); // Loading state
  let isSettingsOpen = $state(false); // Settings modal state

  // Local reactive copy of messages for display
  let messages = $state([]);

  // Sync messages from active session
  $effect(() => {
    messages = $activeSessionMessages || [];
  });

  /**
   * Handle send event from ChatInput component
   * Phase 3: Persist messages to active session
   */
  async function handleSend(event) {
    const userMessage = event.detail.text;

    if (!$activeSessionId) {
      console.error('No active session');
      return;
    }

    // Add user's message to the chat
    const updatedMessages = [...messages, { role: 'user', content: userMessage }];
    messages = updatedMessages;

    // Persist to store
    await sessions.updateSessionMessages($activeSessionId, updatedMessages);

    // Set loading state
    isLoading = true;

    // Add an empty assistant message to be filled with streaming tokens
    const messagesWithEmpty = [...messages, { role: 'assistant', content: '' }];
    messages = messagesWithEmpty;
    const assistantMessageIndex = messages.length - 1;

    try {
      // Call Ollama API with streaming, using endpoint from settings
      await fetchChatResponseStreaming(
        messages.slice(0, -1), // Exclude the empty assistant message from the API request
        (token) => {
          // Update the assistant message with each new token
          messages[assistantMessageIndex].content += token;
          // Trigger reactivity by reassigning the array
          messages = [...messages];
        },
        $apiEndpoint // Use API endpoint from settings
      );

      // Persist final messages to store
      await sessions.updateSessionMessages($activeSessionId, messages);
    } catch (error) {
      console.error('Error fetching response:', error);

      // Update the assistant message with error text
      messages[assistantMessageIndex].content =
        `Sorry, I encountered an error. Please make sure Ollama is running on ${$apiEndpoint}`;
      messages = [...messages];

      // Persist error message
      await sessions.updateSessionMessages($activeSessionId, messages);
    } finally {
      // Reset loading state
      isLoading = false;
    }
  }

  function openSettings() {
    isSettingsOpen = true;
  }
</script>

<div class="flex h-screen bg-base-200">
  <!-- Sidebar -->
  <Sidebar />

  <!-- Main Chat Area -->
  <div class="flex-1 flex flex-col">
    <!-- Header -->
    <header class="navbar bg-base-100 shadow-lg">
      <div class="flex-1">
        <h1 class="text-xl font-bold px-4">{$activeSessionTitle}</h1>
      </div>
      <div class="flex-none gap-2 px-4">
        <span class="text-sm text-gray-500">Phase 3: Sessions + Settings</span>
        <button class="btn btn-ghost btn-circle btn-sm" onclick={openSettings} title="Settings">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="w-5 h-5 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
    </header>

    <!-- Chat Window -->
    <ChatWindow {messages} />

    <!-- Chat Input -->
    <ChatInput {isLoading} on:send={handleSend} />
  </div>
</div>

<!-- Settings Modal -->
<SettingsModal bind:isOpen={isSettingsOpen} />

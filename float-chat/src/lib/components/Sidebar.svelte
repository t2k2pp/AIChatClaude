<script>
  /**
   * Sidebar component for session management
   * Phase 3: Display sessions, switch between them, create new, delete
   */
  import { sessions, activeSessionId } from '$lib/stores.js';

  // Reactive subscription to sessions
  let sessionList = $state([]);

  // Convert sessions object to array for rendering
  $effect(() => {
    sessionList = Object.entries($sessions).map(([id, session]) => ({
      id,
      title: session.title,
      messageCount: session.messages.length
    }));
  });

  async function handleNewSession() {
    const newSessionId = await sessions.addSession('New Chat');
    await activeSessionId.set(newSessionId);
  }

  async function handleSelectSession(sessionId) {
    await activeSessionId.set(sessionId);
  }

  async function handleDeleteSession(sessionId) {
    // Don't delete if it's the only session
    if (sessionList.length <= 1) {
      return;
    }

    await sessions.deleteSession(sessionId);

    // If we deleted the active session, switch to another one
    if ($activeSessionId === sessionId) {
      const remainingSessions = sessionList.filter((s) => s.id !== sessionId);
      if (remainingSessions.length > 0) {
        await activeSessionId.set(remainingSessions[0].id);
      }
    }
  }
</script>

<div class="w-64 bg-base-100 border-r border-gray-200 flex flex-col h-full">
  <!-- Sidebar Header -->
  <div class="p-4 border-b border-gray-200">
    <button class="btn btn-primary btn-block btn-sm" onclick={handleNewSession}>
      + New Chat
    </button>
  </div>

  <!-- Session List -->
  <div class="flex-1 overflow-y-auto p-2">
    {#if sessionList.length === 0}
      <div class="text-center text-gray-400 mt-4">
        <p class="text-sm">No sessions</p>
      </div>
    {:else}
      <div class="space-y-1">
        {#each sessionList as session (session.id)}
          <div
            class="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-base-200 {session.id ===
            $activeSessionId
              ? 'bg-base-200'
              : ''}"
            onclick={() => handleSelectSession(session.id)}
          >
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm truncate">
                {session.title}
              </div>
              <div class="text-xs text-gray-500">
                {session.messageCount} message{session.messageCount !== 1 ? 's' : ''}
              </div>
            </div>

            {#if sessionList.length > 1}
              <button
                class="btn btn-ghost btn-xs btn-circle"
                onclick={(e) => {
                  e.stopPropagation();
                  handleDeleteSession(session.id);
                }}
                title="Delete session"
              >
                ✕
              </button>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Sidebar Footer -->
  <div class="p-4 border-t border-gray-200">
    <div class="text-xs text-gray-500 text-center">
      {sessionList.length} session{sessionList.length !== 1 ? 's' : ''}
    </div>
  </div>
</div>

<script>
  /**
   * Sidebar component for session management
   * Enhanced: Added export to Markdown functionality
   */
  import { sessions, activeSessionId } from '$lib/stores.js';
  import { save } from '@tauri-apps/plugin-dialog';
  import { writeTextFile } from '@tauri-apps/plugin-fs';

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

  /**
   * Export current session to Markdown file
   */
  async function handleExportSession() {
    if (!$activeSessionId || !$sessions[$activeSessionId]) {
      console.error('No active session to export');
      return;
    }

    const session = $sessions[$activeSessionId];
    const { title, messages } = session;

    // Generate Markdown content
    let markdown = `# ${title}\n\n`;
    markdown += `*Exported on ${new Date().toLocaleString()}*\n\n`;
    markdown += `---\n\n`;

    messages.forEach((message, index) => {
      const roleLabel = message.role === 'user' ? '**You**' : '**Assistant**';
      markdown += `### ${roleLabel}\n\n`;
      markdown += `${message.content}\n\n`;
      if (index < messages.length - 1) {
        markdown += `---\n\n`;
      }
    });

    try {
      // Show save dialog
      const filePath = await save({
        defaultPath: `${title.replace(/[^a-z0-9]/gi, '_')}.md`,
        filters: [
          {
            name: 'Markdown',
            extensions: ['md']
          }
        ]
      });

      if (filePath) {
        // Write file
        await writeTextFile(filePath, markdown);
        console.log('Session exported to:', filePath);
      }
    } catch (error) {
      console.error('Error exporting session:', error);
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
  <div class="p-4 border-t border-gray-200 space-y-2">
    <button
      class="btn btn-sm btn-outline btn-block"
      onclick={handleExportSession}
      disabled={!$activeSessionId}
      title="Export current session to Markdown"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
        />
      </svg>
      Export to Markdown
    </button>
    <div class="text-xs text-gray-500 text-center">
      {sessionList.length} session{sessionList.length !== 1 ? 's' : ''}
    </div>
  </div>
</div>

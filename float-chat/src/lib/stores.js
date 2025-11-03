/**
 * Persistent Stores using Tauri Plugin Store
 * Phase 3: Session management and settings persistence
 */
import { Store } from '@tauri-apps/plugin-store';
import { writable, derived } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

// Initialize Tauri stores for persistence
const settingsStore = new Store('.settings.dat');
const sessionDataStore = new Store('.sessions.dat');

// --- API Endpoint Store ---
/**
 * Stores the API endpoint URL with persistence
 */
const createApiEndpointStore = () => {
  const { subscribe, set } = writable('http://localhost:11434'); // Default value

  // Load initial value from persistent store
  async function load() {
    const value = await settingsStore.get('apiEndpoint');
    if (value) set(value);
  }
  load();

  return {
    subscribe,
    set: async (value) => {
      await settingsStore.set('apiEndpoint', value);
      await settingsStore.save(); // Persist to disk
      set(value); // Update in-memory store
    }
  };
};

export const apiEndpoint = createApiEndpointStore();

// --- Sessions Store ---
/**
 * Stores all chat sessions with persistence
 * Format: { [sessionId]: { title: string, messages: Message[] } }
 */
const createSessionsStore = () => {
  const { subscribe, set, update } = writable({});

  // Load initial value from persistent store
  async function load() {
    const value = await sessionDataStore.get('sessions');
    if (value) {
      set(value);
    } else {
      // Create default session if none exists
      const defaultSessionId = uuidv4();
      const defaultSession = {
        [defaultSessionId]: {
          title: 'New Chat',
          messages: []
        }
      };
      set(defaultSession);
      await sessionDataStore.set('sessions', defaultSession);
      await sessionDataStore.save();

      // Set as active session
      await sessionDataStore.set('activeSessionId', defaultSessionId);
      await sessionDataStore.save();
    }
  }
  load();

  return {
    subscribe,

    // Add a new session
    addSession: async (title = 'New Chat') => {
      const newSessionId = uuidv4();
      update((sessions) => {
        const updated = {
          ...sessions,
          [newSessionId]: {
            title,
            messages: []
          }
        };
        sessionDataStore.set('sessions', updated);
        sessionDataStore.save();
        return updated;
      });
      return newSessionId;
    },

    // Update a session's messages
    updateSessionMessages: async (sessionId, messages) => {
      update((sessions) => {
        const updated = {
          ...sessions,
          [sessionId]: {
            ...sessions[sessionId],
            messages
          }
        };
        sessionDataStore.set('sessions', updated);
        sessionDataStore.save();
        return updated;
      });
    },

    // Delete a session
    deleteSession: async (sessionId) => {
      update((sessions) => {
        const updated = { ...sessions };
        delete updated[sessionId];
        sessionDataStore.set('sessions', updated);
        sessionDataStore.save();
        return updated;
      });
    },

    // Rename a session
    renameSession: async (sessionId, newTitle) => {
      update((sessions) => {
        const updated = {
          ...sessions,
          [sessionId]: {
            ...sessions[sessionId],
            title: newTitle
          }
        };
        sessionDataStore.set('sessions', updated);
        sessionDataStore.save();
        return updated;
      });
    }
  };
};

export const sessions = createSessionsStore();

// --- Active Session ID Store ---
/**
 * Stores the currently active session ID with persistence
 */
const createActiveSessionIdStore = () => {
  const { subscribe, set } = writable(null);

  // Load initial value from persistent store
  async function load() {
    const value = await sessionDataStore.get('activeSessionId');
    if (value) set(value);
  }
  load();

  return {
    subscribe,
    set: async (value) => {
      await sessionDataStore.set('activeSessionId', value);
      await sessionDataStore.save();
      set(value);
    }
  };
};

export const activeSessionId = createActiveSessionIdStore();

// --- Derived Store: Active Session Messages ---
/**
 * Derived store that provides messages for the currently active session
 */
export const activeSessionMessages = derived(
  [sessions, activeSessionId],
  ([$sessions, $activeSessionId]) => {
    if ($activeSessionId && $sessions[$activeSessionId]) {
      return $sessions[$activeSessionId].messages;
    }
    return [];
  }
);

// --- Derived Store: Active Session Title ---
/**
 * Derived store that provides the title for the currently active session
 */
export const activeSessionTitle = derived(
  [sessions, activeSessionId],
  ([$sessions, $activeSessionId]) => {
    if ($activeSessionId && $sessions[$activeSessionId]) {
      return $sessions[$activeSessionId].title;
    }
    return 'New Chat';
  }
);

// --- Selected Model Store ---
/**
 * Stores the selected model name with persistence
 */
const createSelectedModelStore = () => {
  const { subscribe, set } = writable('llama3'); // Default model

  // Load initial value from persistent store
  async function load() {
    const value = await settingsStore.get('selectedModel');
    if (value) set(value);
  }
  load();

  return {
    subscribe,
    set: async (value) => {
      await settingsStore.set('selectedModel', value);
      await settingsStore.save();
      set(value);
    }
  };
};

export const selectedModel = createSelectedModelStore();

// --- System Prompt Store ---
/**
 * Stores the system prompt with persistence
 */
const createSystemPromptStore = () => {
  const { subscribe, set } = writable(''); // Default: no system prompt

  // Load initial value from persistent store
  async function load() {
    const value = await settingsStore.get('systemPrompt');
    if (value) set(value);
  }
  load();

  return {
    subscribe,
    set: async (value) => {
      await settingsStore.set('systemPrompt', value);
      await settingsStore.save();
      set(value);
    }
  };
};

export const systemPrompt = createSystemPromptStore();

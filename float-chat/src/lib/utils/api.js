/**
 * Ollama API communication module for Phase 1 (non-streaming)
 * API Endpoint: http://localhost:11434/api/chat
 */

const DEFAULT_API_ENDPOINT = 'http://localhost:11434';
const DEFAULT_MODEL = 'llama3';

/**
 * Fetch chat response from Ollama API (non-streaming mode)
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} apiEndpoint - API endpoint URL (default: http://localhost:11434)
 * @param {string} model - Model name (default: llama3)
 * @returns {Promise<string>} - Assistant's response content
 */
export async function fetchChatResponse(
  messages,
  apiEndpoint = DEFAULT_API_ENDPOINT,
  model = DEFAULT_MODEL
) {
  const url = `${apiEndpoint}/api/chat`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        stream: false, // Phase 1: non-streaming mode
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Extract assistant's response from the API response
    if (data.message && data.message.content) {
      return data.message.content;
    } else {
      throw new Error('Invalid response format from API');
    }
  } catch (error) {
    console.error('Error fetching chat response:', error);
    throw error;
  }
}

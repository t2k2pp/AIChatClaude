/**
 * Ollama API communication module
 * Phase 2: Streaming support with NDJSON (Newline Delimited JSON)
 * API Endpoint: http://localhost:11434/api/chat
 */

const DEFAULT_API_ENDPOINT = 'http://localhost:11434';
const DEFAULT_MODEL = 'llama3';

/**
 * Fetch chat response from Ollama API with streaming support
 * Phase 2: Processes NDJSON stream and calls onToken for each token
 *
 * @param {Array} messages - Array of message objects with role and content
 * @param {Function} onToken - Callback function called for each token chunk (token: string) => void
 * @param {string} apiEndpoint - API endpoint URL (default: http://localhost:11434)
 * @param {string} model - Model name (default: llama3)
 * @returns {Promise<void>} - Resolves when streaming is complete
 */
export async function fetchChatResponseStreaming(
  messages,
  onToken,
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
        stream: true, // Phase 2: Enable streaming
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Process the streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // Decode the chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });

      // Split by newlines to get individual JSON objects
      const lines = buffer.split('\n');

      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || '';

      // Process each complete line
      for (const line of lines) {
        if (line.trim() === '') {
          continue;
        }

        try {
          const data = JSON.parse(line);

          // Extract token from the response
          if (data.message && data.message.content) {
            onToken(data.message.content);
          }

          // Check if streaming is complete
          if (data.done) {
            return;
          }
        } catch (parseError) {
          console.error('Error parsing JSON line:', line, parseError);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching streaming response:', error);
    throw error;
  }
}

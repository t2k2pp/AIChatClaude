<script>
  /**
   * Settings Modal component
   * Enhanced: Configure API endpoint, model selection, and system prompt
   */
  import { apiEndpoint, selectedModel, systemPrompt } from '$lib/stores.js';

  let { isOpen = $bindable(false) } = $props(); // Control modal visibility

  let tempEndpoint = $state($apiEndpoint);
  let tempModel = $state($selectedModel);
  let tempSystemPrompt = $state($systemPrompt);

  // Update temp values when modal opens or store changes
  $effect(() => {
    tempEndpoint = $apiEndpoint;
    tempModel = $selectedModel;
    tempSystemPrompt = $systemPrompt;
  });

  // Common model options
  const modelOptions = [
    'llama3',
    'llama3.1',
    'llama3.2',
    'mistral',
    'codellama',
    'phi',
    'gemma',
    'qwen',
    'custom' // For custom model names
  ];

  function handleSave() {
    apiEndpoint.set(tempEndpoint);
    selectedModel.set(tempModel);
    systemPrompt.set(tempSystemPrompt);
    isOpen = false;
  }

  function handleCancel() {
    tempEndpoint = $apiEndpoint;
    tempModel = $selectedModel;
    tempSystemPrompt = $systemPrompt;
    isOpen = false;
  }

  function handleReset() {
    tempEndpoint = 'http://localhost:11434';
    tempModel = 'llama3';
    tempSystemPrompt = '';
  }
</script>

<!-- DaisyUI Modal -->
{#if isOpen}
  <div class="modal modal-open">
    <div class="modal-box max-w-2xl max-h-[90vh] overflow-y-auto">
      <h3 class="font-bold text-lg mb-4">Settings</h3>

      <!-- API Endpoint Setting -->
      <div class="form-control">
        <label class="label" for="api-endpoint">
          <span class="label-text">API Endpoint</span>
        </label>
        <input
          id="api-endpoint"
          type="text"
          class="input input-bordered w-full"
          bind:value={tempEndpoint}
          placeholder="http://localhost:11434"
        />
        <label class="label">
          <span class="label-text-alt text-gray-500">
            URL for Ollama or LMStudio API
          </span>
        </label>
      </div>

      <!-- Quick Presets -->
      <div class="mt-4">
        <label class="label">
          <span class="label-text">Quick Presets</span>
        </label>
        <div class="flex gap-2">
          <button
            class="btn btn-sm btn-outline"
            onclick={() => (tempEndpoint = 'http://localhost:11434')}
          >
            Ollama (11434)
          </button>
          <button
            class="btn btn-sm btn-outline"
            onclick={() => (tempEndpoint = 'http://localhost:1234')}
          >
            LMStudio (1234)
          </button>
        </div>
      </div>

      <!-- Model Selection -->
      <div class="form-control mt-4">
        <label class="label" for="model-select">
          <span class="label-text">Model</span>
        </label>
        <select
          id="model-select"
          class="select select-bordered w-full"
          bind:value={tempModel}
        >
          {#each modelOptions as model}
            <option value={model}>{model}</option>
          {/each}
        </select>
        <label class="label">
          <span class="label-text-alt text-gray-500">
            Select the AI model to use
          </span>
        </label>
      </div>

      <!-- Custom Model Name (if 'custom' selected) -->
      {#if tempModel === 'custom'}
        <div class="form-control mt-2">
          <input
            type="text"
            class="input input-bordered w-full"
            bind:value={tempModel}
            placeholder="Enter custom model name"
          />
        </div>
      {/if}

      <!-- System Prompt -->
      <div class="form-control mt-4">
        <label class="label" for="system-prompt">
          <span class="label-text">System Prompt (Optional)</span>
        </label>
        <textarea
          id="system-prompt"
          class="textarea textarea-bordered w-full"
          rows="4"
          bind:value={tempSystemPrompt}
          placeholder="You are a helpful assistant..."
        ></textarea>
        <label class="label">
          <span class="label-text-alt text-gray-500">
            Set a custom system prompt to guide the AI's behavior
          </span>
        </label>
      </div>

      <!-- Modal Actions -->
      <div class="modal-action">
        <button class="btn btn-ghost" onclick={handleReset}>Reset</button>
        <button class="btn btn-ghost" onclick={handleCancel}>Cancel</button>
        <button class="btn btn-primary" onclick={handleSave}>Save</button>
      </div>
    </div>

    <!-- Click outside to close -->
    <div class="modal-backdrop" onclick={handleCancel}></div>
  </div>
{/if}

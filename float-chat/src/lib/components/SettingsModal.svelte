<script>
  /**
   * Settings Modal component
   * Phase 3: Configure API endpoint and other settings
   */
  import { apiEndpoint } from '$lib/stores.js';

  let { isOpen = $bindable(false) } = $props(); // Control modal visibility

  let tempEndpoint = $state($apiEndpoint);

  // Update temp value when modal opens or store changes
  $effect(() => {
    tempEndpoint = $apiEndpoint;
  });

  function handleSave() {
    apiEndpoint.set(tempEndpoint);
    isOpen = false;
  }

  function handleCancel() {
    tempEndpoint = $apiEndpoint; // Reset to original value
    isOpen = false;
  }

  function handleReset() {
    tempEndpoint = 'http://localhost:11434'; // Reset to default
  }
</script>

<!-- DaisyUI Modal -->
{#if isOpen}
  <div class="modal modal-open">
    <div class="modal-box">
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

<script>
  import { enhancePrompt } from '../api/enhancePrompt.js';
  let postEnhance = false;
  let loading = false;
  let disabled = false;
  let originalParagraphs, enhancedParagraphs;
  async function enhancePromptFirstTime() {
    loading = true;
    // Adjust the selector if needed to target ChatGPT's prompt input.
    const textarea = document.getElementById('prompt-textarea');
    if (textarea) {
      const paragraphs = textarea.querySelectorAll('p');
      if (paragraphs.length > 0) {
        try {
          const originalPrompt = Array.from(paragraphs).map(p => p.innerText).join('\n');
          console.log('originalPrompt', originalPrompt);
          const enhanced = await enhancePrompt(originalPrompt);
          // Remove any leftover <p> elements after updating
          const updatedParagraphs = enhanced.split('\n').map(text => {
            const p = document.createElement('p');
            p.innerText = text;
            return p;
          });
          originalParagraphs = Array.from(paragraphs).map(p => p.cloneNode(true)); // Save a copy of the paragraphs exactly
          enhancedParagraphs = updatedParagraphs;
          // Clear existing paragraphs and append updated ones
          paragraphs.forEach(p => p.remove());
          updatedParagraphs.forEach(p => textarea.appendChild(p));
          postEnhance = true;
        } catch (error) {
          console.error('Error enhancing prompt:', error);
        }
      } else {
        console.error('No <p> elements found in the prompt textarea.');
      }
    }
    loading = false;
  }
  async function handleClick() {
    if (!postEnhance) {
      await enhancePromptFirstTime();
    } else {
      restoreOriginalPrompt();
    }
  }
  function restoreOriginalPrompt() {
    const textarea = document.getElementById('prompt-textarea');
    if (textarea) {
      const currentParagraphs = textarea.querySelectorAll('p');
      currentParagraphs.forEach(p => p.remove());
      originalParagraphs.forEach(p => textarea.appendChild(p));
      postEnhance = false;
    }
  }
  export function resetComponent() {
    disabled = true;
    postEnhance = false;
    loading = false;
    originalParagraphs = null;
    enhancedParagraphs = null;
  }
  export function enableComponent() {
    disabled = false;
  }
</script>

<div class="relative">
  <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-gray-100 text-center normal-case text-sm font-semibold rounded-lg opacity-0 peer-hover:opacity-100 transition-opacity duration-150 delay-500 whitespace-nowrap">
    Optimize your prompt
  </div>
  <button
    class="peer relative flex h-9 px-3 font-semibold gap-1 items-center justify-center rounded-full bg-black text-white transition-colors focus-visible:outline-none focus-visible:outline-black disabled:text-gray-50 disabled:opacity-50 can-hover:hover:opacity-70 dark:bg-white dark:text-black {loading ? 'opacity-50' : ''}"
    on:click={handleClick}
    disabled={disabled}
  >
  {#if !postEnhance}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
    Enhance
    <!-- <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" class = "w-6 h-6">
      <path d="M440-520h80v-280q0-17-11.5-28.5T480-840q-17 0-28.5 11.5T440-800v280ZM200-360h560v-80H200v80Zm-58 240h98v-80q0-17 11.5-28.5T280-240q17 0 28.5 11.5T320-200v80h120v-80q0-17 11.5-28.5T480-240q17 0 28.5 11.5T520-200v80h120v-80q0-17 11.5-28.5T680-240q17 0 28.5 11.5T720-200v80h98l-40-160H182l-40 160Zm676 80H142q-39 0-63-31t-14-69l55-220v-80q0-33 23.5-56.5T200-520h160v-280q0-50 35-85t85-35q50 0 85 35t35 85v280h160q33 0 56.5 23.5T840-440v80l55 220q13 38-11.5 69T818-40Zm-58-400H200h560Zm-240-80h-80 80Z"/>
    </svg> -->
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 mr-1">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
    </svg>
    Revert
  {/if}
  </button>
</div>
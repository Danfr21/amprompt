export function enhancePrompt(prompt) {
  console.log('entered enhancePrompt');
  return new Promise((resolve, reject) => {
    // Create a handler for responses from the extension.
    function onResponse(event) {
      if (event.source !== window) return;
      if (event.data && event.data.direction === 'FROM_EXTENSION_TO_PAGE') {
        window.removeEventListener('message', onResponse);
        if (event.data.message && event.data.message.error) {
          reject(event.data.message.error);
        } else {
          const optimizedPrompt = event.data.message.optimizedPrompt.replace(/^(\*+)/, "").replace("Optimized Prompt:", "").trim().replace(/['"]/g, '');
          resolve(optimizedPrompt);
        }
      }
    }

    window.addEventListener('message', onResponse);

    // Post a message to our bridge content script. This message will be forwarded
    // to the background script.
    window.postMessage(
      {
        direction: 'FROM_PAGE_TO_EXTENSION',
        message: { action: 'enhancePrompt', prompt },
      },
      '*'
    );
    console.log('posted message');
  });
}
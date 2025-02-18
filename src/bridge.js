// This script runs as a true content script and has chrome.runtime available
// Listen for messages from the page (the injected script)
console.log('bridge.js loaded');
window.addEventListener('message', (event) => {
    console.log('message', event);
    // Only accept messages from the same window.
    if (event.source !== window) return;
  
    // Check that this is a message we expect from our page script.
    if (event.data && event.data.direction === 'FROM_PAGE_TO_EXTENSION') {
      // Forward the message to the background script using chrome.runtime.sendMessage:
      chrome.runtime.sendMessage(event.data.message, (response) => {
        // Post the response back to the page
        window.postMessage(
          {
            direction: 'FROM_EXTENSION_TO_PAGE',
            message: response,
          },
          '*'
        );
      });
    }
  });
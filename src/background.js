chrome.runtime.onInstalled.addListener(() => {
    console.log('Background script installed');
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete') {
        const url = changeInfo.url || tab.url;
        console.log('URL', url);
        if (url && (url.includes('chat.openai.com') || url.includes('chatgpt.com'))) {
          console.log('Injecting content script dynamically');
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['src/bridge.js'] // Ensure this matches the path in your dist folder
          }, () => {
            console.log('bridge.js injected');
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                // files: ['content.js'] // Ensure this matches the path in your dist folder
                func: () => {
                // Create a new script element
                const script = document.createElement('script');
                // Set it as a module so that import statements are allowed
                script.type = 'module';
                // Use chrome.runtime.getURL to reference your bundled content script file.
                // Ensure that this path matches where your file is built (e.g. in your extension root).
                script.src = chrome.runtime.getURL('/content.js');
                console.log('Injecting content script dynamically', script.src);
                console.log('chrome.runtime.getURL', chrome.runtime.getURL('/content.js'));
                document.body.appendChild(script);
                }
            });
          });
        } else {
          console.log('Not injecting content script');
        }
      }
    });
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('onMessage', message);
    if (message.action === "enhancePrompt") {
        fetch("https://promptimize.2nddanfr.workers.dev", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: message.prompt })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response data:', data); // Log the response
            sendResponse({ optimizedPrompt: data.optimizedPrompt });
        })
        .catch(error => sendResponse({ error: error.message }));

        return true; // Required to keep sendResponse async
    }
});

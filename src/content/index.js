import EnhancePromptButton from '../components/EnhancePromptButton.svelte';

function injectButton() {
  const container = document.createElement('div');
  container.id = 'enhance-prompt-button-container';
  
  const findNearElement = () => {
    return document.querySelector('[data-testid="composer-speech-button"]') || 
           document.querySelector('[data-testid="send-button"]');
  };

  let nearElement = findNearElement();
  let styleObserver;
  
  if (nearElement) {
  
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.zIndex = '9999'; // Ensure it's on top
  
    document.body.appendChild(wrapper); // Append to DOM first
  
    const updateWrapperPosition = () => {
      nearElement = findNearElement(); // Re-select the element
      if (nearElement) {
        const nearRect = nearElement.getBoundingClientRect();
        
        if (document.body.contains(nearElement) && nearRect.width > 0 && nearRect.height > 0) {
          wrapper.style.right = `${window.innerWidth - nearRect.left + 10}px`; // Move left
          wrapper.style.top = `${nearRect.top}px`; // Align with the top of nearElement
        } else {
          console.warn('nearElement is not visible or not in the DOM');
        }
      }
    };

    const updateWrapperPositionByElement = () => {
      if (nearElement) {
        const nearRect = nearElement.getBoundingClientRect();
        if (document.body.contains(nearElement) && nearRect.width > 0 && nearRect.height > 0) {
          wrapper.style.right = `${window.innerWidth - nearRect.left + 10}px`; // Move left
          wrapper.style.top = `${nearRect.top}px`; // Align with the top of nearElement
        } else {
          console.warn('nearElement is not visible or not in the DOM');
        }
      }
    };

    updateWrapperPosition(); // Initial position update

    // Observe changes in the entire document for nearElement replacement
    const observer = new MutationObserver(() => {
      const newNearElement = findNearElement();
      if (newNearElement !== nearElement) {
        nearElement = newNearElement;
        updateWrapperPosition();
        // Re-attach the style observer to the new nearElement
        if (styleObserver) {
          styleObserver.disconnect();
        }
        observeNearElementStyle();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Function to observe style changes of nearElement
    const observeNearElementStyle = () => {
      const composer = document.getElementById("composer-background");
      if (composer) {
        styleObserver = new ResizeObserver(updateWrapperPositionByElement);
        styleObserver.observe(composer);
      }
    };

    observeNearElementStyle(); // Start observing the initial nearElement's style

    window.addEventListener('resize', updateWrapperPosition);
    wrapper.appendChild(container); // Append our Shadow DOM inside wrapper
    const enhancePromptButtonInstance = new EnhancePromptButton({
      target: container
    });

    // Function to attach a listener to the textarea if not already attached
    function checkIfTextareaIsEmpty() {
      const textareaContainer = document.getElementById('prompt-textarea');
      if (textareaContainer) {
        const placeholderP = textareaContainer.querySelector('p.placeholder[data-placeholder="Message ChatGPT"]');
        
        if (placeholderP) {
          enhancePromptButtonInstance.resetComponent(); // Directly call the resetComponent function
        }
        else{
          enhancePromptButtonInstance.enableComponent(); // Directly call the resetComponent function
        }
      }
    }
    // Start by attempting to attach to an existing textarea
    checkIfTextareaIsEmpty();

    // Create a MutationObserver on a stable container (using document.body here)
    const textAreaObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          checkIfTextareaIsEmpty(); // Check if the <p> element is present
        }
      });
    });

    // Observe the whole body (or a more specific parent container if possible)
    textAreaObserver.observe(document.body, { childList: true, subtree: true });

  }
}

// Ensure the DOM is ready before injecting
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectButton);
} else {
  injectButton();
} 
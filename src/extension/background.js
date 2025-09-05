// CodeCraft Background Script
chrome.runtime.onInstalled.addListener(() => {
  console.log('CodeCraft extension installed');
});

// Handle extension icon clicks
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: 'toggle' }).catch(() => {
    // Content script not ready yet
  });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getServerStatus') {
    // Check if CodeCraft server is running
    fetch('http://localhost:3001/api/project-info')
      .then(response => response.json())
      .then(data => {
        sendResponse({ status: 'connected', data });
      })
      .catch(error => {
        sendResponse({ status: 'disconnected', error: error.message });
      });
    return true; // Keep message channel open for async response
  }
});

// CodeCraft Popup Script
document.addEventListener('DOMContentLoaded', async () => {
  const statusDiv = document.getElementById('status');
  const toggleBtn = document.getElementById('toggleBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  
  // Check server connection
  await checkServerConnection();
  
  // Set up event listeners
  toggleBtn.addEventListener('click', toggleCodeCraft);
  settingsBtn.addEventListener('click', openSettings);
  
  async function checkServerConnection() {
    try {
      // Try to connect to the server directly
      const response = await fetch('http://localhost:3001/api/project-info');
      
      if (response.ok) {
        const data = await response.json();
        statusDiv.className = 'status connected';
        statusDiv.innerHTML = `
          ✅ Connected to CodeCraft server<br>
          <small>Project: ${data.name || 'Unknown'}</small>
        `;
        toggleBtn.disabled = false;
        toggleBtn.textContent = 'Toggle CodeCraft';
      } else {
        throw new Error('Server not responding');
      }
    } catch (error) {
      statusDiv.className = 'status disconnected';
      statusDiv.innerHTML = `
        ❌ CodeCraft server not running<br>
        <small>Start the server with: npm run dev</small>
      `;
      toggleBtn.disabled = true;
      toggleBtn.textContent = 'Server Not Running';
    }
  }
  
  async function toggleCodeCraft() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Try to send message to content script
      try {
        await chrome.tabs.sendMessage(tab.id, { action: 'toggle' });
        window.close();
      } catch (contentScriptError) {
        // If content script is not loaded, inject it first
        console.log('Content script not loaded, injecting...');
        
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
        
        // Wait a moment for the script to load
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Try again
        await chrome.tabs.sendMessage(tab.id, { action: 'toggle' });
        window.close();
      }
    } catch (error) {
      console.error('Error toggling CodeCraft:', error);
      // Show error to user
      statusDiv.className = 'status error';
      statusDiv.innerHTML = `
        ❌ Error: ${error.message}<br>
        <small>Try refreshing the page and try again</small>
      `;
    }
  }
  
  function openSettings() {
    // Open settings page or show settings modal
    chrome.tabs.create({ url: 'http://localhost:3001/settings' });
  }
});

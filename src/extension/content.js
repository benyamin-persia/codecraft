// CodeCraft Content Script v3.0 - HTTP Only (WebSocket Removed)
class CodeCraftExtension {
  constructor() {
    console.log('🎯 CodeCraft Extension v3.0 - HTTP Only');
    this.isActive = false;
    this.selectedElement = null;
    this.overlay = null;
    this.panel = null;
    this.serverUrl = 'http://localhost:3001';
    
    this.init();
  }

  init() {
    this.createOverlay();
    this.createPanel();
    this.setupMessageListener();
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'codecraft-overlay';
    this.overlay.setAttribute('data-codecraft', 'overlay');
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.1);
      z-index: 999999;
      pointer-events: none;
      display: none;
    `;
    document.body.appendChild(this.overlay);
  }

  createPanel() {
    // Create floating panel
    this.panel = document.createElement('div');
    this.panel.id = 'codecraft-panel';
    this.panel.setAttribute('data-codecraft', 'panel');
    this.panel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 350px;
      background: white;
      border: 1px solid #e1e5e9;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      z-index: 1000000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: none;
      pointer-events: auto;
    `;
    
    this.panel.innerHTML = `
      <div style="padding: 16px; border-bottom: 1px solid #e1e5e9;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">
            🎯 CodeCraft
          </h3>
          <button id="codecraft-close" style="
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #666;
            padding: 4px;
          ">×</button>
        </div>
      </div>
      
      <div style="padding: 16px;">
        <div id="codecraft-status" style="
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
          color: #666;
        ">
          Click on any element to select it for modification
        </div>
        
        <div id="codecraft-selected" style="display: none; margin-bottom: 16px;">
          <div style="font-size: 12px; color: #666; margin-bottom: 8px;">Selected Element:</div>
          <div id="codecraft-element-info" style="
            padding: 8px;
            background: #e3f2fd;
            border-radius: 6px;
            font-size: 13px;
            font-family: monospace;
          "></div>
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #1a1a1a;">
            What do you want to change?
          </label>
          <textarea id="codecraft-instruction" placeholder="e.g., Change the button color to blue, make the text larger, add a hover effect..." style="
            width: 100%;
            height: 80px;
            padding: 12px;
            border: 1px solid #e1e5e9;
            border-radius: 8px;
            font-size: 14px;
            font-family: inherit;
            resize: vertical;
            box-sizing: border-box;
          "></textarea>
        </div>
        
        <div style="display: flex; gap: 8px; flex-direction: column;">
          <button id="codecraft-send-cursor" style="
            background: #28a745;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
          " onmouseover="this.style.background='#218838'" onmouseout="this.style.background='#28a745'">
            🚀 Send to Cursor AI
          </button>
          <div style="display: flex; gap: 8px;">
            <button id="codecraft-modify" style="
              flex: 1;
              background: #007bff;
              color: white;
              border: none;
              padding: 12px;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              transition: background 0.2s;
            " onmouseover="this.style.background='#0056b3'" onmouseout="this.style.background='#007bff'">
              ✨ Modify Code
            </button>
            <button id="codecraft-clear" style="
              background: #6c757d;
              color: white;
              border: none;
              padding: 12px;
              border-radius: 8px;
              font-size: 14px;
              cursor: pointer;
              transition: background 0.2s;
            " onmouseover="this.style.background='#545b62'" onmouseout="this.style.background='#6c757d'">
              Clear
            </button>
          </div>
        </div>
        
        <div id="codecraft-loading" style="
          display: none;
          text-align: center;
          padding: 16px;
          color: #666;
        ">
          <div style="margin-bottom: 8px;">🤖 AI is working...</div>
          <div style="font-size: 12px;">Modifying your code...</div>
        </div>
        
        <div id="codecraft-result" style="
          display: none;
          margin-top: 16px;
          padding: 12px;
          background: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 8px;
          font-size: 14px;
          color: #155724;
        "></div>
      </div>
    `;
    
    document.body.appendChild(this.panel);
    this.setupPanelEvents();
  }

  setupPanelEvents() {
    const closeBtn = this.panel.querySelector('#codecraft-close');
    const modifyBtn = this.panel.querySelector('#codecraft-modify');
    const clearBtn = this.panel.querySelector('#codecraft-clear');
    const sendCursorBtn = this.panel.querySelector('#codecraft-send-cursor');
    const instructionInput = this.panel.querySelector('#codecraft-instruction');

    closeBtn.addEventListener('click', () => this.hidePanel());
    clearBtn.addEventListener('click', () => this.clearSelection());
    
    modifyBtn.addEventListener('click', () => this.modifyCode());
    sendCursorBtn.addEventListener('click', () => this.sendToCursorAI());
    
    instructionInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        this.sendToCursorAI();
      }
    });
  }

  // WebSocket functionality removed to prevent errors
  // Extension works via HTTP only

  // WebSocket methods removed - extension works via HTTP only

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.action) {
        case 'toggle':
          this.toggle();
          break;
        case 'selectElement':
          this.selectElement(request.element);
          break;
      }
    });
  }

  toggle() {
    this.isActive = !this.isActive;
    
    if (this.isActive) {
      this.activate();
    } else {
      this.deactivate();
    }
  }

  activate() {
    this.overlay.style.display = 'block';
    this.overlay.style.pointerEvents = 'none'; // Don't block clicks on the webpage
    this.panel.style.display = 'block';
    
    // Add click listener to document
    document.addEventListener('click', this.handleElementClick.bind(this), true);
    document.addEventListener('mouseover', this.handleElementHover.bind(this), true);
    document.addEventListener('mouseout', this.handleElementHoverOut.bind(this), true);
    
    this.updateStatus('Click on any element to select it for modification');
  }

  deactivate() {
    this.overlay.style.display = 'none';
    this.overlay.style.pointerEvents = 'none';
    this.panel.style.display = 'none';
    
    // Remove event listeners
    document.removeEventListener('click', this.handleElementClick.bind(this), true);
    document.removeEventListener('mouseover', this.handleElementHover.bind(this), true);
    document.removeEventListener('mouseout', this.handleElementHoverOut.bind(this), true);
    
    this.clearSelection();
  }

  handleElementClick(event) {
    if (!this.isActive) return;
    
    // Don't select extension elements
    if (this.isExtensionElement(event.target)) {
      return;
    }
    
    event.preventDefault();
    event.stopPropagation();
    
    this.selectElement(event.target);
  }

  isExtensionElement(element) {
    // Check if element is part of our extension
    if (element.id && typeof element.id === 'string' && (
      element.id.includes('codecraft') || 
      element.id.includes('extension') ||
      element.id.includes('popup')
    )) {
      return true;
    }
    
    // Check if element has extension-related classes
    if (element.className && typeof element.className === 'string' && (
      element.className.includes('codecraft') ||
      element.className.includes('extension') ||
      element.className.includes('popup')
    )) {
      return true;
    }
    
    // Check if element is inside our extension panel or overlay
    if (element.closest('#codecraft-panel') || 
        element.closest('#codecraft-overlay') ||
        element.closest('[data-codecraft]')) {
      return true;
    }
    
    // Check if element is the extension popup itself
    if (element.closest('body[data-extension]') ||
        element.closest('.browser-extension') ||
        element.closest('[data-extension-id]')) {
      return true;
    }
    
    return false;
  }

  handleElementHover(event) {
    if (!this.isActive) return;
    
    // Don't highlight extension elements
    if (this.isExtensionElement(event.target)) {
      return;
    }
    
    event.target.style.outline = '2px solid #007bff';
    event.target.style.outlineOffset = '2px';
  }

  handleElementHoverOut(event) {
    if (!this.isActive) return;
    
    // Don't modify extension elements
    if (this.isExtensionElement(event.target)) {
      return;
    }
    
    event.target.style.outline = '';
    event.target.style.outlineOffset = '';
  }

  selectElement(element) {
    this.selectedElement = element;
    
    // Remove previous selection styling
    document.querySelectorAll('.codecraft-selected').forEach(el => {
      el.classList.remove('codecraft-selected');
      el.style.outline = '';
      el.style.outlineOffset = '';
    });
    
    // Add selection styling
    element.classList.add('codecraft-selected');
    element.style.outline = '2px solid #28a745';
    element.style.outlineOffset = '2px';
    
    // Update panel
    this.updateElementInfo(element);
    this.updateStatus('Element selected! Enter your instruction below.');
    
    // Element selected - ready for modification via HTTP
  }

  getElementContext(element) {
    return {
      tagName: element.tagName.toLowerCase(),
      className: element.className,
      id: element.id,
      textContent: element.textContent?.substring(0, 100) || '',
      attributes: Array.from(element.attributes).reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {}),
      xpath: this.getXPath(element),
      selector: this.getSelector(element)
    };
  }

  getXPath(element) {
    if (element.id) {
      return `//*[@id="${element.id}"]`;
    }
    
    const path = [];
    while (element && element.nodeType === Node.ELEMENT_NODE) {
      let selector = element.nodeName.toLowerCase();
      if (element.previousElementSibling) {
        let index = 1;
        let sibling = element.previousElementSibling;
        while (sibling) {
          if (sibling.nodeName.toLowerCase() === selector) {
            index++;
          }
          sibling = sibling.previousElementSibling;
        }
        selector += `[${index}]`;
      }
      path.unshift(selector);
      element = element.parentElement;
    }
    return '/' + path.join('/');
  }

  getSelector(element) {
    if (element.id) {
      return `#${element.id}`;
    }
    
    const path = [];
    while (element && element.nodeType === Node.ELEMENT_NODE) {
      let selector = element.nodeName.toLowerCase();
      if (element.className) {
        selector += '.' + element.className.split(' ').join('.');
      }
      path.unshift(selector);
      element = element.parentElement;
    }
    return path.join(' > ');
  }

  updateElementInfo(element) {
    const infoDiv = this.panel.querySelector('#codecraft-element-info');
    const selectedDiv = this.panel.querySelector('#codecraft-selected');
    
    const context = this.getElementContext(element);
    infoDiv.innerHTML = `
      <strong>${context.tagName}</strong>
      ${context.id ? `#${context.id}` : ''}
      ${context.className ? `.${context.className.split(' ').join('.')}` : ''}
      ${context.textContent ? `<br/>"${context.textContent}"` : ''}
    `;
    
    selectedDiv.style.display = 'block';
  }

  updateStatus(message) {
    const statusDiv = this.panel.querySelector('#codecraft-status');
    statusDiv.textContent = message;
  }

  clearSelection() {
    this.selectedElement = null;
    
    // Remove selection styling
    document.querySelectorAll('.codecraft-selected').forEach(el => {
      el.classList.remove('codecraft-selected');
      el.style.outline = '';
      el.style.outlineOffset = '';
    });
    
    // Clear panel
    this.panel.querySelector('#codecraft-selected').style.display = 'none';
    this.panel.querySelector('#codecraft-instruction').value = '';
    this.panel.querySelector('#codecraft-result').style.display = 'none';
    this.updateStatus('Click on any element to select it for modification');
  }

  async sendToCursorAI() {
    if (!this.selectedElement) {
      this.updateStatus('Please select an element first');
      return;
    }
    
    const instruction = this.panel.querySelector('#codecraft-instruction').value.trim();
    if (!instruction) {
      this.updateStatus('Please enter an instruction');
      return;
    }
    
    // Show loading state
    this.panel.querySelector('#codecraft-loading').style.display = 'block';
    this.panel.querySelector('#codecraft-send-cursor').disabled = true;
    
    try {
      // Create a Stagewise-style message for Cursor AI
      const elementContext = this.getElementContext(this.selectedElement);
      const cursorMessage = this.buildCursorMessage(instruction, elementContext);
      
      console.log('CodeCraft: Sending message to Cursor AI...');
      console.log('CodeCraft: Element:', elementContext.tagName, elementContext.className || elementContext.id);
      console.log('CodeCraft: Instruction:', instruction);
      
      // Send to CodeCraft server which will handle Cursor AI integration
      const response = await fetch(`${this.serverUrl}/api/send-to-cursor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instruction,
          elementContext,
          message: cursorMessage
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        if (result.sentToChat) {
          this.showResult('✅ Message sent directly to Cursor AI chat! Check your chat window.');
        } else if (result.clipboardCopied) {
          this.showResult('📋 Message copied to clipboard! Paste it in your Cursor AI chat (Ctrl+V)');
          
          // Also open the message page for easy access
          if (result.messageUrl) {
            setTimeout(() => {
              window.open(result.messageUrl, '_blank');
            }, 1000);
          }
        } else {
          this.showResult('✅ Sent to Cursor AI! Check your Cursor chat.');
        }
        this.panel.querySelector('#codecraft-instruction').value = '';
      } else {
        this.showResult(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.error('CodeCraft: Error sending to Cursor AI:', error);
      this.showResult(`❌ Error: ${error.message}`);
    } finally {
      this.panel.querySelector('#codecraft-loading').style.display = 'none';
      this.panel.querySelector('#codecraft-send-cursor').disabled = false;
    }
  }

  buildCursorMessage(instruction, elementContext) {
    return `I want to modify this element in my React component:

ELEMENT CONTEXT:
- Tag: ${elementContext.tagName}
- Classes: ${elementContext.className || 'none'}
- ID: ${elementContext.id || 'none'}
- Text: ${elementContext.textContent || 'none'}

INSTRUCTION: ${instruction}

Please modify the code to implement this change. Focus on the specific element and make the requested modification.`;
  }

  async modifyCode() {
    if (!this.selectedElement) {
      this.updateStatus('Please select an element first');
      return;
    }
    
    const instruction = this.panel.querySelector('#codecraft-instruction').value.trim();
    if (!instruction) {
      this.updateStatus('Please enter an instruction');
      return;
    }
    
    // Show loading state
    this.panel.querySelector('#codecraft-loading').style.display = 'block';
    this.panel.querySelector('#codecraft-modify').disabled = true;
    
    try {
      // Get file path (this is a simplified approach)
      const filePath = await this.detectFilePath(this.selectedElement);
      
      const response = await fetch(`${this.serverUrl}/api/modify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instruction,
          elementContext: this.getElementContext(this.selectedElement),
          filePath
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        this.showResult('✅ Code modified successfully!');
        this.panel.querySelector('#codecraft-instruction').value = '';
      } else {
        this.showResult(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      this.showResult(`❌ Error: ${error.message}`);
    } finally {
      this.panel.querySelector('#codecraft-loading').style.display = 'none';
      this.panel.querySelector('#codecraft-modify').disabled = false;
    }
  }

  async detectFilePath(element) {
    // Try to detect the component file based on element context
    const elementContext = this.getElementContext(element);
    
    // Look for common React component patterns
    if (elementContext.className) {
      const className = elementContext.className.split(' ')[0];
      if (className) {
        // Try to map class names to component files
        const possibleFiles = [
          `src/components/${className}.jsx`,
          `src/components/${className}.js`,
          `src/${className}.jsx`,
          `src/${className}.js`,
          `src/App.jsx`,
          `src/App.js`
        ];
        
        // For now, return the most likely file
        return possibleFiles[0];
      }
    }
    
    // Default to common React files
    return 'src/App.jsx';
  }

  showResult(message) {
    const resultDiv = this.panel.querySelector('#codecraft-result');
    resultDiv.textContent = message;
    resultDiv.style.display = 'block';
    
    setTimeout(() => {
      resultDiv.style.display = 'none';
    }, 5000);
  }

  hidePanel() {
    this.deactivate();
  }
}

// Initialize CodeCraft when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.codecraft = new CodeCraftExtension();
  });
} else {
  window.codecraft = new CodeCraftExtension();
}

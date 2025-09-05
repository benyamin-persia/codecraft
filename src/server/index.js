const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3100;
const APP_PORT = process.env.APP_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve CodeCraft assets FIRST (before proxy routes)
app.get('/cursor-message.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/cursor-message.html'));
});

app.get('/inject', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/inject.html'));
});

// Serve CodeCraft injection script
app.get('/codecraft.js', (req, res) => {
  const script = `
    // CodeCraft Injection Script - Stagewise Alternative
    (function() {
      console.log('🎯 CodeCraft: Injecting into your React app...');
      
      let isActive = false;
      let selectedElement = null;
      let overlay = null;
      let panel = null;
      
      function createOverlay() {
        overlay = document.createElement('div');
        overlay.id = 'codecraft-overlay';
        overlay.style.cssText = \`
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.1);
          z-index: 999999;
          pointer-events: none;
          display: none;
        \`;
        document.body.appendChild(overlay);
      }
      
      function createPanel() {
        panel = document.createElement('div');
        panel.id = 'codecraft-panel';
        panel.style.cssText = \`
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
        \`;
        
        panel.innerHTML = \`
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
              ">
                🚀 Send to Cursor AI
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
              ">
                Clear Selection
              </button>
            </div>
            
            <div id="codecraft-loading" style="
              display: none;
              text-align: center;
              padding: 16px;
              color: #666;
            ">
              <div style="margin-bottom: 8px;">🤖 Sending to Cursor AI...</div>
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
        \`;
        
        document.body.appendChild(panel);
        setupPanelEvents();
      }
      
      function setupPanelEvents() {
        const closeBtn = panel.querySelector('#codecraft-close');
        const clearBtn = panel.querySelector('#codecraft-clear');
        const sendCursorBtn = panel.querySelector('#codecraft-send-cursor');
        const instructionInput = panel.querySelector('#codecraft-instruction');

        closeBtn.addEventListener('click', () => {
          panel.style.display = 'none';
          overlay.style.display = 'none';
        });
        
        clearBtn.addEventListener('click', clearSelection);
        sendCursorBtn.addEventListener('click', sendToCursorAI);
        
        instructionInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && e.ctrlKey) {
            sendToCursorAI();
          }
        });
      }
      
      function selectElement(element) {
        selectedElement = element;
        
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
        updateElementInfo(element);
        updatePanelStatus('Element selected! Enter your instruction below.');
        
        // Show panel
        panel.style.display = 'block';
        overlay.style.display = 'block';
      }
      
      function updateElementInfo(element) {
        const infoDiv = panel.querySelector('#codecraft-element-info');
        const selectedDiv = panel.querySelector('#codecraft-selected');
        
        const context = getElementContext(element);
        infoDiv.innerHTML = \`
          <strong>\${context.tagName}</strong>
          \${context.id ? \`#\${context.id}\` : ''}
          \${context.className ? \`.\${context.className.split(' ').join('.')}\` : ''}
          \${context.textContent ? \`<br/>"\${context.textContent}"\` : ''}
        \`;
        
        selectedDiv.style.display = 'block';
      }
      
      function getElementContext(element) {
        return {
          tagName: element.tagName.toLowerCase(),
          className: element.className,
          id: element.id,
          textContent: element.textContent?.substring(0, 100) || '',
          attributes: Array.from(element.attributes).reduce((acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
          }, {})
        };
      }
      
      function updatePanelStatus(message) {
        const statusDiv = panel.querySelector('#codecraft-status');
        statusDiv.textContent = message;
      }
      
      function clearSelection() {
        selectedElement = null;
        
        // Remove selection styling
        document.querySelectorAll('.codecraft-selected').forEach(el => {
          el.classList.remove('codecraft-selected');
          el.style.outline = '';
          el.style.outlineOffset = '';
        });
        
        // Clear panel
        panel.querySelector('#codecraft-selected').style.display = 'none';
        panel.querySelector('#codecraft-instruction').value = '';
        panel.querySelector('#codecraft-result').style.display = 'none';
        updatePanelStatus('Click on any element to select it for modification');
      }
      
      async function sendToCursorAI() {
        if (!selectedElement) {
          updatePanelStatus('Please select an element first');
          return;
        }
        
        const instruction = panel.querySelector('#codecraft-instruction').value.trim();
        if (!instruction) {
          updatePanelStatus('Please enter an instruction');
          return;
        }
        
        // Show loading state
        panel.querySelector('#codecraft-loading').style.display = 'block';
        panel.querySelector('#codecraft-send-cursor').disabled = true;
        
        try {
          const elementContext = getElementContext(selectedElement);
          const cursorMessage = buildCursorMessage(instruction, elementContext);
          
          console.log('CodeCraft: Sending message to Cursor AI...');
          console.log('CodeCraft: Element:', elementContext.tagName, elementContext.className || elementContext.id);
          console.log('CodeCraft: Instruction:', instruction);
          
          // Send to CodeCraft server which will handle Cursor AI integration
          const response = await fetch('http://localhost:3100/api/send-to-cursor', {
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
              showResult('✅ Message sent directly to Cursor AI chat! Check your chat window.');
            } else if (result.clipboardCopied) {
              showResult('📋 Message copied to clipboard! Paste it in your Cursor AI chat (Ctrl+V)');
            } else {
              showResult('✅ Sent to Cursor AI! Check your Cursor chat.');
            }
            panel.querySelector('#codecraft-instruction').value = '';
          } else {
            showResult(\`❌ Error: \${result.error}\`);
          }
        } catch (error) {
          console.error('CodeCraft: Error sending to Cursor AI:', error);
          showResult(\`❌ Error: \${error.message}\`);
        } finally {
          panel.querySelector('#codecraft-loading').style.display = 'none';
          panel.querySelector('#codecraft-send-cursor').disabled = false;
        }
      }
      
      function buildCursorMessage(instruction, elementContext) {
        return \`I want to modify this element in my React component:

ELEMENT CONTEXT:
- Tag: \${elementContext.tagName}
- Classes: \${elementContext.className || 'none'}
- ID: \${elementContext.id || 'none'}
- Text: \${elementContext.textContent || 'none'}

INSTRUCTION: \${instruction}

Please modify the code to implement this change. Focus on the specific element and make the requested modification.\`;
      }
      
      function showResult(message) {
        const resultDiv = panel.querySelector('#codecraft-result');
        resultDiv.textContent = message;
        resultDiv.style.display = 'block';
        
        setTimeout(() => {
          resultDiv.style.display = 'none';
        }, 5000);
      }
      
      // Initialize CodeCraft
      function init() {
        createOverlay();
        createPanel();
        
        // Add click listener to document
        document.addEventListener('click', (event) => {
          if (isActive && !event.target.closest('#codecraft-panel')) {
            event.preventDefault();
            event.stopPropagation();
            selectElement(event.target);
          }
        }, true);
        
        console.log('🎯 CodeCraft: Ready! Click on elements to select them.');
      }
      
      // Start CodeCraft
      function start() {
        isActive = true;
        console.log('🎯 CodeCraft: Started! Click on elements to select them.');
      }
      
      // Stop CodeCraft
      function stop() {
        isActive = false;
        if (panel) panel.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
        clearSelection();
        console.log('🎯 CodeCraft: Stopped.');
      }
      
      // Make functions globally available
      window.CodeCraft = {
        start: start,
        stop: stop,
        init: init
      };
      
      // Auto-initialize
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
    })();
  `;
  
  res.setHeader('Content-Type', 'application/javascript');
  res.send(script);
});

// Root route - PROXY to the user's app with CodeCraft injection
app.get('/', async (req, res) => {
  try {
    // Fetch the user's app content
    const response = await fetch(`http://localhost:${APP_PORT}${req.url}`);
    const html = await response.text();
    
    // Inject CodeCraft script into the HTML
    const codecraftScript = `
      <script>
        // Auto-inject CodeCraft
        (function() {
          const script = document.createElement('script');
          script.src = 'http://localhost:${PORT}/codecraft.js';
          script.onload = function() {
            // Auto-start CodeCraft when script loads
            if (window.CodeCraft) {
              window.CodeCraft.start();
              console.log('🎯 CodeCraft: Auto-started! Click on elements to select them.');
            }
          };
          document.head.appendChild(script);
        })();
      </script>
    `;
    
    // Insert the script before closing body tag
    const modifiedHtml = html.replace('</body>', codecraftScript + '</body>');
    
    res.send(modifiedHtml);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('Failed to load your app. Make sure it\'s running on port ' + APP_PORT);
  }
});

// Proxy all other routes to the user's app
app.get('*', async (req, res) => {
  try {
    const targetUrl = `http://localhost:${APP_PORT}${req.url}`;
    console.log(`Proxying: ${req.url} -> ${targetUrl}`);
    
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      console.error(`Proxy error: ${response.status} ${response.statusText} for ${req.url}`);
      return res.status(response.status).send(`Failed to load resource: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('text/html')) {
      // For HTML responses, inject CodeCraft
      const html = await response.text();
      const codecraftScript = `
        <script>
          // Auto-inject CodeCraft
          (function() {
            const script = document.createElement('script');
            script.src = 'http://localhost:${PORT}/codecraft.js';
            script.onload = function() {
              // Auto-start CodeCraft when script loads
              if (window.CodeCraft) {
                window.CodeCraft.start();
                console.log('🎯 CodeCraft: Auto-started! Click on elements to select them.');
              }
            };
            document.head.appendChild(script);
          })();
        </script>
      `;
      const modifiedHtml = html.replace('</body>', codecraftScript + '</body>');
      res.set('Content-Type', 'text/html');
      res.send(modifiedHtml);
    } else {
      // For other content types (CSS, JS, images), proxy directly
      const buffer = await response.arrayBuffer();
      
      // Copy relevant headers
      const headersToCopy = ['content-type', 'content-length', 'cache-control', 'etag'];
      headersToCopy.forEach(header => {
        const value = response.headers.get(header);
        if (value) {
          res.set(header, value);
        }
      });
      
      res.send(Buffer.from(buffer));
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send(`Failed to load resource: ${error.message}`);
  }
});



// WebSocket server for real-time communication
const wss = new WebSocket.Server({ port: 8080 });

// Store connected clients
const clients = new Set();

// AI Service Integration - Cursor AI
class AIService {
  constructor() {
    this.cursorPort = process.env.CURSOR_PORT || 3000;
    this.cursorHost = process.env.CURSOR_HOST || 'localhost';
    this.useCursorAI = process.env.USE_CURSOR_AI === 'true';
    this.fallbackToOpenAI = process.env.FALLBACK_TO_OPENAI === 'true';
    this.openaiApiKey = process.env.OPENAI_API_KEY;
  }

  async generateCode(instruction, elementContext, fileContent, filePath) {
    if (this.useCursorAI) {
      return await this.generateWithCursorAI(instruction, elementContext, fileContent, filePath);
    } else if (this.fallbackToOpenAI && this.openaiApiKey) {
      return await this.generateWithOpenAI(instruction, elementContext, fileContent, filePath);
    } else {
      throw new Error('No AI service configured. Set USE_CURSOR_AI=true or provide OPENAI_API_KEY');
    }
  }

  async generateWithCursorAI(instruction, elementContext, fileContent, filePath) {
    try {
      // Create a Stagewise-style prompt for Cursor AI
      const prompt = this.buildStagewisePrompt(instruction, elementContext, fileContent, filePath);
      
      // For now, we'll simulate the response and show the user what to do
      // In a real implementation, this would integrate with Cursor's API
      console.log('🎯 CodeCraft: Sending to Cursor AI...');
      console.log('📝 Instruction:', instruction);
      console.log('🎨 Element:', elementContext.tagName, elementContext.className || elementContext.id);
      console.log('📁 File:', filePath);
      
      // Return a response that tells the user what was sent to Cursor
      return {
        success: true,
        message: `✅ Sent to Cursor AI: "${instruction}" for ${elementContext.tagName} element in ${filePath}`,
        prompt: prompt,
        elementContext: elementContext,
        filePath: filePath
      };
    } catch (error) {
      console.error('Cursor AI Service Error:', error);
      throw new Error('Failed to send to Cursor AI: ' + error.message);
    }
  }

  buildStagewisePrompt(instruction, elementContext, fileContent, filePath) {
    return `I want to modify this element in my React component:

ELEMENT CONTEXT:
- Tag: ${elementContext.tagName}
- Classes: ${elementContext.className || 'none'}
- ID: ${elementContext.id || 'none'}
- Text: ${elementContext.textContent || 'none'}

FILE: ${filePath}

INSTRUCTION: ${instruction}

Please modify the code to implement this change. Focus on the specific element and make the requested modification.`;
  }

  async generateWithOpenAI(instruction, elementContext, fileContent, filePath) {
    try {
      const prompt = this.buildPrompt(instruction, elementContext, fileContent, filePath);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a frontend development assistant. You will receive instructions to modify code based on user interactions with UI elements. 

Your task is to:
1. Understand the user's instruction
2. Analyze the current code structure
3. Make precise modifications to achieve the desired result
4. Return ONLY the modified code, not explanations

Guidelines:
- Preserve existing functionality unless explicitly asked to change it
- Maintain code style and formatting
- Use modern JavaScript/TypeScript best practices
- Ensure accessibility and performance
- Return the complete file content with your modifications`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI Service Error:', error);
      throw new Error('Failed to generate code with OpenAI: ' + error.message);
    }
  }

  buildPrompt(instruction, elementContext, fileContent, filePath) {
    return `
INSTRUCTION: ${instruction}

ELEMENT CONTEXT:
- File: ${filePath}
- Element: ${elementContext.tagName}
- Classes: ${elementContext.className}
- ID: ${elementContext.id}
- Text Content: ${elementContext.textContent}
- Attributes: ${JSON.stringify(elementContext.attributes)}

CURRENT FILE CONTENT:
\`\`\`
${fileContent}
\`\`\`

Please modify the code to implement the requested change. Return the complete modified file content.
`;
  }
}

const aiService = new AIService();

// File modification service
class FileService {
  constructor() {
    this.projectRoot = process.env.PROJECT_ROOT || 'E:\\savakv2';
    this.watcher = null;
  }

  async modifyFile(filePath, newContent) {
    try {
      const fullPath = path.resolve(this.projectRoot, filePath);
      await fs.writeFile(fullPath, newContent, 'utf8');
      console.log(`File modified: ${filePath}`);
      return true;
    } catch (error) {
      console.error('File modification error:', error);
      throw new Error('Failed to modify file: ' + error.message);
    }
  }

  async readFile(filePath) {
    try {
      const fullPath = path.resolve(this.projectRoot, filePath);
      return await fs.readFile(fullPath, 'utf8');
    } catch (error) {
      console.error('File read error:', error);
      throw new Error('Failed to read file: ' + error.message);
    }
  }

  startWatching() {
    this.watcher = chokidar.watch(this.projectRoot, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true
    });

    this.watcher.on('change', (filePath) => {
      // Notify clients about file changes
      const relativePath = path.relative(this.projectRoot, filePath);
      this.broadcastToClients({
        type: 'file_changed',
        filePath: relativePath
      });
    });
  }

  broadcastToClients(message) {
    const messageStr = JSON.stringify(message);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }
}

const fileService = new FileService();

// API Routes
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'CodeCraft server is running',
    port: PORT,
    appPort: APP_PORT
  });
});

app.post('/api/modify-code', async (req, res) => {
  try {
    const { instruction, elementContext, filePath } = req.body;

    if (!instruction || !elementContext || !filePath) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Read current file content
    const currentContent = await fileService.readFile(filePath);

    // Generate new code using AI
    const newContent = await aiService.generateCode(
      instruction,
      elementContext,
      currentContent,
      filePath
    );

    // Apply changes to file
    await fileService.modifyFile(filePath, newContent);

    res.json({ 
      success: true, 
      message: 'Code modified successfully',
      filePath,
      preview: newContent.substring(0, 500) + '...'
    });

  } catch (error) {
    console.error('Modify code error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send message to Cursor AI
app.post('/api/send-to-cursor', async (req, res) => {
  try {
    const { instruction, elementContext, message } = req.body;
    
    console.log('🎯 CodeCraft: Sending to Cursor AI...');
    console.log('📝 Instruction:', instruction);
    console.log('🎨 Element:', elementContext.tagName, elementContext.className || elementContext.id);
    console.log('💬 Message:', message);
    
    // Create a formatted message for Cursor AI
    const cursorMessage = `I want to modify this element in my React component:

ELEMENT CONTEXT:
- Tag: ${elementContext.tagName}
- Classes: ${elementContext.className || 'none'}
- ID: ${elementContext.id || 'none'}
- Text: ${elementContext.textContent || 'none'}

INSTRUCTION: ${instruction}

Please modify the code to implement this change. Focus on the specific element and make the requested modification.`;

    // Method 1: Try to send directly to CodeCraft Cursor extension
    let sentToChat = false;
    
    // Try multiple ports in case the extension is running on a different port
    const extensionPorts = [3003, 3004];
    
    for (const port of extensionPorts) {
      try {
        const axios = require('axios');
        
        // Try to send the message directly (skip health check for now)
        console.log(`🎯 CodeCraft: Trying to send message to extension on port ${port}...`);
        const response = await axios.post(`http://localhost:${port}/send-message`, {
          message: cursorMessage
        }, { timeout: 5000 });
        
        if (response.data.success) {
          console.log(`✅ CodeCraft extension found on port ${port}`);
          console.log('✅ Message sent directly to Cursor AI via CodeCraft extension!');
          sentToChat = true;
          break;
        }
      } catch (error) {
        console.log(`⚠️ Could not connect to CodeCraft extension on port ${port}: ${error.message}`);
      }
    }
    
    if (!sentToChat) {
      console.log('💡 Make sure the CodeCraft extension is installed and running in Cursor AI');
      console.log('💡 You can install it from the marketplace or run: cursor --install-extension codecraft-cursor-extension-1.0.0.vsix');
    }
    
    // Method 2: Create a message file that Cursor AI can read
    try {
      const messageFile = path.join(fileService.projectRoot, 'codecraft_message.txt');
      await fs.writeFile(messageFile, cursorMessage, 'utf8');
      
      console.log('📝 Message saved to project root:', messageFile);
      console.log('💡 You can copy this message and paste it in your Cursor AI chat');
      
      // Also try to copy to clipboard
      try {
        const { exec } = require('child_process');
        exec(`powershell -command "Get-Content '${messageFile}' | Set-Clipboard"`, (clipboardError) => {
          if (clipboardError) {
            console.log('⚠️ Could not copy to clipboard:', clipboardError.message);
          } else {
            console.log('📋 Message also copied to clipboard!');
          }
        });
      } catch (clipboardError) {
        console.log('⚠️ Clipboard copy failed:', clipboardError.message);
      }
      
      // Clean up message file after 30 seconds
      setTimeout(() => {
        fs.unlink(messageFile).catch(() => {});
      }, 30000);
      
    } catch (fileError) {
      console.log('⚠️ Could not save message file:', fileError.message);
    }
    
    // Method 3: Open Cursor AI chat window with the message
    try {
      const { exec } = require('child_process');
      
      // Try to open Cursor AI and focus on chat
      exec('powershell -command "Get-Process Cursor -ErrorAction SilentlyContinue | ForEach-Object { $_.MainWindowTitle }"', (error, stdout, stderr) => {
        if (!error && stdout.trim()) {
          console.log('✅ Cursor AI is running');
          console.log('💡 Please manually paste the message in your Cursor AI chat');
        } else {
          console.log('⚠️ Cursor AI not detected');
        }
      });
      
    } catch (error) {
      console.log('⚠️ Could not detect Cursor AI');
    }
    
    res.json({ 
      success: true, 
      message: 'Message prepared for Cursor AI! Check the console for details.',
      instruction,
      elementContext,
      cursorMessage: cursorMessage,
      sentToChat: sentToChat,
      messageUrl: 'http://localhost:3100/cursor-message.html?message=' + encodeURIComponent(cursorMessage)
    });

  } catch (error) {
    console.error('Send to Cursor error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/project-info', async (req, res) => {
  try {
    const packageJsonPath = path.join(fileService.projectRoot, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath).catch(() => ({}));
    
    res.json({
      projectRoot: fileService.projectRoot,
      name: packageJson.name || 'Unknown Project',
      version: packageJson.version || '1.0.0',
      dependencies: packageJson.dependencies || {},
      devDependencies: packageJson.devDependencies || {}
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get project info' });
  }
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data.type);
      
      // Handle different message types
      switch (data.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }));
          break;
        case 'element_selected':
          // Broadcast to other clients
          clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'element_selected',
                element: data.element
              }));
            }
          });
          break;
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 CodeCraft server running on port ${PORT}`);
  console.log(`📁 Watching project: ${fileService.projectRoot}`);
  console.log(`🔗 Your app is running on port ${APP_PORT}`);
  
  // Start file watching
  fileService.startWatching();
  
  console.log('\n✨ CodeCraft is ready!');
  console.log('🌐 Opening browser...');
  
  // Automatically open browser
  setTimeout(() => {
    const url = `http://localhost:${PORT}`;
    console.log(`🔗 Opening: ${url}`);
    
    // Open browser (works on Windows, Mac, Linux)
    const command = process.platform === 'win32' 
      ? `start ${url}`
      : process.platform === 'darwin' 
        ? `open ${url}`
        : `xdg-open ${url}`;
    
    exec(command, (error) => {
      if (error) {
        console.log('⚠️ Could not auto-open browser. Please open manually:');
        console.log(`   ${url}`);
      } else {
        console.log('✅ Browser opened!');
        console.log('🎯 CodeCraft is now running like Stagewise!');
        console.log(`📖 Your React app: http://localhost:${APP_PORT}`);
        console.log('📖 Click "Auto-Inject CodeCraft" to start!');
      }
    });
  }, 1000);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down CodeCraft...');
  if (fileService.watcher) {
    fileService.watcher.close();
  }
  process.exit(0);
});

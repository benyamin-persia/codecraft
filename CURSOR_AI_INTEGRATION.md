# CodeCraft + Cursor AI Integration

CodeCraft is designed to work seamlessly with Cursor AI, providing a visual interface for element selection while leveraging Cursor's powerful AI capabilities.

## How It Works

1. **CodeCraft** provides the visual interface (browser extension + server)
2. **Cursor AI** handles the actual code generation
3. **CodeCraft** applies the generated code to your files

## Setup Instructions

### 1. Configure CodeCraft for Cursor AI

Create a `.env` file in the CodeCraft directory:

```bash
# Cursor AI Configuration
USE_CURSOR_AI=true
CURSOR_HOST=localhost
CURSOR_PORT=3000

# Your project root
PROJECT_ROOT=/path/to/your/project
```

### 2. Start Cursor AI

Make sure Cursor AI is running and accessible. Cursor AI typically runs on:
- **Port 3000** (default)
- **Localhost** (local development)

### 3. Start CodeCraft

```bash
cd codecraft
npm install
npm run dev
```

### 4. Install Browser Extension

1. Open Chrome/Edge and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `codecraft/src/extension` folder

## Usage

1. **Start your development server** (React, Vue, etc.)
2. **Start CodeCraft** (`npm run dev`)
3. **Open your app** in the browser
4. **Click the CodeCraft extension** icon
5. **Click "Toggle CodeCraft"** to activate
6. **Click on any element** you want to modify
7. **Type your instruction** (e.g., "Change the button color to blue")
8. **Click "Modify Code"** - CodeCraft will send the request to Cursor AI
9. **Watch your code update** automatically!

## How CodeCraft Communicates with Cursor AI

CodeCraft sends requests to Cursor AI in this format:

```json
{
  "message": "INSTRUCTION: Change the button color to blue\n\nELEMENT CONTEXT:\n- File: src/App.jsx\n- Element: button\n- Classes: btn btn-primary\n- ID: submit-btn\n- Text Content: Submit\n\nCURRENT FILE CONTENT:\n```\n// Your current file content\n```",
  "context": {
    "filePath": "src/App.jsx",
    "elementContext": {
      "tagName": "button",
      "className": "btn btn-primary",
      "id": "submit-btn",
      "textContent": "Submit"
    },
    "instruction": "Change the button color to blue",
    "currentFileContent": "// Your current file content"
  },
  "options": {
    "model": "cursor",
    "temperature": 0.1
  }
}
```

## Troubleshooting

### Cursor AI Not Responding

1. **Check if Cursor AI is running**:
   ```bash
   curl http://localhost:3000/api/cursor/generate
   ```

2. **Verify the port** in your `.env` file matches Cursor AI's port

3. **Check Cursor AI logs** for any errors

### Connection Issues

1. **Firewall**: Make sure port 3000 is accessible
2. **CORS**: Cursor AI might need CORS configuration for CodeCraft
3. **API Endpoint**: Verify the API endpoint path in CodeCraft matches Cursor AI's API

### Code Not Updating

1. **File Permissions**: Ensure CodeCraft has write access to your project files
2. **File Path**: Check that the file path detection is working correctly
3. **Cursor AI Response**: Verify Cursor AI is returning valid code

## Advanced Configuration

### Custom Cursor AI Endpoint

If Cursor AI runs on a different endpoint:

```bash
# .env
CURSOR_HOST=localhost
CURSOR_PORT=8080
CURSOR_ENDPOINT=/api/v1/generate
```

### Multiple AI Providers

You can configure fallback options:

```bash
# .env
USE_CURSOR_AI=true
FALLBACK_TO_OPENAI=true
OPENAI_API_KEY=your_key_here
```

## Benefits of Using Cursor AI

- **No additional API costs** - Use your existing Cursor AI setup
- **Familiar AI model** - Same AI you're already using in Cursor
- **Local processing** - Your code stays on your machine
- **Consistent results** - Same AI behavior across Cursor and CodeCraft

## Example Workflow

1. You have a React app running on `localhost:3000`
2. Cursor AI is running and accessible
3. You click on a button in your app
4. You type: "Make this button red and add a hover effect"
5. CodeCraft sends this to Cursor AI with the button's context
6. Cursor AI generates the updated CSS/JSX code
7. CodeCraft applies the changes to your source files
8. Your app hot-reloads with the new styling

This gives you the visual, browser-based coding experience of Stagewise while using your existing Cursor AI setup!




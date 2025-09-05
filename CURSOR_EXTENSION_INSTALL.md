# 🎯 CodeCraft Cursor AI Extension Installation

## Quick Setup (No Copy-Paste Required!)

### Step 1: Install the CodeCraft Extension in Cursor AI

1. **Open Cursor AI**
2. **Go to Extensions** (Ctrl+Shift+X)
3. **Click "Install from VSIX..."**
4. **Navigate to:** `codecraft/src/cursor-extension/`
5. **Select:** `codecraft-cursor-extension-1.0.0.vsix` (we'll create this)
6. **Click Install**

### Step 2: Verify Installation

1. **Open Command Palette** (Ctrl+Shift+P)
2. **Type:** `CodeCraft: Send Message`
3. **You should see the command available**

### Step 3: Test the Integration

1. **Run CodeCraft:** `npx visual-codecraft@latest`
2. **Click on an element** in your React app
3. **Enter instruction:** "Change the button text to Login"
4. **Click "Send to Cursor AI"**
5. **The message should appear directly in your Cursor AI chat!**

## How It Works (Using Stagewise's Exact Method!)

- **CodeCraft server** sends messages to **port 3003**
- **Cursor extension** receives messages on **port 3003**
- **Extension** injects a fake diagnostic error with your message
- **Extension** calls `composer.fixerrormessage` command
- **Cursor AI** sees the "error" and responds with the fix
- **No copying and pasting required!**

## Troubleshooting

### Extension Not Working?
- Make sure Cursor AI is running
- Check that the extension is enabled in Extensions panel
- Restart Cursor AI after installation

### Port 3003 Busy?
- The extension automatically uses port 3003
- If busy, restart Cursor AI

### Messages Not Appearing in Chat?
- Check the Output panel for "CodeCraft" channel
- Make sure Cursor AI chat is open
- Try the command palette: `CodeCraft: Send Message`

## Manual Installation (Alternative)

If VSIX installation doesn't work:

1. **Copy the extension folder** to your Cursor AI extensions directory:
   ```
   %USERPROFILE%\.cursor\extensions\codecraft-cursor-extension-1.0.0\
   ```

2. **Restart Cursor AI**

3. **The extension should be active automatically**

## Success Indicators

✅ **Extension active:** "CodeCraft Cursor Extension is now active!" in console
✅ **Server running:** "Extension server running on port 3003" in console  
✅ **Message sent:** "Message sent directly to Cursor AI via CodeCraft extension!" in CodeCraft console
✅ **Chat opens:** Cursor AI chat automatically opens with your message

## Need Help?

- Check the **Output panel** → **CodeCraft** channel for logs
- Make sure both **CodeCraft server** and **Cursor AI** are running
- The extension runs automatically when Cursor AI starts

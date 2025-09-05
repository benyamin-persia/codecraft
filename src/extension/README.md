# CodeCraft Browser Extension

This browser extension provides the visual interface for CodeCraft, allowing you to select elements and interact with the AI coding assistant.

## Installation

### Development Installation

1. Open Chrome/Edge and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `src/extension` folder from this project
5. The CodeCraft extension should now appear in your extensions

### Production Installation

The extension will be available on the Chrome Web Store once published.

## Usage

1. **Start CodeCraft Server**: Make sure the CodeCraft server is running (`npm run dev`)
2. **Navigate to your app**: Go to your development website (usually `http://localhost:3000`)
3. **Click the extension icon**: Click the CodeCraft icon in your browser toolbar
4. **Toggle CodeCraft**: Click "Toggle CodeCraft" to activate element selection
5. **Select elements**: Click on any element in your webpage to select it
6. **Enter instructions**: Type what you want to change in the instruction box
7. **Modify code**: Click "Modify Code" and watch your code update automatically!

## Features

- **Visual Element Selection**: Click on any element to select it for modification
- **Real-time Communication**: WebSocket connection to the CodeCraft server
- **Intuitive Interface**: Clean, modern UI that doesn't interfere with your workflow
- **Cross-frame Support**: Works with iframes and complex web applications
- **Keyboard Shortcuts**: Ctrl+Enter to submit instructions quickly

## Troubleshooting

### Extension not working?
- Make sure the CodeCraft server is running on port 3001
- Check that your development server is running
- Try refreshing the page and toggling the extension again

### Can't select elements?
- Make sure you've clicked "Toggle CodeCraft" first
- Check that the page has finished loading
- Try disabling other extensions that might interfere

### AI not responding?
- Verify your API key is set in the `.env` file
- Check the server console for error messages
- Ensure you have sufficient API credits

## Development

To modify the extension:

1. Make changes to the files in `src/extension/`
2. Go to `chrome://extensions/`
3. Click the refresh icon on the CodeCraft extension
4. Test your changes

## Permissions

The extension requires these permissions:
- `activeTab`: To interact with the current webpage
- `storage`: To save user preferences
- `scripting`: To inject the content script
- `host_permissions`: To communicate with localhost development servers

## Security

- The extension only works on localhost/127.0.0.1 by default
- No data is sent to external servers except your configured AI service
- All communication is encrypted when using HTTPS




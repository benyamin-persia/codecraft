# CodeCraft - Visual AI Coding Assistant

**The free alternative to Stagewise** - Transform your web development workflow with visual element selection and direct Cursor AI integration.

## ✨ What is CodeCraft?

CodeCraft is a powerful visual coding assistant that lets you select any element on your web page and send it directly to Cursor AI for instant code generation, debugging, and modifications. No more manual copying, pasting, or describing elements - just click and code!

## 🚀 Key Features

- **🎯 Visual Element Selection** - Click any element to select it instantly
- **🤖 Direct Cursor AI Integration** - Send elements and instructions directly to Cursor AI chat
- **⚡ Zero Manual Work** - No copying, pasting, or manual descriptions needed
- **🆓 Completely Free** - No subscriptions, limits, or hidden costs
- **🔧 Easy Setup** - One command to install, one click to use

## 🚀 Quick Start

### 1. Install CodeCraft
```bash
npx visual-codecraft@latest
```

### 2. Install Cursor AI Extension
1. Open Cursor AI
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "CodeCraft"
4. Click Install

### 3. Start Using
1. Start your development server (e.g., `npm start` on port 3000)
2. CodeCraft will automatically proxy your app to `localhost:3100`
3. Click on any element to select it
4. Enter your instruction
5. Click "Send to Cursor AI"

## 📦 What's Included

- **Main Server** (`src/server/`) - Node.js proxy server
- **Cursor Extension** (`src/cursor-extension/`) - VS Code extension for Cursor AI
- **Frontend Script** (`public/`) - Browser-side element selection

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build extension
cd src/cursor-extension
npm run compile
```

## 📋 Requirements

- Node.js 16+
- Cursor AI
- A running development server

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

**Made with ❤️ as a free alternative to Stagewise**
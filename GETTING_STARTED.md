# 🚀 Getting Started with CodeCraft

CodeCraft is a free alternative to Stagewise that provides visual AI coding assistance for frontend development. Follow this guide to get up and running in minutes!

## 📋 Prerequisites

- Node.js 18+ installed
- A frontend project (React, Vue, Angular, etc.)
- OpenAI API key (free tier available)

## 🛠️ Installation

### 1. Clone or Download CodeCraft

```bash
# If you have the codecraft folder
cd codecraft

# Install dependencies
npm install
```

### 2. Set Up Your API Key

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your OpenAI API key
OPENAI_API_KEY=your_api_key_here
```

**Getting an OpenAI API Key:**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy it to your `.env` file

### 3. Configure for Your Project

```bash
# Run the setup script from your project root
node path/to/codecraft/setup.js
```

This will:
- Detect your framework (React, Vue, Angular, etc.)
- Create configuration files
- Set up file watching patterns
- Create a test page

## 🎯 Usage

### 1. Start Your Development Server

First, start your frontend development server as usual:

```bash
# For React
npm start

# For Vue
npm run dev

# For Angular
ng serve

# For Next.js
npm run dev
```

### 2. Start CodeCraft

In a new terminal, start the CodeCraft server:

```bash
cd codecraft
npm run dev
```

You should see:
```
🚀 CodeCraft server running on port 3001
📁 Watching project: /path/to/your/project
🔗 WebSocket server on port 8080
✨ CodeCraft is ready!
```

### 3. Install the Browser Extension

1. Open Chrome/Edge and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `codecraft/src/extension` folder
5. The CodeCraft extension should appear in your toolbar

### 4. Start Coding Visually!

1. **Open your app** in the browser (usually `http://localhost:3000`)
2. **Click the CodeCraft extension icon** in your browser toolbar
3. **Click "Toggle CodeCraft"** to activate element selection
4. **Click on any element** you want to modify
5. **Type your instruction** in the panel (e.g., "Change the button color to blue")
6. **Click "Modify Code"** and watch your code update automatically!

## 🧪 Testing

Use the generated test page to verify everything works:

1. Open `codecraft-test.html` in your browser
2. Follow the instructions on the page
3. Try modifying the test elements

## 📁 Project Structure

```
codecraft/
├── src/
│   ├── server/           # Node.js server
│   └── extension/        # Browser extension
├── .env                  # Configuration
├── package.json
└── README.md
```

## ⚙️ Configuration

### Basic Configuration (`codecraft.config.js`)

```javascript
module.exports = {
  // Your project root
  projectRoot: process.cwd(),
  
  // Development server
  devServer: {
    port: 3000,
    host: 'localhost'
  },
  
  // AI settings
  ai: {
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    temperature: 0.1
  }
};
```

### Framework-Specific Configuration

CodeCraft automatically detects your framework and creates appropriate configurations:

- **React**: `codecraft.react.config.js`
- **Vue**: `codecraft.vue.config.js`
- **Angular**: `codecraft.angular.config.js`

## 🎨 Example Instructions

Here are some example instructions you can try:

### Styling Changes
- "Change the button color to red"
- "Make the text larger and bold"
- "Add a hover effect to the card"
- "Center align the content"

### Layout Changes
- "Add padding to the container"
- "Make the sidebar wider"
- "Stack the elements vertically"
- "Add a border around the form"

### Content Changes
- "Change the heading text to 'Welcome'"
- "Add a subtitle under the main title"
- "Update the button text to 'Submit'"
- "Add an icon next to the text"

### Interactive Changes
- "Add a click handler to the button"
- "Show a loading state when clicked"
- "Add form validation"
- "Create a toggle for dark mode"

## 🔧 Troubleshooting

### Server Won't Start
- Check if port 3001 is available
- Verify your `.env` file has the correct API key
- Make sure Node.js 18+ is installed

### Extension Not Working
- Ensure the CodeCraft server is running
- Check that you're on localhost/127.0.0.1
- Try refreshing the page and toggling the extension

### AI Not Responding
- Verify your OpenAI API key is correct
- Check you have sufficient API credits
- Look at the server console for error messages

### Can't Select Elements
- Make sure you've clicked "Toggle CodeCraft" first
- Check that the page has finished loading
- Try disabling other browser extensions

## 🆘 Getting Help

- **GitHub Issues**: Report bugs and request features
- **Discord**: Join our community for discussions
- **Documentation**: Check the full docs for advanced usage

## 🎉 What's Next?

Once you're comfortable with the basics:

1. **Explore advanced features** like custom file mapping
2. **Integrate with your CI/CD** pipeline
3. **Create custom AI prompts** for your specific needs
4. **Contribute to the project** and help make it better!

Happy coding with CodeCraft! 🚀




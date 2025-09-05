#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up CodeCraft...\n');

// Check if we're in a project directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.log('❌ No package.json found. Please run this from your project root.');
  process.exit(1);
}

// Create .env file if it doesn't exist
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  const envExample = fs.readFileSync(path.join(__dirname, '.env.example'), 'utf8');
  fs.writeFileSync(envPath, envExample);
  console.log('✅ .env file created. Please add your OpenAI API key.');
}

// Create CodeCraft configuration
const configPath = path.join(process.cwd(), 'codecraft.config.js');
if (!fs.existsSync(configPath)) {
  console.log('⚙️  Creating CodeCraft configuration...');
  const config = `module.exports = {
  // Project configuration
  projectRoot: process.cwd(),
  
  // Development server configuration
  devServer: {
    port: 3000,
    host: 'localhost'
  },
  
  // CodeCraft server configuration
  server: {
    port: 3001,
    wsPort: 8080
  },
  
  // File patterns to watch
  watchPatterns: [
    'src/**/*.{js,jsx,ts,tsx,vue,svelte}',
    'components/**/*.{js,jsx,ts,tsx,vue,svelte}',
    'pages/**/*.{js,jsx,ts,tsx,vue,svelte}'
  ],
  
  // File patterns to ignore
  ignorePatterns: [
    'node_modules/**',
    'dist/**',
    'build/**',
    '.git/**'
  ],
  
  // AI service configuration
  ai: {
    provider: 'openai', // 'openai', 'anthropic', 'huggingface', 'local'
    model: 'gpt-3.5-turbo',
    maxTokens: 4000,
    temperature: 0.1
  },
  
  // Framework detection
  framework: 'auto', // 'react', 'vue', 'angular', 'svelte', 'auto'
  
  // Custom file mapping (for complex projects)
  fileMapping: {
    // Custom logic to map elements to files
    // This is optional and will use auto-detection if not provided
  }
};`;
  
  fs.writeFileSync(configPath, config);
  console.log('✅ CodeCraft configuration created.');
}

// Check for common frameworks
console.log('🔍 Detecting framework...');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

let framework = 'unknown';
if (dependencies.react) framework = 'react';
else if (dependencies.vue) framework = 'vue';
else if (dependencies['@angular/core']) framework = 'angular';
else if (dependencies.svelte) framework = 'svelte';
else if (dependencies.next) framework = 'next';
else if (dependencies.nuxt) framework = 'nuxt';

console.log(`📦 Detected framework: ${framework}`);

// Create framework-specific configuration
const frameworkConfigPath = path.join(process.cwd(), `codecraft.${framework}.config.js`);
if (!fs.existsSync(frameworkConfigPath)) {
  console.log(`🎯 Creating ${framework}-specific configuration...`);
  
  let frameworkConfig = '';
  
  switch (framework) {
    case 'react':
      frameworkConfig = `module.exports = {
  framework: 'react',
  entryPoints: [
    'src/index.js',
    'src/index.jsx',
    'src/App.js',
    'src/App.jsx'
  ],
  componentPatterns: [
    'src/components/**/*.{js,jsx,ts,tsx}',
    'src/pages/**/*.{js,jsx,ts,tsx}'
  ],
  stylePatterns: [
    'src/**/*.css',
    'src/**/*.scss',
    'src/**/*.module.css'
  ]
};`;
      break;
      
    case 'vue':
      frameworkConfig = `module.exports = {
  framework: 'vue',
  entryPoints: [
    'src/main.js',
    'src/main.ts',
    'src/App.vue'
  ],
  componentPatterns: [
    'src/components/**/*.vue',
    'src/views/**/*.vue',
    'src/pages/**/*.vue'
  ],
  stylePatterns: [
    'src/**/*.css',
    'src/**/*.scss',
    'src/**/*.vue'
  ]
};`;
      break;
      
    case 'angular':
      frameworkConfig = `module.exports = {
  framework: 'angular',
  entryPoints: [
    'src/main.ts',
    'src/app/app.component.ts'
  ],
  componentPatterns: [
    'src/app/**/*.component.ts',
    'src/app/**/*.component.html'
  ],
  stylePatterns: [
    'src/**/*.css',
    'src/**/*.scss'
  ]
};`;
      break;
      
    default:
      frameworkConfig = `module.exports = {
  framework: '${framework}',
  entryPoints: [
    'src/index.js',
    'src/main.js',
    'index.html'
  ],
  componentPatterns: [
    'src/**/*.{js,jsx,ts,tsx,vue,svelte}'
  ],
  stylePatterns: [
    'src/**/*.css',
    'src/**/*.scss'
  ]
};`;
  }
  
  fs.writeFileSync(frameworkConfigPath, frameworkConfig);
  console.log(`✅ ${framework} configuration created.`);
}

// Create a simple test file
const testPath = path.join(process.cwd(), 'codecraft-test.html');
if (!fs.existsSync(testPath)) {
  console.log('🧪 Creating test file...');
  const testHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeCraft Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .test-button {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px;
        }
        .test-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>CodeCraft Test Page</h1>
    <p>This is a test page to verify CodeCraft is working correctly.</p>
    
    <div class="test-card">
        <h2>Test Elements</h2>
        <button class="test-button" id="button1">Click me!</button>
        <button class="test-button" id="button2">Another button</button>
        <p id="text1">This is some text that can be modified.</p>
    </div>
    
    <div class="test-card">
        <h2>Instructions</h2>
        <ol>
            <li>Start CodeCraft server: <code>npm run dev</code></li>
            <li>Install the browser extension</li>
            <li>Click on any element above</li>
            <li>Enter an instruction like "Change the button color to red"</li>
            <li>Watch the magic happen!</li>
        </ol>
    </div>
</body>
</html>`;
  
  fs.writeFileSync(testPath, testHtml);
  console.log('✅ Test file created at codecraft-test.html');
}

console.log('\n🎉 CodeCraft setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Add your OpenAI API key to the .env file');
console.log('2. Start your development server');
console.log('3. Run: npm run dev (in the CodeCraft directory)');
console.log('4. Install the browser extension');
console.log('5. Open codecraft-test.html to test');
console.log('\n🚀 Happy coding with CodeCraft!');




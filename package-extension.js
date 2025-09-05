const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎯 Building CodeCraft Cursor Extension...');

// Build the extension
try {
  console.log('📦 Compiling TypeScript...');
  execSync('npm run compile', { 
    cwd: path.join(__dirname, 'src/cursor-extension'),
    stdio: 'inherit'
  });
  
  console.log('✅ Extension compiled successfully!');
  console.log('');
  console.log('📋 Installation Instructions:');
  console.log('1. Open Cursor AI');
  console.log('2. Go to Extensions (Ctrl+Shift+X)');
  console.log('3. Click "Install from VSIX..."');
  console.log('4. Navigate to: codecraft/src/cursor-extension/');
  console.log('5. Select the .vsix file (if available)');
  console.log('6. Or manually copy the extension folder to:');
  console.log('   %USERPROFILE%\\.cursor\\extensions\\codecraft-cursor-extension-1.0.0\\');
  console.log('7. Restart Cursor AI');
  console.log('');
  console.log('🎯 The extension will automatically:');
  console.log('   - Start a server on port 3003');
  console.log('   - Receive messages from CodeCraft');
  console.log('   - Send them directly to Cursor AI chat');
  console.log('   - No copying and pasting required!');
  
} catch (error) {
  console.error('❌ Error building extension:', error.message);
  process.exit(1);
}


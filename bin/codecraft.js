#!/usr/bin/env node

const readline = require('readline');
const { spawn } = require('child_process');
const path = require('path');

// CodeCraft CLI Entry Point
console.log(`
    ,adPPYba,  ,adPPYba,  ,adPPYba,  ,adPPYba,  ,adPPYba,  ,adPPYba,  ,adPPYba,  
   a8"     "" a8"     "" a8"     "" a8"     "" a8"     "" a8"     "" a8"     "" 
   8b         8b         8b         8b         8b         8b         8b          
   "8a,   ,aa "8a,   ,aa "8a,   ,aa "8a,   ,aa "8a,   ,aa "8a,   ,aa "8a,   ,aa 
    \`"Ybbd8"'  \`"Ybbd8"'  \`"Ybbd8"'  \`"Ybbd8"'  \`"Ybbd8"'  \`"Ybbd8"'  \`"Ybbd8"'  
`);

console.log('🎯 VISUAL-CODECRAFT v1.0.0');
console.log('The free alternative to Stagewise - Visual AI coding assistant');
console.log('');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question, defaultValue = '') {
  return new Promise((resolve) => {
    const prompt = defaultValue ? `${question} ${defaultValue}` : question;
    rl.question(prompt, (answer) => {
      resolve(answer || defaultValue);
    });
  });
}

async function main() {
  try {
    // Ask for app port
    const appPort = await askQuestion('✓ What port is your development app running on?', '3000');
    
    // Ask about saving configuration
    const saveConfig = await askQuestion('✓ Would you like to save this configuration to codecraft.json? Y/n', 'n');
    
    if (saveConfig.toLowerCase() === 'y' || saveConfig.toLowerCase() === 'yes') {
      const fs = require('fs');
      const config = {
        appPort: appPort,
        codecraftPort: 3100
      };
      fs.writeFileSync('codecraft.json', JSON.stringify(config, null, 2));
      console.log('✓ Configuration saved to codecraft.json');
    }
    
    console.log('');
    console.log('📊 Account Information:');
    console.log('┌─────────────────────────────────────────┐');
    console.log('│ Email: free@visual-codecraft.com        │');
    console.log('│ Status: Free Alternative                │');
    console.log('│ Credits: Unlimited                      │');
    console.log('└─────────────────────────────────────────┘');
    console.log('Get more at https://github.com/visual-codecraft');
    console.log('');
    
    console.log('✓ Opening browser...');
    
    rl.close();
    
    // Get the directory where this script is located
    const scriptDir = path.dirname(__filename);
    const serverPath = path.join(scriptDir, '../src/server/index.js');
    
    // Set environment variables
    process.env.APP_PORT = appPort;
    
    // Start the server
    const server = spawn('node', [serverPath], {
      stdio: 'inherit',
      cwd: path.join(scriptDir, '..'),
      env: { ...process.env, APP_PORT: appPort }
    });
    
    // Handle server exit
    server.on('close', (code) => {
      console.log(`\n🛑 CodeCraft server exited with code ${code}`);
    });
    
    // Handle errors
    server.on('error', (err) => {
      console.error('❌ Failed to start CodeCraft server:', err);
      process.exit(1);
    });
    
    // Handle Ctrl+C
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down CodeCraft...');
      server.kill('SIGINT');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

main();
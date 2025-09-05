import * as vscode from 'vscode';
import * as http from 'http';

export function activate(context: vscode.ExtensionContext) {
    console.log('🎯 CodeCraft Cursor Extension is now active!');

    // Create HTTP server to receive messages from CodeCraft
    const server = http.createServer((req, res) => {
        // Health check endpoint
        if (req.method === 'GET' && req.url === '/health') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: true, 
                message: 'CodeCraft extension is running',
                timestamp: new Date().toISOString()
            }));
            return;
        }
        
        if (req.method === 'POST' && req.url === '/send-message') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    const message = data.message;
                    
                    console.log('🎯 CodeCraft: Received message:', message);
                    
                    // Send message directly to Cursor AI chat
                    sendToCursorChat(message);
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: 'Sent to Cursor AI chat' }));
                    
                } catch (error) {
                    console.error('❌ CodeCraft: Error parsing message:', error);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Invalid message format' }));
                }
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Not found' }));
        }
    });

    // Start server on port 3003 with better error handling
    const PORT = 3003;
    server.listen(PORT, '127.0.0.1', () => {
        console.log(`🎯 CodeCraft: Extension server running on port ${PORT}`);
        vscode.window.showInformationMessage('🎯 CodeCraft extension is active and ready!');
    });

    server.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️ Port ${PORT} is already in use, trying port ${PORT + 1}`);
            server.listen(PORT + 1, '127.0.0.1', () => {
                console.log(`🎯 CodeCraft: Extension server running on port ${PORT + 1}`);
                vscode.window.showInformationMessage('🎯 CodeCraft extension is active and ready!');
            });
        } else {
            console.error('❌ CodeCraft: Server error:', err);
            vscode.window.showErrorMessage('CodeCraft extension failed to start server');
        }
    });

    // Register commands
    const disposable1 = vscode.commands.registerCommand('codecraft.sendMessage', () => {
        vscode.window.showInformationMessage('CodeCraft extension is active and ready!');
    });

    const disposable2 = vscode.commands.registerCommand('codecraft.testIntegration', async () => {
        const testMessage = 'Test message from CodeCraft extension - this should appear in Cursor AI chat';
        console.log('🧪 CodeCraft: Testing integration with test message...');
        await sendToCursorChat(testMessage);
    });

    context.subscriptions.push(disposable1, disposable2);
}

async function sendToCursorChat(message: string) {
    try {
        console.log('🎯 CodeCraft: Sending message to Cursor AI using Stagewise method...');
        console.log('📝 Message:', message);
        
        // Use the exact same method as Stagewise
        await injectPromptDiagnosticWithCallback({
            prompt: message,
            callback: () => {
                console.log('🎯 CodeCraft: Executing composer.fixerrormessage command...');
                return vscode.commands.executeCommand('composer.fixerrormessage') as Promise<any>;
            }
        });
        
        console.log('✅ CodeCraft: Message sent to Cursor AI using Stagewise method');
        vscode.window.showInformationMessage('🎯 CodeCraft: Message sent to Cursor AI chat!');
        
    } catch (error) {
        console.error('❌ CodeCraft: Error sending to chat:', error);
        vscode.window.showErrorMessage(`Failed to send message to Cursor AI chat: ${error}`);
    }
}

/**
 * Injects a diagnostic with a prompt into the active editor and executes a callback.
 * This is the exact same method used by Stagewise.
 */
async function injectPromptDiagnosticWithCallback(params: {
    prompt: string;
    callback: () => Promise<any>;
}): Promise<void> {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        try {
            // Get all workspace files
            const files = await vscode.workspace.findFiles(
                '**/*',
                '**/node_modules/**',
            );

            if (files.length === 0) {
                vscode.window.showErrorMessage('No files found in workspace to open.');
                return;
            }

            // Open the first file found
            const document = await vscode.workspace.openTextDocument(files[0]);
            editor = await vscode.window.showTextDocument(document);
        } catch (_error) {
            vscode.window.showErrorMessage(
                'Failed to open existing file for prompt injection.',
            );
            return;
        }
        // Sleep 150ms to ensure editor is ready
        await new Promise((resolve) => setTimeout(resolve, 150));
    }

    const document = editor.document;

    // Create the Diagnostic Collection
    const fakeDiagCollection = vscode.languages.createDiagnosticCollection(
        'codecraft-prompt',
    );

    try {
        // Use the current selection or just the current line
        const selectionOrCurrentLine = editor.selection.isEmpty
            ? document.lineAt(editor.selection.active.line).range
            : editor.selection;

        // Create the fake diagnostic object
        const fakeDiagnostic = new vscode.Diagnostic(
            selectionOrCurrentLine,
            params.prompt,
            vscode.DiagnosticSeverity.Error,
        );
        fakeDiagnostic.source = 'codecraft-prompt';

        // Set the diagnostic
        fakeDiagCollection.set(document.uri, [fakeDiagnostic]);

        // Ensure cursor is within the diagnostic range
        editor.selection = new vscode.Selection(
            selectionOrCurrentLine.start,
            selectionOrCurrentLine.start,
        );

        await new Promise((resolve) => setTimeout(resolve, 10));

        // Execute the callback command (this triggers Cursor AI)
        console.log('🎯 CodeCraft: About to execute composer.fixerrormessage...');
        await params.callback();
        console.log('✅ CodeCraft: composer.fixerrormessage executed successfully!');
        vscode.window.showInformationMessage(`🎯 CodeCraft: Triggered Cursor AI for prompt.`);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to inject prompt: ${error}`);
    } finally {
        // Clear the diagnostic
        if (document) {
            fakeDiagCollection.delete(document.uri);
        } else {
            fakeDiagCollection.clear();
        }
        fakeDiagCollection.dispose();
    }
}

export function deactivate() {
    console.log('🎯 CodeCraft Cursor Extension deactivated');
}
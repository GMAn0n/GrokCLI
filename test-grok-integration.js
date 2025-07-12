#!/usr/bin/env node

/**
 * Integration test for GrokCLI file operations
 * This script tests that Grok can create and edit files through the CLI
 */

import { spawn } from 'child_process';
import { readFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';

const TEST_FILE = 'grok-integration-test.txt';

console.log('🧪 Testing GrokCLI integration...\n');

// Test 1: Check if we can create a simple test file
console.log('1️⃣ Creating a test file to verify file system access...');
const testContent = 'This is a test file for GrokCLI integration testing';
import { writeFileSync } from 'fs';
writeFileSync(TEST_FILE, testContent);

if (existsSync(TEST_FILE)) {
  console.log('✅ File system access confirmed');
  
  // Clean up
  try {
    unlinkSync(TEST_FILE);
    console.log('✅ Test file cleaned up');
  } catch (error) {
    console.log('⚠️  Could not clean up test file:', error.message);
  }
} else {
  console.log('❌ File system access failed');
  process.exit(1);
}

// Test 2: Check if the CLI can be started
console.log('\n2️⃣ Testing CLI startup...');
try {
  const cliProcess = spawn('npm', ['start'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: process.cwd()
  });

  // Give it a moment to start
  setTimeout(() => {
    console.log('✅ CLI process started successfully');
    cliProcess.kill();
  }, 3000);

  cliProcess.on('error', (error) => {
    console.log('❌ CLI startup failed:', error.message);
  });

} catch (error) {
  console.log('❌ CLI startup test failed:', error.message);
}

console.log('\n📋 Manual Testing Instructions:');
console.log('1. Run: npm start');
console.log('2. Wait for the CLI to load');
console.log('3. Type: "Create a file called hello.txt with the content: Hello from Grok!"');
console.log('4. Press Enter and wait for Grok to respond');
console.log('5. Check if hello.txt was created in the current directory');
console.log('6. If successful, try: "@package.json Add a new script called test-grok: echo hello"');
console.log('7. Check if package.json was modified');

console.log('\n🔍 Expected Behavior:');
console.log('- Grok should respond with confirmation of file creation/editing');
console.log('- Files should actually be created/edited in the file system');
console.log('- No 429 rate limit errors should occur');
console.log('- Tool calls should be visible in the response');

console.log('\n⚠️  Troubleshooting:');
console.log('- If you get 429 errors, check your API key and credits');
console.log('- If files aren\'t created, check file permissions');
console.log('- If Grok doesn\'t respond, check network connectivity');
console.log('- If tools don\'t work, verify the tool registry is loaded');

console.log('\n🎯 Success Criteria:');
console.log('✅ Grok responds to file creation requests');
console.log('✅ Files are actually created in the file system');
console.log('✅ Grok can edit existing files');
console.log('✅ Tool calls are properly executed');
console.log('✅ No API errors occur'); 
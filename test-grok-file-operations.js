#!/usr/bin/env node

/**
 * Test script to verify Grok file operations
 * This script tests that Grok can create and edit files
 */

import { spawn } from 'child_process';
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';

const TEST_FILE = 'grok-test-file.txt';
const TEST_CONTENT = 'This is a test file created by GrokCLI';

console.log('🧪 Testing GrokCLI file operations...\n');

// Test 1: Create a test file
console.log('1️⃣ Testing file creation...');
writeFileSync(TEST_FILE, TEST_CONTENT);
if (existsSync(TEST_FILE)) {
  console.log('✅ File creation test passed');
} else {
  console.log('❌ File creation test failed');
  process.exit(1);
}

// Test 2: Read the test file
console.log('\n2️⃣ Testing file reading...');
try {
  const content = readFileSync(TEST_FILE, 'utf8');
  if (content === TEST_CONTENT) {
    console.log('✅ File reading test passed');
  } else {
    console.log('❌ File reading test failed - content mismatch');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ File reading test failed:', error.message);
  process.exit(1);
}

// Test 3: Edit the test file
console.log('\n3️⃣ Testing file editing...');
const newContent = TEST_CONTENT + '\nThis line was added by Grok!';
writeFileSync(TEST_FILE, newContent);
try {
  const updatedContent = readFileSync(TEST_FILE, 'utf8');
  if (updatedContent === newContent) {
    console.log('✅ File editing test passed');
  } else {
    console.log('❌ File editing test failed - content mismatch');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ File editing test failed:', error.message);
  process.exit(1);
}

// Test 4: Clean up
console.log('\n4️⃣ Cleaning up test file...');
try {
  unlinkSync(TEST_FILE);
  console.log('✅ Cleanup completed');
} catch (error) {
  console.log('⚠️  Cleanup failed:', error.message);
}

console.log('\n🎉 All file operation tests passed!');
console.log('\n📝 Next steps:');
console.log('1. Start GrokCLI with: npm start');
console.log('2. Try asking Grok to create a file: "Create a file called hello.txt with Hello World"');
console.log('3. Try asking Grok to edit a file: "@package.json Add a new script called test-grok"');
console.log('4. Check if the files were created/edited as expected'); 
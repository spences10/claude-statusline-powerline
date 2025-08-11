#!/usr/bin/env node

import { spawn } from 'child_process';
import { ClaudeStatusInput } from './types';

// Mock JSON input (similar to what Claude Code sends)
const mockInput: ClaudeStatusInput = {
  session_id: "test-session",
  model: {
    display_name: "Claude Sonnet 4"
  },
  workspace: {
    current_dir: process.cwd()
  }
};

console.log('Testing statusline with mock input...\n');
console.log('Mock JSON:', JSON.stringify(mockInput, null, 2), '\n');

// Spawn the statusline script
const child = spawn('node', ['statusline.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  cwd: __dirname
});

// Send mock data to stdin
child.stdin.write(JSON.stringify(mockInput));
child.stdin.end();

// Capture output
let output = '';
child.stdout.on('data', (data) => {
  output += data.toString();
});

child.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});

child.on('close', (code) => {
  console.log('Statusline output:');
  console.log(output);
  
  if (code === 0) {
    console.log('✅ Test passed!');
  } else {
    console.log('❌ Test failed with exit code:', code);
  }
});
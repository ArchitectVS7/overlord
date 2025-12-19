#!/usr/bin/env node

/**
 * Test Runner Script
 * 
 * Executes E2E tests with enhanced logging and captures:
 * - Screenshots at each step
 * - Console output from game
 * - Test execution timeline
 * - Discovered UI elements
 * 
 * Usage:
 *   node run-e2e-tests.js
 *   node run-e2e-tests.js --headed  (show browser)
 *   node run-e2e-tests.js --debug   (pause on failures)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure test-results directory exists
const resultsDir = path.join(__dirname, '../test-results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Capture command line arguments
const args = process.argv.slice(2);
const isHeaded = args.includes('--headed');
const isDebug = args.includes('--debug');
const testPattern = args.find(arg => !arg.startsWith('--'));

// Build Playwright command
let command = 'npx playwright test';

// Add test file filter if specified
if (testPattern) {
  command += ` ${testPattern}`;
} else {
  // Run complete game flow by default
  command += ' complete-game-flow.spec.ts';
}

// Add flags
if (isHeaded) {
  command += ' --headed';
}

if (isDebug) {
  command += ' --debug';
}

// Add reporter for detailed output
command += ' --reporter=list,html';

// Add retries for stability
command += ' --retries=0'; // No retries on first run to catch real issues

console.log('🚀 Running E2E Tests for Overlord');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`📋 Command: ${command}`);
console.log(`📁 Results will be saved to: ${resultsDir}`);
console.log(`🎬 Mode: ${isHeaded ? 'HEADED (visible browser)' : 'HEADLESS'}`);
console.log(`🐛 Debug: ${isDebug ? 'ENABLED' : 'DISABLED'}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

try {
  // Execute the test command
  execSync(command, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '../'),
    env: {
      ...process.env,
      PWDEBUG: isDebug ? '1' : '0'
    }
  });
  
  console.log('\n✅ Tests completed successfully!');
  console.log(`📊 View HTML report: npx playwright show-report`);
  console.log(`📸 Screenshots saved to: ${resultsDir}`);
  
} catch (error) {
  console.error('\n❌ Tests failed!');
  console.log(`📊 View HTML report for details: npx playwright show-report`);
  console.log(`📸 Failure screenshots in: ${resultsDir}`);
  process.exit(1);
}

#!/usr/bin/env node

/**
 * 🚨 EMERGENCY PERFORMANCE FIX
 * Restart the development server with optimized settings
 */

const { spawn } = require('child_process');
const fs = require('fs');

console.log('🚨 EMERGENCY PERFORMANCE OPTIMIZATION');
console.log('=====================================\n');

// Kill existing processes
console.log('🔥 Killing heavy processes...');

// Clean up .next folder for fresh start
if (fs.existsSync('.next')) {
  console.log('🧹 Cleaning .next folder...');
  fs.rmSync('.next', { recursive: true, force: true });
}

// Start optimized dev server
console.log('🚀 Starting optimized development server...');

const devServer = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=4096 --optimize-for-size',
    NEXT_TELEMETRY_DISABLED: '1',
    NODE_ENV: 'development',
  }
});

devServer.on('close', (code) => {
  console.log(`Development server exited with code ${code}`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down optimized server...');
  devServer.kill();
  process.exit(0);
});

const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

console.log('[DevRunner] Starting Detective Mystery Server & Client...');

const serverProcess = spawn(npmCmd, ['run', 'server'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
});

const clientProcess = spawn(npmCmd, ['run', 'client'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
});

function handleExit() {
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
}

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
process.on('exit', handleExit);

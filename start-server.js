// Simple script to start the server using ts-node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const cors = require('cors');
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors({ origin: 'http://143.198.151.97' }));
// Kill any existing processes on port 3000
console.log('Checking for existing processes on port 3000...');
try {
  const lsof = spawn('lsof', ['-i', ':3000']);
  lsof.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (line.includes('LISTEN')) {
        const pid = line.split(/\s+/)[1];
        if (pid) {
          console.log(`Killing process ${pid}...`);
          spawn('kill', ['-9', pid]);
        }
      }
    }
  });
} catch (error) {
  console.error('Error checking for existing processes:', error);
}

// Start the server
console.log('Starting server...');
const server = spawn('node', ['--loader', 'tsx', 'src/index.ts'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: '3000',
    NODE_ENV: 'development'
  }
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
});

console.log('Server started on port 3000');

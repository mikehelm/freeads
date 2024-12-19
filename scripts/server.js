import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const PID_FILE = path.join(process.cwd(), '.server-pids.json');

function savePids(pids) {
  fs.writeFileSync(PID_FILE, JSON.stringify(pids, null, 2));
}

function loadPids() {
  try {
    return JSON.parse(fs.readFileSync(PID_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function clearPids() {
  try {
    fs.unlinkSync(PID_FILE);
  } catch {
    // Ignore if file doesn't exist
  }
}

function startProcess(command, args, name) {
  const proc = spawn(command, args, {
    stdio: 'inherit',
    shell: true
  });
  
  const pids = loadPids();
  pids[name] = proc.pid;
  savePids(pids);
  
  proc.on('exit', () => {
    const currentPids = loadPids();
    delete currentPids[name];
    if (Object.keys(currentPids).length === 0) {
      clearPids();
    } else {
      savePids(currentPids);
    }
  });
  
  return proc;
}

function stopProcesses() {
  const pids = loadPids();
  
  for (const [name, pid] of Object.entries(pids)) {
    console.log(`Stopping ${name} (PID: ${pid})...`);
    try {
      process.kill(pid, 'SIGTERM');
    } catch (err) {
      console.error(`Failed to stop ${name}:`, err.message);
    }
  }
  
  clearPids();
}

const command = process.argv[2];

if (command === 'start') {
  // Start both servers
  startProcess('npm', ['run', 'dev'], 'vite');
  startProcess('npm', ['run', 'server'], 'backend');
} else if (command === 'stop') {
  stopProcesses();
} else {
  console.log('Usage: node scripts/server.js [start|stop]');
  process.exit(1);
}

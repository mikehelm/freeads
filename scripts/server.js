const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

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
    try {
      process.kill(pid);
      console.log(`Stopped process ${name} (PID: ${pid})`);
    } catch (err) {
      console.log(`Failed to stop process ${name} (PID: ${pid}):`, err.message);
    }
  }
  clearPids();
}

const command = process.argv[2];

if (command === 'start') {
  // Start both frontend and Netlify Functions
  startProcess('npm', ['run', 'dev'], 'frontend');
  startProcess('netlify', ['dev', '--port', '4000'], 'functions');
} else if (command === 'stop') {
  stopProcesses();
} else {
  console.error('Invalid command. Use "start" or "stop".');
  process.exit(1);
}

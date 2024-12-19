import fs from 'fs';
import path from 'path';

export function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function getDataPath() {
  // In Netlify Functions, use /tmp for writable storage
  const baseDir = process.env.NETLIFY ? '/tmp' : process.cwd();
  const dataDir = path.join(baseDir, 'public', 'data');
  ensureDirectoryExists(dataDir);
  return dataDir;
}

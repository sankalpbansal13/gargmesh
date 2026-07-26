#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const bundled = path.join(__dirname, 'public', 'uploads-bundled');
const dest = path.join(__dirname, 'public', 'uploads');

function copyIfMissing(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const name of fs.readdirSync(srcDir)) {
    const from = path.join(srcDir, name);
    const to = path.join(destDir, name);
    const st = fs.statSync(from);
    if (st.isDirectory()) {
      copyIfMissing(from, to);
      continue;
    }
    // no-clobber: keep admin uploads / newer files
    if (!fs.existsSync(to)) {
      fs.copyFileSync(from, to);
    }
  }
}

try {
  copyIfMissing(bundled, dest);
} catch (err) {
  console.warn('[entrypoint] upload sync warning:', err.message);
}

const child = spawn(process.execPath, ['src/server.js'], {
  stdio: 'inherit',
  cwd: __dirname,
  env: process.env
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code == null ? 1 : code);
});

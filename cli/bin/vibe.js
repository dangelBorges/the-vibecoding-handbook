#!/usr/bin/env node
import('../dist/index.js').catch((err) => {
  console.error('Failed to start vibe CLI:', err.message);
  process.exit(1);
});

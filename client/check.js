const fs = require('fs');
let text = fs.readFileSync('src/lib/i18n.ts', 'utf8');

// Strip out string literals so braces inside them don't mess up our count
text = text.replace(/"[^"\\]*(?:\\.[^"\\]*)*"/g, '""');

const lines = text.split('\n');
let count = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (const c of line) {
    if (c === '{') count++;
    if (c === '}') count--;
  }
  
  // If count drops below zero or hits zero early (depending on top level), let's just log every negative state
  if (count < 0) {
    console.log(`Negative count at line ${i + 1}: ${line}`);
    break;
  }
}
console.log('Final count:', count);

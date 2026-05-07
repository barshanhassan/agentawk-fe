const fs = require('fs');
let buffer = fs.readFileSync('reconstructed_en.json');

// Aggressively remove null bytes if it looks like UTF-16
let content = '';
for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] !== 0) {
        content += String.fromCharCode(buffer[i]);
    }
}

// Remove BOM and leading { if double
content = content.replace(/^\ufeff/, '');
content = content.replace(/^\{+/, '{');

// Find the last } and trim everything after it
const lastBrace = content.lastIndexOf('}');
if (lastBrace !== -1) {
    content = content.substring(0, lastBrace + 1);
}

fs.writeFileSync('reconstructed_en.json', content, 'utf8');
console.log('Done');

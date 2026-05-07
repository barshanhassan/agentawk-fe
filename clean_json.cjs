const fs = require('fs');
const buffer = fs.readFileSync('reconstructed_en.json');
let content = '';

// Try to detect UTF-16
if (buffer[0] === 0xff && buffer[1] === 0xfe) {
    content = buffer.toString('utf16le');
} else if (buffer[0] === 0xfe && buffer[1] === 0xff) {
    content = buffer.toString('utf16be');
} else {
    // Check if it's "spaced" UTF-16 without BOM
    if (buffer[1] === 0x00 && buffer[3] === 0x00) {
        content = buffer.toString('utf16le');
    } else {
        content = buffer.toString('utf8');
    }
}

// Remove BOM
content = content.replace(/^\ufeff/, '');

// Clean up whitespace and duplicate braces
content = content.trim();
if (content.startsWith('{{')) {
    content = content.substring(1);
}

// Final check
try {
    const json = JSON.parse(content);
    fs.writeFileSync('reconstructed_en.json', JSON.stringify(json, null, 2), 'utf8');
    console.log('Success');
} catch (e) {
    console.error('JSON Parse Error:', e.message);
    // If it still fails, let's try to just get the lines
    const lines = content.split('\n').map(l => l.trim()).filter(l => l);
    fs.writeFileSync('reconstructed_en.json', content, 'utf8'); // save raw for inspection
}

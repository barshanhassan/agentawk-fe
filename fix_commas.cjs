const fs = require('fs');
let content = fs.readFileSync('reconstructed_en.json', 'utf8');

// Add missing commas between top-level objects
// Look for } followed by "
content = content.replace(/\}\s*"/g, '},\n  "');

// Ensure only one { at the start
content = content.trim();
if (!content.startsWith('{')) {
    content = '{\n' + content;
}
if (!content.endsWith('}')) {
    content = content + '\n}';
}

// Final check
try {
    const json = JSON.parse(content);
    fs.writeFileSync('reconstructed_en.json', JSON.stringify(json, null, 2), 'utf8');
    console.log('Success');
} catch (e) {
    console.error('Error at:', e.message);
}

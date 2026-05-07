const fs = require('fs');
let content = fs.readFileSync('reconstructed_en.json', 'utf8');

// Aggressively remove everything until the first quote
const firstQuote = content.indexOf('"');
if (firstQuote !== -1) {
    content = '{\n  ' + content.substring(firstQuote);
}

// Add missing commas between top-level objects
content = content.replace(/\}\s*"/g, '},\n  "');

// Ensure ends with }
const lastBrace = content.lastIndexOf('}');
if (lastBrace !== -1) {
    content = content.substring(0, lastBrace + 1);
} else {
    content += '\n}';
}

// Final check
try {
    const json = JSON.parse(content);
    fs.writeFileSync('reconstructed_en.json', JSON.stringify(json, null, 2), 'utf8');
    console.log('Success');
} catch (e) {
    console.error('Error at:', e.message);
    // Print first 100 chars to see what's wrong
    console.log('Start:', content.substring(0, 100));
}

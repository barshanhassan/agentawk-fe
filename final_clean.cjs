const fs = require('fs');
let content = fs.readFileSync('reconstructed_en.json', 'utf8');

// Find the first occurrence of '"' (first key)
const firstQuote = content.indexOf('"');
if (firstQuote !== -1) {
    content = '{\n  ' + content.substring(firstQuote);
}

// Final check
try {
    const json = JSON.parse(content);
    fs.writeFileSync('reconstructed_en.json', JSON.stringify(json, null, 2), 'utf8');
    console.log('Success');
} catch (e) {
    console.error('Error:', e.message);
}

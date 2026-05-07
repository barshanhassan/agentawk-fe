const fs = require('fs');
const diff = fs.readFileSync('diff_en_utf8.txt', 'utf8');
const lines = diff.split('\n');
let result = [];
let skipHeader = true;

for (let line of lines) {
    if (line.startsWith('@@')) {
        skipHeader = false;
        continue;
    }
    if (skipHeader) continue;
    if (line.startsWith('---') || line.startsWith('+++') || line.startsWith('diff')) continue;
    
    if (line.startsWith('+')) {
        result.push(line.substring(1));
    } else if (line.startsWith('-')) {
        // skip deleted lines
    } else {
        // unchanged lines
        result.push(line.substring(1));
    }
}

fs.writeFileSync('reconstructed_en.json', result.join('\n'));

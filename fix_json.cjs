const fs = require('fs');
const content = fs.readFileSync('reconstructed_en.json', 'utf8');
// Remove any leading non-JSON characters like BOM
const cleanContent = content.trim().replace(/^\ufeff/, '');
if (!cleanContent.startsWith('{')) {
    fs.writeFileSync('reconstructed_en.json', '{\n' + cleanContent, 'utf8');
} else {
    fs.writeFileSync('reconstructed_en.json', cleanContent, 'utf8');
}

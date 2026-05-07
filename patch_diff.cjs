const fs = require('fs');

function applyDiff(baseFile, diffFile, outFile) {
    const baseLines = fs.readFileSync(baseFile, 'utf8').split('\n');
    const diff = fs.readFileSync(diffFile, 'utf8');
    const chunks = diff.split('@@');
    
    let result = [...baseLines];
    
    // We need to apply chunks from BOTTOM to TOP to avoid shifting indices
    const parsedChunks = [];
    for (let i = 1; i < chunks.length; i++) {
        const lines = chunks[i].split('\n');
        const header = lines[0].match(/-(\d+),(\d+) \+(\d+),(\d+)/);
        if (!header) continue;
        
        const startLine = parseInt(header[3]); // Use + line numbers
        const oldLen = parseInt(header[2]);
        const newLen = parseInt(header[4]);
        
        const newContent = [];
        for (let j = 1; j < lines.length; j++) {
            const line = lines[j];
            if (line.startsWith('+')) {
                newContent.push(line.substring(1));
            } else if (line.startsWith('-')) {
                // skip
            } else if (line.startsWith(' ') || line === '') {
                newContent.push(line.substring(1));
            }
        }
        
        parsedChunks.push({ startLine, oldLen, newContent });
    }
    
    // Sort descending by startLine
    parsedChunks.sort((a, b) => b.startLine - a.startLine);
    
    for (const chunk of parsedChunks) {
        // Adjust for 1-based indexing
        const idx = chunk.startLine - 1;
        result.splice(idx, chunk.oldLen, ...chunk.newContent);
    }
    
    fs.writeFileSync(outFile, result.join('\n'), 'utf8');
}

applyDiff('client/src/i18n/locales/en.json', 'diff_en_utf8.txt', 'client/src/i18n/locales/en.json');
console.log('Success');

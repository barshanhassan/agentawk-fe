const fs = require('fs');
const path = require('path');

const dirs = [
    path.join(__dirname, 'src/components/workspace'),
    path.join(__dirname, 'src/components/sections')
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Regex to exactly match <Button ... className="..." or <button ... className="..."
    // and modify only the className string.
    // We'll replace the whole file using a replacer function that matches <Button ...> and <button ...> tags

    const buttonRegex = /<(?:Button|button)\b([^>]*)>/g;

    content = content.replace(buttonRegex, (match, attrs) => {
        // If it's an action button inside AlertDialog (like Delete), skip it if it has bg-red or similar explicitly.
        if (attrs.includes('bg-red') || attrs.includes('text-red')) {
            return match;
        }

        // Find the className attribute
        const classNameRegex = /className=(?:\{`([^`]+)`\}|"([^"]+)"|'([^']+)')/;
        const classMatch = attrs.match(classNameRegex);

        if (classMatch) {
            // It has a className!
            let classStr = classMatch[1] || classMatch[2] || classMatch[3];

            // Let's replace the hover states within this string
            classStr = classStr.replace(/\bhover:bg-slate-\d+\b/g, 'hover:bg-primary');
            classStr = classStr.replace(/\bhover:bg-gray-\d+\b/g, 'hover:bg-primary');
            classStr = classStr.replace(/\bhover:bg-blue-\d+\b/g, 'hover:bg-primary');
            classStr = classStr.replace(/\bhover:bg-green-\d+(?:\/\d+)?\b/g, 'hover:bg-primary');

            classStr = classStr.replace(/\bdark:hover:bg-slate-\d+(?:\/\d+)?\b/g, 'dark:hover:bg-primary');
            classStr = classStr.replace(/\bdark:hover:bg-gray-\d+(?:\/\d+)?\b/g, 'dark:hover:bg-primary');
            classStr = classStr.replace(/\bdark:hover:bg-blue-\d+(?:\/\d+)?\b/g, 'dark:hover:bg-primary');
            classStr = classStr.replace(/\bdark:hover:bg-green-\d+(?:\/\d+)?\b/g, 'dark:hover:bg-primary');

            classStr = classStr.replace(/\bhover:text-slate-\d+\b/g, 'hover:text-white');
            classStr = classStr.replace(/\bhover:text-gray-\d+\b/g, 'hover:text-white');
            classStr = classStr.replace(/\bhover:text-blue-\d+\b/g, 'hover:text-white');
            classStr = classStr.replace(/\bhover:text-green-\d+\b/g, 'hover:text-white');
            classStr = classStr.replace(/\bdark:hover:text-slate-\d+\b/g, 'dark:hover:text-white');
            classStr = classStr.replace(/\bdark:hover:text-gray-\d+\b/g, 'dark:hover:text-white');

            // Ensure it has text-white on hover to match the bg-primary if we added bg-primary
            if (classStr.includes('hover:bg-primary') && !classStr.includes('hover:text-white')) {
                classStr += ' hover:text-white';
            }

            // Add font-semibold and transition-all if not present
            if (!classStr.includes('font-semibold') && !classStr.includes('font-bold')) {
                classStr += ' font-semibold';
            }
            if (!classStr.includes('transition-all')) {
                classStr += ' transition-all';
            }

            // Special case: if it is a variant="ghost" or variant="outline", let's make sure it has the hover:bg-primary class
            if (attrs.includes('variant="ghost"') || attrs.includes('variant="outline"')) {
                if (!classStr.includes('hover:bg-primary')) {
                    classStr += ' hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white';
                }
            }

            // Reconstruct the attribute
            // If it was className={`...`}, we put back in same format 
            // Because we matched the inside of the quotes, we can just do a replace on the full attrs string
            const originalMatchedClassToken = classMatch[0];
            const newClassToken = `className="${classStr}"`;

            const newAttrs = attrs.replace(originalMatchedClassToken, newClassToken);
            return `<${match.startsWith('<Button') ? 'Button' : 'button'}${newAttrs}>`;
        } else {
            // It doesn't have a className, we can add one if it's outline or ghost
            if (attrs.includes('variant="ghost"') || attrs.includes('variant="outline"')) {
                return `<${match.startsWith('<Button') ? 'Button' : 'button'}${attrs} className="hover:bg-primary hover:text-white dark:hover:bg-primary font-semibold transition-all">`;
            }
            return match;
        }
    });

    // Also catch DropdownMenuItem buttons? User said "menu k undr setting hai us mn like media gallery hai us buttons..."
    // The user probably refers to actual buttons inside Settings panes.

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
    }
}

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            processFile(fullPath);
        }
    }
}

dirs.forEach(walkDir);
console.log('Done.');

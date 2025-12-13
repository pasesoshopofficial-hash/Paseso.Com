const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'js', 'legacy.js');
let content = fs.readFileSync(filePath, 'utf8');

// Find lines with corrupted camera emoji and remove them along with surrounding corrupt code
const lines = content.split('\n');
const cleanLines = [];
let i = 0;

while (i < lines.length) {
    const line = lines[i];
    
    // Check for corrupted emoji patterns (camera emoji becomes these bytes in wrongly encoded file)
    const hasCorruptedEmoji = line.includes('\u00f0\u0178"') || 
                              line.includes('\u00f0\u0178\u02dc') ||
                              line.includes("info');") && line.includes("toDateString()") && line.includes("today");
    
    if (hasCorruptedEmoji) {
        // This is a corrupted line - skip it and the closing brace
        i++;
        // Skip empty lines and the closing brace
        while (i < lines.length && (lines[i].trim() === '' || lines[i].trim() === '}')) {
            i++;
        }
        // Skip the toggleMessageEmoji function if it follows
        if (i < lines.length && lines[i].includes('function toggleMessageEmoji')) {
            // Skip until we find the closing brace
            while (i < lines.length && !lines[i].includes("'info');")) {
                i++;
            }
            i++; // Skip the line with info
            // Skip closing brace
            while (i < lines.length && (lines[i].trim() === '' || lines[i].trim() === '}')) {
                i++;
            }
        }
        // Skip duplicate NOTIFICATIONS PAGE comment
        if (i < lines.length && lines[i].includes('// ==================== NOTIFICATIONS PAGE')) {
            i++;
        }
        continue;
    }
    
    cleanLines.push(line);
    i++;
}

content = cleanLines.join('\n');

// Replace corrupted UTF-8 characters
const replacements = [
    [/\u00e2\u20ac\u2122/g, "'"],      // smart quote
    [/\u00e2\u20ac\u201c/g, "-"],      // en dash
    [/\u00e2\u20ac\u2019/g, "-"],      // another dash variant
    [/\u00c3\u00b0\u0178\u0161\u0161/g, "\ud83d\ude80"],  // rocket
];

replacements.forEach(([pattern, replacement]) => {
    content = content.replace(pattern, replacement);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('File processing complete!');
console.log('Lines before:', lines.length);
console.log('Lines after:', cleanLines.length);

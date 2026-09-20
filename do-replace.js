const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

// Replace the entire pageSignin function and the floating promptSmsKey function inside it
// We will use regex to find function pageSignin() { ... } down to the next function block.
const regex = /function promptSmsKey\(\)\s*\{[\s\S]*?\}[\s\S]*?function pageSignin\(\)\{[\s\S]*?\${footerHtml\(\)}`;\s*\}/;
const regex2 = /function pageSignin\(\)\{[\s\S]*?\${footerHtml\(\)}`;\s*\}/;

let replaced = false;
if (regex.test(code)) {
    code = code.replace(regex, `// Replaced dynamic login`);
    replaced = true;
} else if (regex2.test(code)) {
    code = code.replace(regex2, `// Replaced dynamic login`);
    replaced = true;
} else {
    // If we can't find it easily with regex, we fallback to a string split
    console.log("Regex failed. Using string split.");
}

fs.writeFileSync('temp.js', code, 'utf8');

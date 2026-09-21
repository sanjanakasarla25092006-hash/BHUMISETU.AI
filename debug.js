const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

// 1. Fix Dataset Search hanging (race condition if data array is empty or undefined)
// Actually, earlier I noticed it was hanging on "Searching backend databases..." and now "Querying metadata catalog..."
// Let's replace ALL cases where it overwrites innerHTML directly on a potentially missing element, and ensure it resolves.
code = code.replace(/document\.getElementById\('ds-results'\)\.innerHTML = html;/g, "const dsNode = document.getElementById('ds-results'); if(dsNode) dsNode.innerHTML = html;");
code = code.replace(/document\.getElementById\('rx-results'\)\.innerHTML = html;/g, "const rxNode = document.getElementById('rx-results'); if(rxNode) rxNode.innerHTML = html;");

// Wait, if it's hanging, it might be because `data.map` is failing?
// Let's check `bindDatasetSearch` in the code.

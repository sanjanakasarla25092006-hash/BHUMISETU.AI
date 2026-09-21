const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

// FIX 1: Make bindGis trigger for ALL gis sections!
const afterRenderRegex = /if\(parts\[2\]==='gis' \|\| parts\[0\]==='gis' \|\| parts\[2\]==='explore-map'\)\{ bindGis\(\); \}/;
const afterRenderFix = `if(parts[2] && parts[2].includes('gis') || parts[0] === 'gis' || parts[2] === 'explore-map' || parts[2] === 'satellite-data'){ bindGis(); }`;
code = code.replace(afterRenderRegex, afterRenderFix);

// FIX 2: Replace the toast in Methodology with a real document viewer modal
const exploreBtnRegex = /onclick="toast\('Demo: Opening method documentation\.\.\.'\)"/g;
const exploreBtnFix = `onclick="openResourceModal('Research Methodology Document', 'This document details the mathematical models and statistical approaches for this method. <br><br><div style=\\'background:#f1f5f9; padding:16px; border-radius:8px; font-family:monospace; margin-top:12px;\\'>[PDF DATA SIMULATED]</div>')"`;
code = code.replace(exploreBtnRegex, exploreBtnFix);

// FIX 3: Wait, what if Government Reports actually DOES get stuck?
// Let's add an error catch to the setTimeout in pageReportDetail and reportExplorerSection
const rpRegex = /document\.getElementById\('rp-results'\)\.innerHTML = html;/;
const rpFix = `const rpNode = document.getElementById('rp-results'); if(rpNode) rpNode.innerHTML = html;`;
code = code.replace(rpRegex, rpFix);

fs.writeFileSync('index-4.html', code, 'utf8');

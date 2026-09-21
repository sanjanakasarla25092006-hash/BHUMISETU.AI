const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

// 1. Fix Dataset Search
const dsRegex = /document\.getElementById\('ds-results'\)\.innerHTML = html;/g;
code = code.replace(dsRegex, "const dsNode = document.getElementById('ds-results'); if(dsNode) dsNode.innerHTML = html;");
const dsEmptyRegex = /document\.getElementById\('ds-results'\)\.innerHTML = emptyState/g;
code = code.replace(dsEmptyRegex, "const dsNode2 = document.getElementById('ds-results'); if(dsNode2) dsNode2.innerHTML = emptyState");

const rpRegex2 = /document\.getElementById\('rp-results'\)\.innerHTML = emptyState/g;
code = code.replace(rpRegex2, "const rpNode2 = document.getElementById('rp-results'); if(rpNode2) rpNode2.innerHTML = emptyState");

// 2. Fix SyntaxError in Methodology Section
const badOnclick = /onclick="openResourceModal\('Research Methodology Document', 'This document details the mathematical models and statistical approaches for this method\. <br><br><div style=\\'background:#f1f5f9; padding:16px; border-radius:8px; font-family:monospace; margin-top:12px;\\'>\[PDF DATA SIMULATED\]<\/div>'\)"/g;
const goodOnclick = `onclick="openResourceModal('Research Methodology Document', 'This document details the mathematical models and statistical approaches for this method. <br><br><div style=&quot;background:#f1f5f9; padding:16px; border-radius:8px; font-family:monospace; margin-top:12px;&quot;>[PDF DATA SIMULATED]</div>')"`;
code = code.replace(badOnclick, goodOnclick);

// 3. Improve GIS Map (focus only on India)
const gisRegex = /const map = L\.map\('gis-map'\)\.setView\(\[20\.5937, 78\.9629\], 5\);/;
const gisFix = `
  const indiaBounds = [[6.7535, 68.1623], [35.6745, 97.3955]]; // Southwest, Northeast
  const map = L.map('gis-map', {
      center: [22.5, 82.5],
      zoom: 5,
      minZoom: 4,
      maxBounds: indiaBounds,
      maxBoundsViscosity: 1.0
  });
`;
code = code.replace(gisRegex, gisFix);

fs.writeFileSync('index-4.html', code, 'utf8');

const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts.start = "node server.js";
pkg.main = "server.js";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8');

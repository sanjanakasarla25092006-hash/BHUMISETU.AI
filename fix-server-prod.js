const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

code = code.replace(/const PORT = 5000;/g, "const PORT = process.env.PORT || 5000;");

fs.writeFileSync('server.js', code, 'utf8');

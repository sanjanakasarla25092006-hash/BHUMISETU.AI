const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

code = code.replace(/const isKeySetup = !!localStorage\.getItem\('fast2sms_key'\);/g, 
  "const isKeySetup = true; // Hardcoded Fast2SMS key is active");

fs.writeFileSync('index-4.html', code, 'utf8');

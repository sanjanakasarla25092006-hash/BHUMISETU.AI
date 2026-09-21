const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Remove hardcoded Fast2SMS key
const badKeyRegex = /FAST2SMS_KEY:\s*'750Vy4SrCNKb8XWmYDTsLOpniQdoR12aEveFUPjfu6ctM3klxHDw7P3ghIqfCmTin9oLByElKMrpGW5S'/g;
code = code.replace(badKeyRegex, "FAST2SMS_KEY: '' // TODO: Set this to your Fast2SMS API key in production, or move this logic to the backend!");

fs.writeFileSync('index.html', code, 'utf8');

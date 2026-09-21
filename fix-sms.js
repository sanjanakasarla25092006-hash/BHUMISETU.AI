const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

const apiKey = "750Vy4SrCNKb8XWmYDTsLOpniQdoR12aEveFUPjfu6ctM3klxHDw7P3ghIqfCmTin9oLByElKMrpGW5S";

// Replace localStorage usage with the hardcoded key
code = code.replace(/const fast2smsKey = localStorage\.getItem\('fast2sms_key'\);/g, `const fast2smsKey = "${apiKey}";`);

fs.writeFileSync('index-4.html', code, 'utf8');

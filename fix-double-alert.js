const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

const regex = /alert\("Fast2SMS API blocked the SMS\.\\nReason: " \+ data\.message \+ "\\n\\nPlease use the simulated OTP to login\."\);\s*showOtpModal\(role, mobile, generatedOtp, false\);/g;
code = code.replace(regex, '');

fs.writeFileSync('index-4.html', code, 'utf8');

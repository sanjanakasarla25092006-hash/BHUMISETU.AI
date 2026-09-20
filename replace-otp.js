const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

// Ensure 6-digit OTP everywhere and update maxlength to 6
code = code.replace(/Math\.floor\(1000 \+ Math\.random\(\) \* 9000\)/g, 'Math.floor(100000 + Math.random() * 900000)');
code = code.replace(/4-digit/g, '6-digit');
code = code.replace(/maxlength="4"/g, 'maxlength="6"');

// Fix OTP modal input to expect 6-digit code
code = code.replace(/Enter 4-digit code/g, 'Enter 6-digit code');

fs.writeFileSync('index-4.html', code, 'utf8');

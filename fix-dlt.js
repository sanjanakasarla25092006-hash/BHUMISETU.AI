const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

// Replace the route=q with route=otp and use variables_values
code = code.replace(/fetch\(`https:\/\/www\.fast2sms\.com\/dev\/bulkV2\?authorization=\$\{fast2smsKey\}&route=q&message=\$\{msg\}&language=english&flash=0&numbers=\$\{cleanNumber\}`\)/g,
  "fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsKey}&route=otp&variables_values=${generatedOtp}&flash=0&numbers=${cleanNumber}`)");

fs.writeFileSync('index-4.html', code, 'utf8');

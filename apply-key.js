const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

// The replacement logic:
// We will look for: const fast2smsKey = localStorage.getItem('fast2sms_key');
// And replace it with: const fast2smsKey = localStorage.getItem('fast2sms_key') || '750Vy4SrCNKb8XWmYDTsLOpniQdoR12aEveFUPjfu6ctM3klxHDw7P3ghIqfCmTin9oLByElKMrpGW5S';

code = code.replace(/const fast2smsKey = localStorage\.getItem\('fast2sms_key'\);/g, 
  "const fast2smsKey = localStorage.getItem('fast2sms_key') || '750Vy4SrCNKb8XWmYDTsLOpniQdoR12aEveFUPjfu6ctM3klxHDw7P3ghIqfCmTin9oLByElKMrpGW5S';");

// We also need to encode the message in the fetch URL for Fast2SMS:
// It looks like: fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsKey}&route=q&message=Your BhuSetu login OTP is: ${generatedOtp}&language=english&flash=0&numbers=${cleanNumber}`)

code = code.replace(/fetch\(`https:\/\/www\.fast2sms\.com\/dev\/bulkV2\?authorization=\$\{fast2smsKey\}&route=q&message=Your BhuSetu login OTP is: \$\{generatedOtp\}&language=english&flash=0&numbers=\$\{cleanNumber\}`\)/g,
  "const msg = encodeURIComponent('Your BhuSetu login OTP is: ' + generatedOtp);\n    fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsKey}&route=q&message=${msg}&language=english&flash=0&numbers=${cleanNumber}`)");

// Update the modal to say REAL SMS SENT whenever the key exists (which it always will now)
// We should probably just hardcode it to show REAL SMS SENT.

fs.writeFileSync('index-4.html', code, 'utf8');

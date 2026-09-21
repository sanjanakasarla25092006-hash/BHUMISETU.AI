const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

const oldFetchRegex = /fetch\(`https:\/\/www\.fast2sms\.com\/dev\/bulkV2\?authorization=\$\{fast2smsKey\}&route=otp&variables_values=\$\{generatedOtp\}&flash=0&numbers=\$\{cleanNumber\}`\)/g;

const newFetch = `fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': fast2smsKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: \`route=otp&variables_values=\${generatedOtp}&flash=0&numbers=\${cleanNumber}\`
    })`;

code = code.replace(oldFetchRegex, newFetch);

fs.writeFileSync('index-4.html', code, 'utf8');

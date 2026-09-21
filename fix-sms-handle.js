const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

// Replace the response handling for Fast2SMS in both sendOtp locations
const oldHandle = /\.then\(res => res\.json\(\)\)\.then\(data => \{\s*if\(data\.return === false\) \{/g;
const newHandle = `.then(res => res.json()).then(data => {
        if(data.return === false || data.status_code) {
          const reason = data.message || "Unknown error";
          alert("Fast2SMS API blocked the SMS.\\nReason: " + reason + "\\n\\nPlease use the simulated OTP to login.");
          showOtpModal(role, mobile, generatedOtp, false);`;

code = code.replace(oldHandle, newHandle);

fs.writeFileSync('index-4.html', code, 'utf8');

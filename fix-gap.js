const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

// 1. Remove the floating function from the HTML string
const brokenCode = `      function promptSmsKey() {
  const key = prompt("To send real SMS to Indian mobiles, you need a Fast2SMS API key.\\n\\nSign up for free at fast2sms.com, get the API Key, and paste it below:");
  if (key) {
    localStorage.setItem('fast2sms_key', key);
    alert("API Key saved! Real SMS delivery is now active.");
  }
}`;

code = code.replace(brokenCode, '');

// 2. Add the function properly in the global JS scope right above pageSignin
const fixedFunction = `
window.promptSmsKey = function() {
  const key = prompt("To send real SMS to Indian mobiles, you need a Fast2SMS API key.\\n\\nSign up for free at fast2sms.com, get the API Key, and paste it below:");
  if (key) {
    localStorage.setItem('fast2sms_key', key);
    alert("API Key saved! Real SMS delivery is now active.");
  }
};
`;

code = code.replace('function pageSignin(){', fixedFunction + '\nfunction pageSignin(){');

fs.writeFileSync('index-4.html', code, 'utf8');

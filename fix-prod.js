const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

// 1. Centralize API Base URL so it works in dev and prod
const baseUrlScript = `<script>
  // Configuration for Production
  window.CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? 'http://localhost:5000' 
      : 'https://bhusetu-api.onrender.com', // Update this when backend is deployed
    FAST2SMS_KEY: '750Vy4SrCNKb8XWmYDTsLOpniQdoR12aEveFUPjfu6ctM3klxHDw7P3ghIqfCmTin9oLByElKMrpGW5S' // DO NOT EXPOSE IN REAL PROD, move to backend!
  };
</script>
<script>
window.state = {`;
code = code.replace(/<script>\s*window\.state = \{/, baseUrlScript);

// 2. Replace all hardcoded localhost:5000 with window.CONFIG.API_BASE_URL
code = code.replace(/http:\/\/localhost:5000/g, `" + window.CONFIG.API_BASE_URL + "`);
// Clean up any double quotes formatting issues
code = code.replace(/fetch\(`" \+ window\.CONFIG\.API_BASE_URL \+ "(\/api\/[a-z-]+)/g, "fetch(window.CONFIG.API_BASE_URL + `$1");
code = code.replace(/fetch\('" \+ window\.CONFIG\.API_BASE_URL \+ "(\/api\/[a-z-]+)/g, "fetch(window.CONFIG.API_BASE_URL + '$1");

// 3. Revert hardcoded API key inline to use the CONFIG
code = code.replace(/const fast2smsKey = "750Vy4SrCNKb8XWmYDTsLOpniQdoR12aEveFUPjfu6ctM3klxHDw7P3ghIqfCmTin9oLByElKMrpGW5S";/g, "const fast2smsKey = window.CONFIG.FAST2SMS_KEY;");

fs.writeFileSync('index-4.html', code, 'utf8');

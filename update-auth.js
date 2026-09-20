const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

// 1. Change the button row to have both "Sign In" and "Get OTP"
const oldRow = `<button class="btn" onclick="requestOtp()" style="background:#1e3a8a; color:#fff; border:1px solid rgba(255,255,255,0.4); border-radius:6px; padding:12px 24px; font-weight:600; cursor:pointer;">Get OTP</button>`;
const newRow = `<div style="display:flex; gap:8px;">
            <button class="btn" onclick="submitPasswordLogin()" style="background:#1e3a8a; color:#fff; border:1px solid transparent; border-radius:6px; padding:12px 24px; font-weight:600; cursor:pointer;">Sign In</button>
            <button class="btn" onclick="requestOtp()" style="background:transparent; color:#1e3a8a; border:1px solid #1e3a8a; border-radius:6px; padding:12px 16px; font-weight:600; cursor:pointer;" title="Forgot Password? Login with SMS OTP">Get OTP</button>
          </div>`;

code = code.replace(oldRow, newRow);

// 2. Add the submitPasswordLogin function globally
const pwdFunc = `
window.submitPasswordLogin = function() {
  let mobile = document.getElementById('loginMobile').value.trim();
  const pwd = document.getElementById('loginPassword').value;
  const captcha = document.getElementById('loginCaptcha').value.trim();
  const role = document.querySelector('input[name="loginRole"]:checked').value;

  if(!mobile) { toast('Please enter a mobile number'); return; }
  if(!pwd) { toast('Please enter your password. If you forgot it, use Get OTP.'); return; }
  if(captcha.toUpperCase() !== window.currentCaptcha) { toast('Invalid Captcha. Please try again.'); refreshCaptcha(); return; }

  if (['academic', 'industry', 'policymaker', 'government'].includes(role)) {
    const email = document.getElementById('loginEmail')?.value.trim();
    const inst = document.getElementById('loginInst')?.value.trim();
    const desig = document.getElementById('loginDesig')?.value.trim();
    
    if(!email || !inst || !desig) {
      toast('Please fill all required official details to login.');
      return;
    }
    
    if (role === 'policymaker' && !document.getElementById('loginEmpId')?.value.trim()) {
      toast('Please enter your Official Employee ID.');
      return;
    }
  }

  // Bypass OTP check since password is provided (Mock validation)
  verifyOtp(role, 'BYPASS_PASSWORD');
};
`;

code = code.replace('window.requestOtp = function', pwdFunc + '\nwindow.requestOtp = function');

// 3. Update verifyOtp to handle the bypass
const oldVerifyOtp = `window.verifyOtp = function(role, expectedOtp) {
  const code = document.getElementById('otpInput').value;
  if(code === expectedOtp) {`;

const newVerifyOtp = `window.verifyOtp = function(role, expectedOtp) {
  const code = expectedOtp === 'BYPASS_PASSWORD' ? 'BYPASS_PASSWORD' : document.getElementById('otpInput').value;
  if(code === expectedOtp) {`;

code = code.replace(oldVerifyOtp, newVerifyOtp);

fs.writeFileSync('index-4.html', code, 'utf8');

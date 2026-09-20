const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

const oldVerifyOtp = `window.verifyOtp = function(role, expectedOtp) {
  const code = document.getElementById('otpInput').value;
  if(code === expectedOtp) {
    closeModal();
    toast('Login successful!');
    go('/dash/' + role + '/overview');
  } else {
    toast('Incorrect OTP. Please try again.');
  }
};`;

const newVerifyOtp = `window.verifyOtp = function(role, expectedOtp) {
  const code = document.getElementById('otpInput').value;
  if(code === expectedOtp) {
    closeModal();
    
    // BACKEND VERIFICATION MOCK
    const requiresVerification = ['policymaker', 'government', 'academic', 'industry'].includes(role);
    
    if (requiresVerification) {
      // Mock saving to pending verification table
      openModal(\`
        <div style="text-align:center; padding:20px 0;">
          <div style="width:64px; height:64px; background:var(--saffron-100); color:var(--saffron-600); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:32px; margin:0 auto 16px;">\u23F3</div>
          <h2 style="margin-bottom:12px;">Verification Pending</h2>
          <p style="color:var(--ink-700); font-size:15px; margin-bottom:24px;">Your official details have been submitted to the administrative portal for institutional verification.</p>
          <div style="background:var(--ivory-100); padding:16px; border-radius:8px; border:1px solid var(--line); text-align:left; font-size:14px; margin-bottom:24px;">
            <div style="margin-bottom:8px;"><b>Status:</b> <span class="badge badge-warn">PENDING</span></div>
            <div>Restricted government resources and dashboards will become available after an administrator verifies your institutional identity.</div>
          </div>
          <button class="btn btn-navy" style="width:100%; padding:14px;" onclick="closeModal(); toast('Demo: Approved by admin mock!'); go('/dash/' + role + '/overview');">DEMO: Approve & Login</button>
        </div>
      \`);
    } else {
      toast('Login successful!');
      go('/dash/' + role + '/overview');
    }
  } else {
    toast('Incorrect OTP. Please try again.');
  }
};`;

code = code.replace(oldVerifyOtp, newVerifyOtp);
fs.writeFileSync('index-4.html', code, 'utf8');

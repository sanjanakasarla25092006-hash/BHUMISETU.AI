const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

const dynamicLogin = `
function promptSmsKey() {
  const key = prompt("To send real SMS to Indian mobiles, you need a Fast2SMS API key.\\n\\nSign up for free at fast2sms.com, get the API Key, and paste it below:");
  if (key) {
    localStorage.setItem('fast2sms_key', key);
    alert("API Key saved! Real SMS delivery is now active.");
  }
}

function renderDynamicLoginFields(roleId) {
  let html = '';
  
  const fMobile = \`
    <div style="margin-bottom:16px;">
      <label style="display:block; font-size:13px; color:rgba(255,255,255,0.8); margin-bottom:6px;">Mobile No. <span style="color:var(--saffron-500)">*</span></label>
      <input type="text" id="loginMobile" placeholder="Enter mobile number for OTP" style="width:100%; padding:12px 14px; background:transparent; border:1px solid rgba(255,255,255,0.4); border-radius:6px; color:#fff; font-size:15px; outline:none;">
    </div>\`;
    
  const fPassword = \`
    <div style="margin-bottom:20px;">
      <label style="display:block; font-size:13px; color:rgba(255,255,255,0.8); margin-bottom:6px;">Password</label>
      <input type="password" id="loginPassword" style="width:100%; padding:12px 14px; background:transparent; border:1px solid rgba(255,255,255,0.4); border-radius:6px; color:#fff; font-size:15px; outline:none;">
    </div>\`;

  const fEmail = (label) => \`
    <div style="margin-bottom:16px;">
      <label style="display:block; font-size:13px; color:rgba(255,255,255,0.8); margin-bottom:6px;">\${label} <span style="color:var(--saffron-500)">*</span></label>
      <input type="email" id="loginEmail" placeholder="e.g. name@domain.com" style="width:100%; padding:12px 14px; background:transparent; border:1px solid rgba(255,255,255,0.4); border-radius:6px; color:#fff; font-size:15px; outline:none;">
    </div>\`;

  const fInst = (label) => \`
    <div style="margin-bottom:16px;">
      <label style="display:block; font-size:13px; color:rgba(255,255,255,0.8); margin-bottom:6px;">\${label} <span style="color:var(--saffron-500)">*</span></label>
      <input type="text" id="loginInst" placeholder="Organization name" style="width:100%; padding:12px 14px; background:transparent; border:1px solid rgba(255,255,255,0.4); border-radius:6px; color:#fff; font-size:15px; outline:none;">
    </div>\`;

  const fDesig = \`
    <div style="margin-bottom:16px;">
      <label style="display:block; font-size:13px; color:rgba(255,255,255,0.8); margin-bottom:6px;">Designation / Role <span style="color:var(--saffron-500)">*</span></label>
      <input type="text" id="loginDesig" placeholder="e.g. Director, Head of Dept" style="width:100%; padding:12px 14px; background:transparent; border:1px solid rgba(255,255,255,0.4); border-radius:6px; color:#fff; font-size:15px; outline:none;">
    </div>\`;

  const fEmpId = \`
    <div style="margin-bottom:16px;">
      <label style="display:block; font-size:13px; color:rgba(255,255,255,0.8); margin-bottom:6px;">Official Employee ID <span style="color:var(--saffron-500)">*</span></label>
      <input type="text" id="loginEmpId" placeholder="Govt ID number" style="width:100%; padding:12px 14px; background:transparent; border:1px solid rgba(255,255,255,0.4); border-radius:6px; color:#fff; font-size:15px; outline:none;">
    </div>\`;

  if(roleId === 'researcher') {
    html = fMobile + fEmail('Email Address (Optional)') + fPassword;
  } else if(roleId === 'public') {
    html = fMobile + fPassword;
  } else if(roleId === 'academic') {
    html = fInst('Institution Name') + fEmail('Institutional Email') + fDesig + fMobile;
  } else if(roleId === 'industry') {
    html = fInst('Organization / Company') + fEmail('Work Email') + fDesig + fMobile;
  } else if(roleId === 'policymaker') {
    html = fInst('Ministry / Department') + fEmail('Official Government Email') + fDesig + fEmpId + fMobile;
  } else if(roleId === 'government') {
    html = fInst('Department / Ministry Name') + \`<div style="margin-bottom:16px;"><label style="display:block; font-size:13px; color:rgba(255,255,255,0.8); margin-bottom:6px;">Authorized Representative <span style="color:var(--saffron-500)">*</span></label><input type="text" id="loginRepName" placeholder="Full Name" style="width:100%; padding:12px 14px; background:transparent; border:1px solid rgba(255,255,255,0.4); border-radius:6px; color:#fff; font-size:15px; outline:none;"></div>\` + fEmail('Official Organization Email') + fDesig + fMobile;
  } else {
    html = fMobile + fPassword;
  }

  const container = document.getElementById('dynamicLoginFields');
  if(container) container.innerHTML = html;
}

function pageSignin(){
  const rolesHtml = ROLES.map((r, i) => \`
    <label style="display:inline-flex; align-items:center; cursor:pointer; font-size:13px; color:#fff;">
      <input type="radio" name="loginRole" value="\${r.id}" \${i === 0 ? 'checked' : ''} onchange="renderDynamicLoginFields(this.value)" style="margin-right:6px; accent-color:var(--saffron-500);">
      \${r.name}
    </label>
  \`).join('');

  setTimeout(() => {
     const checkedRole = document.querySelector('input[name="loginRole"]:checked');
     if(checkedRole) renderDynamicLoginFields(checkedRole.value);
  }, 50);

  return \`
  \${headerHtml('')}
  <section class="section signin-wrap" style="background: url('bg-land.jpg') no-repeat center center; background-size: cover; position: relative; min-height: calc(100vh - 68px); display: flex; align-items: center; justify-content: center; padding: 40px 20px;">
    <div style="position:relative; width:100%; max-width:650px; background:var(--navy-900); border-radius:12px; padding:48px 40px 40px; box-shadow:0 24px 60px rgba(0,0,0,0.4); margin-top:40px;">
      
      <div style="position:absolute; top:-45px; left:50%; transform:translateX(-50%); width:90px; height:90px; background:linear-gradient(135deg, #1b2a41, #2c4363); border-radius:50%; border:3px solid #fff; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.2);">
        <span style="font-family:sans-serif; font-size:42px; font-weight:bold; color:var(--cream-text); line-height:1;">&#3117;&#3138;</span>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:12px; margin-bottom:24px;">
        <h2 style="color:#fff; font-size:26px; font-weight:700; margin:0;">Login</h2>
        <a href="#/" style="color:#fff; font-size:15px; font-weight:600; text-decoration:none;">Home</a>
      </div>

      <div style="margin-bottom:20px;">
        <div style="font-size:13px; color:rgba(255,255,255,0.8); margin-bottom:12px;">Select for the Role</div>
        <div style="display:flex; flex-wrap:wrap; gap:16px;">
          \${rolesHtml}
        </div>
      </div>

      <!-- Dynamic Inputs Area -->
      <div id="dynamicLoginFields"></div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:28px;">
        <a href="javascript:void(0)" onclick="toast('Demo: Please enter your mobile number and use Get OTP to reset your password.')" style="color:#fff; font-size:14px; text-decoration:none;">Forgot Password</a>
        <div style="color:rgba(255,255,255,0.8); font-size:14px; text-align:right;">
          New user please <a href="javascript:void(0)" onclick="showSignUpModal()" style="color:#fff; font-weight:600; text-decoration:none;">Sign Up</a><br>
          <a href="javascript:void(0)" onclick="promptSmsKey()" style="color:var(--saffron-400); font-size:12px; text-decoration:underline; display:inline-block; margin-top:8px;">Enable Real SMS Delivery</a>
        </div>
      </div>

      <div style="margin-bottom:8px;">
        <div style="font-size:13px; color:rgba(255,255,255,0.8); margin-bottom:12px;">Please enter the code to sign in</div>
        <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
          <div style="background:#fcebc6; display:inline-block; padding:8px 16px; letter-spacing:4px; font-weight:bold; font-size:18px; color:#8c4c23; border:1px dashed #d1a179; font-family:monospace; position:relative; overflow:hidden;" id="captchaBox"></div>
          <button class="icon-btn" style="background:transparent; border:none; color:rgba(255,255,255,0.8); font-size:22px; cursor:pointer; padding:4px;" onclick="refreshCaptcha()" title="Refresh Captcha">&#x21bb;</button>
          <input type="text" id="loginCaptcha" placeholder="Enter captcha" style="flex:1; min-width:140px; padding:12px 14px; background:transparent; border:1px solid rgba(255,255,255,0.4); border-radius:6px; color:#fff; font-size:15px; outline:none;">
          <button class="btn" onclick="requestOtp()" style="background:#1e3a8a; color:#fff; border:1px solid rgba(255,255,255,0.4); border-radius:6px; padding:12px 24px; font-weight:600; cursor:pointer;">Get OTP</button>
        </div>
      </div>

    </div>
  </section>
  \${footerHtml()}`;
}
`;

const regex1 = /function pageSignin\(\)\s*\{[\s\S]*?\${footerHtml\(\)}`;\s*\}/;
const regex2 = /function promptSmsKey\(\)\s*\{[\s\S]*?\}\s*function pageSignin\(\)\s*\{[\s\S]*?\${footerHtml\(\)}`;\s*\}/;

if (regex2.test(code)) {
    code = code.replace(regex2, dynamicLogin);
} else if (regex1.test(code)) {
    code = code.replace(regex1, dynamicLogin);
}

// Ensure 6-digit OTP everywhere and update maxlength to 6
code = code.replace(/Math\.floor\(1000 \+ Math\.random\(\) \* 9000\)/g, 'Math.floor(100000 + Math.random() * 900000)');
code = code.replace(/4-digit/g, '6-digit');
code = code.replace(/maxlength="4"/g, 'maxlength="6"');

// Fix OTP modal input to expect 6-digit code
code = code.replace(/Enter 4-digit code/g, 'Enter 6-digit code');

fs.writeFileSync('index-4.html', code, 'utf8');

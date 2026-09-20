const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

// 1. Replace Inputs HTML
const oldInputs = `      <!-- Inputs -->
      <div style="margin-bottom:16px;">
        <label style="display:block; font-size:13px; color:rgba(255,255,255,0.8); margin-bottom:6px;">Mobile No.</label>
        <input type="text" id="loginMobile" placeholder="Enter mobile number" style="width:100%; padding:12px 14px; background:transparent; border:1px solid rgba(255,255,255,0.4); border-radius:6px; color:#fff; font-size:15px; outline:none;">
      </div>

      <div style="margin-bottom:20px;">
        <label style="display:block; font-size:13px; color:rgba(255,255,255,0.8); margin-bottom:6px;">Password</label>
        <input type="password" id="loginPassword" style="width:100%; padding:12px 14px; background:transparent; border:1px solid rgba(255,255,255,0.4); border-radius:6px; color:#fff; font-size:15px; outline:none;">
      </div>`;

code = code.replace(oldInputs, '      <!-- Dynamic Inputs -->\n      <div id="dynamicLoginFields"></div>');

// 2. Add renderDynamicLoginFields function globally
const renderFn = `
window.renderDynamicLoginFields = function(roleId) {
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
};
`;

code = code.replace('window.promptSmsKey = function', renderFn + '\nwindow.promptSmsKey = function');

// 3. Add onchange to radio buttons in pageSignin
const oldRadio = `      <input type="radio" name="loginRole" value="\${r.id}" \${i === 0 ? 'checked' : ''} style="margin-right:6px; accent-color:var(--saffron-500);">`;
const newRadio = `      <input type="radio" name="loginRole" value="\${r.id}" \${i === 0 ? 'checked' : ''} onchange="window.renderDynamicLoginFields(this.value)" style="margin-right:6px; accent-color:var(--saffron-500);">`;

code = code.replace(oldRadio, newRadio);

// 4. Force immediate render via setTimeout after DOM loads
const oldReturn = `  return \`
  \${headerHtml('')}`;
const newReturn = `  setTimeout(() => window.renderDynamicLoginFields(document.querySelector('input[name="loginRole"]:checked')?.value || 'researcher'), 50);
  return \`
  \${headerHtml('')}`;

code = code.replace(oldReturn, newReturn);

fs.writeFileSync('index-4.html', code, 'utf8');

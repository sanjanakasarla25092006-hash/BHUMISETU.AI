const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

const oldCheck = "if(!mobile) { toast('Please enter a mobile number'); return; }";
const newCheck = `
  // Dynamic validation based on role
  if(!mobile) { toast('Please enter a mobile number'); return; }
  
  if (['academic', 'industry', 'policymaker', 'government'].includes(role)) {
    const email = document.getElementById('loginEmail')?.value.trim();
    const inst = document.getElementById('loginInst')?.value.trim();
    const desig = document.getElementById('loginDesig')?.value.trim();
    
    if(!email || !inst || !desig) {
      toast('Please fill all required official details before requesting OTP.');
      return;
    }
    
    if (role === 'policymaker' && !document.getElementById('loginEmpId')?.value.trim()) {
      toast('Please enter your Official Employee ID.');
      return;
    }
  }
`;

code = code.replace(oldCheck, newCheck);

// Also do it in submitSignUp
const oldSignUpCheck = "if(!mobile) { toast('Please enter a mobile number'); return; }";
const newSignUpCheck = "if(!mobile) { toast('Please enter a mobile number'); return; }\n  if (!document.getElementById('signupRole').value) return;";

code = code.replace(oldSignUpCheck, newSignUpCheck);

fs.writeFileSync('index-4.html', code, 'utf8');

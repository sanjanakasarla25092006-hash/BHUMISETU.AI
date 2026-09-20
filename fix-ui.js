const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

// 1. Change Sign In Box Background from navy to white
code = code.replace(/background:var\(--navy-900\); border-radius:12px; padding:48px 40px 40px; box-shadow:0 24px 60px rgba\(0,0,0,0.4\); margin-top:40px;/g,
  "background:#fff; border-radius:12px; padding:48px 40px 40px; box-shadow:0 24px 60px rgba(0,0,0,0.15); margin-top:40px; border:1px solid var(--line);");

// 2. Change text colors in pageSignin and dynamic fields
// Top row Login text
code = code.replace(/<h2 style="color:#fff; font-size:26px; font-weight:700; margin:0;">Login<\/h2>/g,
  '<h2 style="color:var(--ink-900); font-size:24px; font-weight:700; margin:0;">Login</h2>');

code = code.replace(/<a href="#\/" style="color:#fff; font-size:15px; font-weight:600; text-decoration:none;">Home<\/a>/g,
  '<a href="#/" style="color:var(--navy-600); font-size:14px; font-weight:600; text-decoration:none;">Home</a>');

// Border bottom
code = code.replace(/border-bottom:1px solid rgba\(255,255,255,0.2\);/g, 'border-bottom:1px solid var(--line);');

// Roles text
code = code.replace(/<div style="font-size:13px; color:rgba\(255,255,255,0.8\); margin-bottom:12px;">Select for the Role<\/div>/g,
  '<div style="font-size:13px; font-weight:600; color:var(--ink-700); margin-bottom:12px;">Select your Role</div>');

code = code.replace(/<label style="display:inline-flex; align-items:center; cursor:pointer; font-size:13px; color:#fff;">/g,
  '<label style="display:inline-flex; align-items:center; cursor:pointer; font-size:13px; color:var(--ink-800); font-weight:500;">');

// Links at bottom
code = code.replace(/<a href="javascript:void\(0\)" onclick="toast\('Demo: Please enter your mobile number and use Get OTP to reset your password.'\)" style="color:#fff; font-size:14px; text-decoration:none;">Forgot Password<\/a>/g,
  `<a href="javascript:void(0)" onclick="toast('Demo: Please enter your mobile number and use Get OTP to reset your password.')" style="color:var(--navy-600); font-size:13px; text-decoration:none; font-weight:500;">Forgot Password</a>`);

code = code.replace(/<div style="color:rgba\(255,255,255,0.8\); font-size:14px; text-align:right;">/g,
  '<div style="color:var(--ink-700); font-size:13px; text-align:right;">');

code = code.replace(/New user please <a href="javascript:void\(0\)" onclick="showSignUpModal\(\)" style="color:#fff; font-weight:600; text-decoration:none;">Sign Up<\/a>/g,
  `New user please <a href="javascript:void(0)" onclick="showSignUpModal()" style="color:var(--navy-700); font-weight:700; text-decoration:none;">Sign Up</a>`);

code = code.replace(/<a href="javascript:void\(0\)" onclick="promptSmsKey\(\)" style="color:var\(--saffron-400\); font-size:12px; text-decoration:underline; display:inline-block; margin-top:8px;">Enable Real SMS Delivery<\/a>/g,
  `<a href="javascript:void(0)" onclick="promptSmsKey()" style="color:var(--saffron-600); font-size:12px; font-weight:600; text-decoration:underline; display:inline-block; margin-top:8px;">Enable Real SMS Delivery</a>`);

// Captcha row
code = code.replace(/<div style="font-size:13px; color:rgba\(255,255,255,0.8\); margin-bottom:12px;">Please enter the code to sign in<\/div>/g,
  '<div style="font-size:13px; font-weight:600; color:var(--ink-700); margin-bottom:12px;">Please enter the code to sign in</div>');

code = code.replace(/<button class="icon-btn" style="background:transparent; border:none; color:rgba\(255,255,255,0.8\); font-size:22px; cursor:pointer; padding:4px;" onclick="refreshCaptcha\(\)" title="Refresh Captcha">&#x21bb;<\/button>/g,
  `<button class="icon-btn" style="background:transparent; border:none; color:var(--ink-500); font-size:22px; cursor:pointer; padding:4px;" onclick="refreshCaptcha()" title="Refresh Captcha">&#x21bb;</button>`);

code = code.replace(/<input type="text" id="loginCaptcha" placeholder="Enter captcha" style="flex:1; min-width:140px; padding:12px 14px; background:transparent; border:1px solid rgba\(255,255,255,0.4\); border-radius:6px; color:#fff; font-size:15px; outline:none;">/g,
  `<input type="text" id="loginCaptcha" placeholder="Enter captcha" style="flex:1; min-width:140px; padding:10px 14px; background:#fff; border:1px solid var(--line); border-radius:6px; color:var(--ink-900); font-size:14px; outline:none; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">`);

// Dynamic inputs
code = code.replace(/<label style="display:block; font-size:13px; color:rgba\(255,255,255,0.8\); margin-bottom:6px;">/g,
  '<label style="display:block; font-size:13px; font-weight:600; color:var(--ink-800); margin-bottom:6px;">');

code = code.replace(/style="width:100%; padding:12px 14px; background:transparent; border:1px solid rgba\(255,255,255,0.4\); border-radius:6px; color:#fff; font-size:15px; outline:none;"/g,
  `style="width:100%; padding:10px 14px; background:#fff; border:1px solid var(--line); border-radius:6px; color:var(--ink-900); font-size:14px; outline:none; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);"`);

// OTP length box reducing text size if they meant the modal
code = code.replace(/font-size:18px; text-align:center; letter-spacing:8px;/g,
  'font-size:16px; text-align:center; letter-spacing:6px;');

fs.writeFileSync('index-4.html', code, 'utf8');

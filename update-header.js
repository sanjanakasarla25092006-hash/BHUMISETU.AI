const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

const replacement = `function headerHtml(activeTop){
  const roleArea = state.role
    ? \`<a href="#/dash/\${state.role}/overview" style="background:var(--navy-900); color:#fff; padding:6px 14px; border-radius:20px; font-weight:600; font-size:13px; text-decoration:none; display:flex; align-items:center; gap:6px;"><span class="dot" style="background:var(--saffron-500);"></span>\${escapeHtml(state.roleLabel)}</a>
       <button data-action="signout" style="background:transparent; border:none; color:var(--ink-700); font-weight:500; font-size:13px; cursor:pointer; padding:6px 10px; transition:0.2s;">Sign out</button>\`
    : \`<a href="#/signin" style="background:var(--navy-700); color:#fff; padding:8px 18px; border-radius:20px; font-weight:600; font-size:13.5px; text-decoration:none; display:flex; align-items:center;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> Sign In</a>\`;

  return \`
  <header style="width:100%; position:sticky; top:0; z-index:50; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
    
    <!-- TOP LAYER (White Background) -->
    <div style="background:#fff; color:var(--ink-900); padding:12px 0;">
      <div class="container" style="display:flex; justify-content:space-between; align-items:center; min-height:50px;">
        
        <!-- Left: Logos & Title -->
        <div style="display:flex; align-items:center; gap:16px;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem of India" style="height:48px;">
          
          <a href="#/" style="display:flex; align-items:center; gap:12px; text-decoration:none;">
            <div style="width:40px; height:40px; background:var(--navy-600); color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:sans-serif; font-size:24px; font-weight:bold; padding-bottom:2px;">&#3117;&#3138;</div>
            <div style="display:flex; flex-direction:column;">
              <div style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size:22px; font-weight:400; color:var(--ink-900); line-height:1.2;">BhuSetu</div>
              <div style="font-size:11px; font-weight:400; color:var(--ink-500);">National Land Governance Platform</div>
            </div>
          </a>
        </div>

        <!-- Right: Utility Actions & Sign In -->
        <div style="display:flex; align-items:center; gap:16px;">
          <button data-action="toggle-theme" style="background:transparent; border:1px solid var(--line); color:var(--ink-700); padding:4px 10px; border-radius:4px; font-size:12px; cursor:pointer;">Theme</button>
          <button data-action="lang" style="background:transparent; border:none; color:var(--ink-700); font-size:13px; cursor:pointer;">Language</button>
          <a href="javascript:void(0)" onclick="helpModal()" style="color:var(--ink-700); font-size:13px; text-decoration:none;">Help</a>
          \${roleArea}
        </div>

      </div>
    </div>

    <!-- SECONDARY NAV (Dark Navy) -->
    <div style="background:var(--navy-800); padding:0; border-top:1px solid rgba(255,255,255,0.05);">
      <div class="container" style="display:flex; align-items:center; justify-content:space-between; padding-top:10px; padding-bottom:10px;">
        
        <nav style="display:flex; gap:28px; align-items:center;">
          <a href="#/" style="font-size:14px; font-weight:600; color:#fff; text-decoration:none;">Home</a>
          <a href="#/about" style="font-size:14px; font-weight:500; color:rgba(255,255,255,0.85); text-decoration:none;">About Us</a>
          <a href="#/manuals" style="font-size:14px; font-weight:500; color:rgba(255,255,255,0.85); text-decoration:none;">User Manuals</a>
          <a href="#/faq" style="font-size:14px; font-weight:500; color:rgba(255,255,255,0.85); text-decoration:none;">FAQ</a>
          <a href="#/dash/public/overview" style="font-size:14px; font-weight:500; color:rgba(255,255,255,0.85); text-decoration:none;">Resources</a>
        </nav>

        <div style="display:flex; align-items:center;">
          <div style="display:flex; align-items:center; background:rgba(255,255,255,0.1); border-radius:20px; border:1px solid rgba(255,255,255,0.2); overflow:hidden; width:220px; padding:4px 12px;">
            <input type="text" placeholder="Search..." style="flex:1; background:transparent; border:none; outline:none; font-size:13px; color:#fff;">
          </div>
        </div>

      </div>
    </div>

    <!-- DISCLAIMER BAR (Yellow) -->
    <div style="background:var(--saffron-100); border-bottom:1px solid var(--saffron-200); padding:6px 0;">
      <div class="container" style="text-align:center; font-size:11.5px; color:var(--saffron-700); font-weight:500;">
        <span style="margin-right:4px;">\u26A0\uFE0F</span> Disclaimer: Land records, maps and analytical information provided through this platform are subject to official verification.
      </div>
    </div>

  </header>
  \`;
}`;

const regex = /function headerHtml\(activeTop\)[\s\S]*?<\/header>\s*`;\s*\}/;

if(regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('index-4.html', code, 'utf8');
    console.log('Successfully replaced headerHtml');
} else {
    console.log('Could not find headerHtml pattern');
}

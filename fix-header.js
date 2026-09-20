const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

const oldHeaderRegex = /function headerHtml\(activeTop\)\{[\s\S]*?return \`[\s\S]*?<!-- THIN SECONDARY NAV.*?<\/nav>\s*<\/div>\s*<\/div>\s*<\/header>\s*`;\s*\}/;

const newHeader = `function headerHtml(activeTop){
  const roleArea = state.role
    ? \`<a href="#/dash/\${state.role}/overview" style="background:var(--navy-900); color:#fff; padding:8px 16px; border-radius:4px; font-weight:600; font-size:14px; text-decoration:none; display:flex; align-items:center; gap:8px; border:1px solid rgba(255,255,255,0.2); box-shadow:0 2px 4px rgba(0,0,0,0.2);"><span class="dot" style="background:var(--saffron-500);"></span>\${escapeHtml(state.roleLabel)}</a>
       <button data-action="signout" style="background:transparent; border:none; color:var(--navy-900); font-weight:700; font-size:14px; cursor:pointer; padding:8px 14px; border-radius:4px; border:2px solid var(--navy-900); transition:0.2s;">Sign out</button>\`
    : \`<a href="#/signin" style="background:var(--navy-900); color:#fff; padding:10px 24px; border-radius:4px; font-weight:700; font-size:14.5px; text-decoration:none; display:flex; align-items:center; box-shadow:0 4px 10px rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.1);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> SIGN IN</a>\`;

  return \`
  <header style="width:100%; position:sticky; top:0; z-index:50; box-shadow:0 4px 24px rgba(0,0,0,0.12);">
    <!-- TOP LAYER (Brand Block) -->
    <div style="background: linear-gradient(to right, #0f172a, #1e293b); color: #fff; padding: 20px 0; border-bottom: 3px solid var(--saffron-500);">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center; min-height: 85px;">
        
        <!-- Left: Emblem -->
        <div style="flex: 1; display: flex; align-items: center;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Government of India Emblem" style="height: 85px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));">
        </div>

        <!-- Center: Branding with Government Serif Font -->
        <a href="#/" style="display: flex; flex-direction: column; align-items: center; text-decoration: none; color: #fff; flex: 2; text-align: center;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 18px; margin-bottom: 8px;">
            <div style="width: 56px; height: 56px; background: linear-gradient(135deg, var(--saffron-400), var(--saffron-600)); color: #0f172a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: sans-serif; font-size: 34px; font-weight: 800; line-height: 1; padding-bottom: 3px; box-shadow: 0 4px 12px rgba(0,0,0,0.4); border:2px solid #fff;">&#3117;&#3138;</div>
            <div style="font-family: 'Cinzel', 'Times New Roman', Times, serif; font-weight: 700; font-size: 46px; letter-spacing: 2px; text-shadow: 0 4px 12px rgba(0,0,0,0.5);">BHUSETU</div>
          </div>
          <div style="font-family: 'Arial', sans-serif; font-size: 14.5px; font-weight: 700; letter-spacing: 4px; color: var(--saffron-400); text-transform: uppercase;">National Land Governance Platform</div>
        </a>

        <!-- Right: Utility Actions -->
        <div style="flex: 1; display: flex; justify-content: flex-end; align-items: center; gap: 12px;">
          <button data-action="toggle-theme" title="Toggle Theme" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 8px 14px; border-radius: 4px; font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.2s;">Theme</button>
          <button data-action="lang" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 8px 14px; border-radius: 4px; font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.2s;">A/\u0905 Language</button>
        </div>

      </div>
    </div>

    <!-- SECONDARY NAV (Saffron) -->
    <div style="background: var(--saffron-500); padding: 0;">
      <div class="container" style="display: flex; align-items: center; justify-content: space-between; padding-top: 12px; padding-bottom: 12px;">
        
        <nav style="display: flex; gap: 36px; align-items: center;">
          <a href="#/" style="font-size: 14.5px; font-weight: 800; color: #0f172a; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px;">Home</a>
          <a href="#/about" style="font-size: 14.5px; font-weight: 800; color: #0f172a; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px;">About Us</a>
          <a href="#/manuals" style="font-size: 14.5px; font-weight: 800; color: #0f172a; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px;">User Manuals</a>
          <a href="#/faq" style="font-size: 14.5px; font-weight: 800; color: #0f172a; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px;">FAQ</a>
          <a href="#/dash/public/overview" style="font-size: 14.5px; font-weight: 800; color: #0f172a; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px;">Resources</a>
        </nav>

        <div style="display:flex; align-items:center; gap:20px;">
          <!-- Govt Style Attractive Search Box -->
          <div style="display:flex; align-items:center; background:#fff; border-radius:4px; border:2px solid #0f172a; overflow:hidden; width:300px; box-shadow:0 2px 6px rgba(0,0,0,0.15);">
            <div style="padding:0 12px; color:#0f172a;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div>
            <input type="text" placeholder="Search official records..." style="border:none; padding:10px 0; outline:none; font-size:14px; font-weight:500; width:100%; color:#0f172a; background:transparent;">
            <button style="background:#0f172a; color:#fff; border:none; padding:0 16px; height:100%; font-weight:700; font-size:13px; cursor:pointer; text-transform:uppercase;">Search</button>
          </div>
          
          <!-- Sign In / Dashboard Area -->
          \${roleArea}
        </div>

      </div>
    </div>
  </header>
  \`;
}`;

if(code.match(oldHeaderRegex)) {
  code = code.replace(oldHeaderRegex, newHeader);
  fs.writeFileSync('index-4.html', code, 'utf8');
  console.log("Header replaced successfully.");
} else {
  console.log("Regex did not match!");
}

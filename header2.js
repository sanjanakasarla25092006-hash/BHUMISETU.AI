const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

const startStr = "function headerHtml(activeTop){";
const endStr = "</header>\n  `;\n}";

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr, startIndex) + endStr.length;

if (startIndex !== -1 && endIndex !== -1) {
  const newHeader = `function headerHtml(activeTop){
  const roleArea = state.role
    ? \`<a href="#/dash/\${state.role}/overview" style="background:#000; color:var(--saffron-500); padding:6px 14px; border-radius:4px; font-weight:600; font-size:13px; text-decoration:none; display:flex; align-items:center; gap:6px;"><span class="dot" style="background:var(--saffron-500);"></span>\${escapeHtml(state.roleLabel)}</a>
       <button data-action="signout" style="background:transparent; border:none; color:#000; font-weight:600; font-size:13px; cursor:pointer; padding:6px 12px; border-radius:4px; border:1px solid #000;">Sign out</button>\`
    : \`<a href="#/signin" style="background:#000; color:var(--saffron-500); padding:8px 20px; border-radius:6px; font-weight:600; font-size:14px; text-decoration:none; display:flex; align-items:center;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> Sign In</a>\`;

  return \`
  <header style="width:100%; position:sticky; top:0; z-index:50; box-shadow:0 4px 20px rgba(0,0,0,0.15);">
    <!-- MASSIVE TOP LAYER (Brand Block) -->
    <div style="background: linear-gradient(135deg, #101828, #1b2a41); color: #fff; padding: 24px 0; border-bottom: 2px solid var(--saffron-500);">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center; position: relative; min-height: 85px;">
        
        <!-- Left: Emblem -->
        <div style="flex: 1; display: flex; align-items: center;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Government of India Emblem" style="height: 80px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
        </div>

        <!-- Center: Massive Branding -->
        <a href="#/" style="display: flex; flex-direction: column; align-items: center; text-decoration: none; color: #fff; flex: 2; text-align: center;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 6px;">
            <div style="width: 52px; height: 52px; background: linear-gradient(135deg, var(--saffron-500), var(--saffron-600)); color: #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: sans-serif; font-size: 32px; font-weight: bold; line-height: 1; padding-bottom: 2px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">&#3117;&#3138;</div>
            <div style="font-family: var(--font-display); font-weight: 800; font-size: 42px; letter-spacing: 1px; text-shadow: 0 2px 8px rgba(0,0,0,0.4);">BHUSETU</div>
            <div style="font-family: sans-serif; font-weight: bold; font-size: 32px; letter-spacing: 0.5px; opacity: 0.9; text-shadow: 0 2px 8px rgba(0,0,0,0.4);">|</div>
            <div style="font-family: sans-serif; font-weight: bold; font-size: 32px; letter-spacing: 0.5px; opacity: 0.9; text-shadow: 0 2px 8px rgba(0,0,0,0.4);">&#3117;&#3138;&#3128;&#3143;&#3114;&#3137;</div>
          </div>
          <div style="font-size: 15px; font-weight: 600; letter-spacing: 3px; color: var(--saffron-400); text-transform: uppercase;">National Land Governance Platform</div>
        </a>

        <!-- Right: Utility Actions -->
        <div style="flex: 1; display: flex; justify-content: flex-end; align-items: center; gap: 16px;">
          <button data-action="toggle-theme" title="Toggle Theme" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 6px 12px; border-radius: 4px; font-size: 13px; font-weight: 600; cursor: pointer;">Theme</button>
          <button data-action="lang" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 6px 12px; border-radius: 4px; font-size: 13px; font-weight: 600; cursor: pointer;">A/? Language</button>
        </div>

      </div>
    </div>

    <!-- THIN SECONDARY NAV (Saffron/Gold) -->
    <div style="background: var(--saffron-500); color: #000; padding: 0;">
      <div class="container" style="display: flex; align-items: center; justify-content: space-between; padding-top: 10px; padding-bottom: 10px;">
        <nav style="display: flex; gap: 32px; align-items: center;">
          <a href="#/" style="font-size: 15px; font-weight: 700; color: #000; text-decoration: none; text-transform: uppercase;">Home</a>
          <a href="#/about" style="font-size: 15px; font-weight: 700; color: #000; text-decoration: none; text-transform: uppercase;">About Us</a>
          <a href="#/manuals" style="font-size: 15px; font-weight: 700; color: #000; text-decoration: none; text-transform: uppercase;">User Manuals</a>
          <a href="#/faq" style="font-size: 15px; font-weight: 700; color: #000; text-decoration: none; text-transform: uppercase;">FAQ</a>
          <a href="#/data-hub" style="font-size: 15px; font-weight: 700; color: #000; text-decoration: none; text-transform: uppercase;">Resources</a>
        </nav>
        <div style="display: flex; align-items: center; gap: 20px;">
          <input type="text" placeholder="Search records..." style="background: #fff; border: 1px solid rgba(0,0,0,0.2); border-radius: 20px; padding: 8px 16px; color: #000; font-size: 14px; width: 240px; outline: none; font-weight:500;">
          \${roleArea}
        </div>
      </div>
    </div>

    <!-- DISCLAIMER BAR -->
    <div style="background: #fbf3e6; color: var(--ink-900); padding: 8px 0; border-bottom: 1px solid #ebdnc2; font-size: 13px; font-weight: 500;">
      <div class="container" style="display: flex; align-items: center; justify-content: center;">
        <span style="color: var(--saffron-600); margin-right: 8px; font-weight: bold; font-size: 15px;">\u26A0</span> 
        <span style="font-weight: 600; margin-right: 4px;">Disclaimer:</span> Land records, maps and analytical information provided through this platform are subject to official verification.
      </div>
    </div>
  </header>
  \`;
}`;
  code = code.substring(0, startIndex) + newHeader + code.substring(endIndex);
  fs.writeFileSync('index-4.html', code, 'utf8');
  console.log("Replaced using string index.");
} else {
  console.log("Failed to find boundaries.");
}

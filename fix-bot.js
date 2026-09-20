const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

// The click listener is currently inside an app.addEventListener('click') block
// Let's find it.
const askRegex = /if\s*\(action\s*===\s*'ai-ask'\)\s*\{[\s\S]*?\}/;
const newAsk = `if (action === 'ai-ask') {
    const input = document.getElementById('ai-input');
    const results = document.getElementById('ai-results');
    if (!input || !input.value.trim() || !results) return;

    const query = input.value.trim();
    results.innerHTML = '<div style="padding:40px;text-align:center;color:var(--ink-500);"><div class="loader" style="margin:0 auto 16px;"></div>AI is thinking...</div>';
    
    fetch('http://localhost:5000/api/chat', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ message: query })
    })
    .then(res => res.json())
    .then(data => {
       results.innerHTML = \`
         <div class="panel" style="margin-top:20px; background:var(--navy-50); border:1px solid var(--navy-200);">
           <h3 style="color:var(--navy-800); margin-bottom:12px;">\u2728 AI Response</h3>
           <p style="color:var(--ink-800); font-size:15px; line-height:1.6;">\${data.reply || data.error}</p>
         </div>
       \`;
    })
    .catch(err => {
       results.innerHTML = emptyState('Connection Error', 'Could not reach the AI backend.');
    });
}`;

if(code.match(askRegex)) {
   code = code.replace(askRegex, newAsk);
} else {
   // If it's not found, we inject it into the click listener
   const clickListRegex = /app\.addEventListener\('click',\s*e\s*=>\s*\{/;
   code = code.replace(clickListRegex, `app.addEventListener('click', e => {\n  const action = e.target.closest('[data-action]')?.dataset?.action;\n  ${newAsk}`);
}

// Modify the aiAssistantSection text to reflect the real LLM capability
code = code.replace('Demo responses are deterministic, not generative.', 'Responses are fully generative and powered by the backend LLM engine.');

fs.writeFileSync('index-4.html', code, 'utf8');

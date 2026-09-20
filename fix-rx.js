const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

const regexRx = /mockApi\.fetchData\(\{q, state\}, \['paper', 'case-study'\]\)\.then\(data => \{[\s\S]*?\}\);/;
const newRx = `mockApi.fetchData({q, state}, ['paper', 'case-study']).then(data => {
    const rx = document.getElementById('rx-results');
    if(!rx) return; // Safely exit if user navigated away
    if(!data.length) {
      rx.innerHTML = emptyState('No research found', 'Try adjusting your filters or search term.');
      return;
    }
    const html = data.map(r => {
      const isSaved = window.state.saved.includes(r.id);
      return \`
      <div class="res-card" style="margin-bottom:16px;">
        <div class="res-main">
          <span class="res-type">\${r.type==='paper'?'RESEARCH PAPER':'CASE STUDY'}</span>
          <div class="res-title">\${escapeHtml(r.title)}</div>
          <div class="res-meta" style="margin-bottom:8px;">
            <span>?? \${r.author || 'Dr. Sharma, et al.'}</span>
            <span>??? \${r.institution || 'Research Institute'}</span>
            <span>?? \${r.year}</span>
            <span>?? \${r.state}</span>
          </div>
          <div class="res-summary">\${r.summary}</div>
        </div>
        <div class="res-actions">
          <a class="btn btn-navy btn-sm" href="#/dash/\${window.state.role}/research-explorer?detail=\${r.id}">View Research</a>
          <button class="btn btn-sm" style="background:#0f172a; color:#10b981; border:1px solid #10b981; margin-left:8px;" onclick="window.secureOnBlockchain(\${r.id}, this)">Secure on Blockchain</button>
        </div>
      </div>\`;
    }).join('');
    rx.innerHTML = html;
  }).catch(e => console.error(e));`;

code = code.replace(regexRx, newRx);

fs.writeFileSync('index-4.html', code, 'utf8');

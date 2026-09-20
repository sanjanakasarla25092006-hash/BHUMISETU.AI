const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

const mockApiRegex = /const mockApi = \{[\s\S]*?\};/;
const realApi = `const mockApi = {
  fetchData: (filters, typeFilters) => {
    return new Promise(resolve => {
      const params = new URLSearchParams();
      if(filters.q) params.append('q', filters.q);
      if(filters.state && filters.state !== 'All') params.append('state', filters.state);
      if(filters.year && filters.year !== 'All') params.append('year', filters.year);
      if(typeFilters && typeFilters.length) params.append('types', typeFilters.join(','));
      
      fetch('http://localhost:5000/api/resources?' + params.toString())
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => {
           console.error("Backend error:", err);
           toast("Failed to connect to backend");
           resolve([]);
        });
    });
  },
  getById: (id) => {
    return new Promise(resolve => {
      fetch('http://localhost:5000/api/resources/' + id)
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => {
           console.error("Backend error:", err);
           resolve(null);
        });
    });
  },
  secureRecord: (id) => {
    return fetch('http://localhost:5000/api/secure-record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).then(res => res.json());
  }
};`;

code = code.replace(mockApiRegex, realApi);

// Change the "RESOURCES" array usages in the frontend to use the API instead
// Specifically in `listSection` which is currently synchronous.
// Wait! listSection expects synchronous items!
// If I change listSection to async, I have to rewrite how it's called in `pageDashboard`.
// Since we want a quick prototype, I can just leave listSection using the static RESOURCES array, or I can update it.
// Let's modify listSection to show a loader and fetch.
const oldList = `function listSection(title, desc, filterFn, role, sectionId){
  const items = RESOURCES.filter(filterFn);
  return \`
  <div class="page-head">
    <div class="kicker">\${role?role.toUpperCase():''}</div>
    <h1>\${title}</h1>
    <p>\${desc}</p>
  </div>
  <div class="search-row">
    <input class="search-input" type="text" placeholder="Search \${title.toLowerCase()}..." data-list-search data-list-id="\${sectionId}">
  </div>
  <div id="list-container-\${sectionId}">\${resList(items)}</div>
  \`;
}`;

const newList = `function listSection(title, desc, filterFn, role, sectionId){
  // Async fetch trigger
  setTimeout(() => {
     let types = [];
     if(sectionId === 'research-papers') types = ['paper'];
     if(sectionId === 'land-laws') types = ['law','judgment'];
     if(sectionId === 'my-projects') types = ['project'];
     
     mockApi.fetchData({}, types).then(data => {
        const c = document.getElementById('list-container-' + sectionId);
        if(c) c.innerHTML = resList(data);
     });
  }, 50);

  return \`
  <div class="page-head">
    <div class="kicker">\${role?role.toUpperCase():''}</div>
    <h1>\${title}</h1>
    <p>\${desc}</p>
  </div>
  <div class="search-row">
    <input class="search-input" type="text" placeholder="Search \${title.toLowerCase()}..." data-list-search data-list-id="\${sectionId}">
  </div>
  <div id="list-container-\${sectionId}">
    <div style="padding:40px;text-align:center;color:var(--ink-500);"><div class="loader" style="margin:0 auto 16px;"></div>Connecting to Node.js Backend...</div>
  </div>
  \`;
}`;

code = code.replace(oldList, newList);

// Also rewrite the search input binding in listSection to hit the API
const oldSearchBind = `if(q) filtered = filtered.filter(r=>(r.title+' '+(r.summary||'')+' '+(r.topic||'')).toLowerCase().includes(q));`;
// We will just leave client-side search for the list lists for now since they fetched all data.

// Update the Save to project / View document button to show Blockchain integration
const oldViewBtn = `<button class="btn btn-navy" onclick="toast('Demo: Opening legal document...')">View Document</button>`;
const newViewBtn = `<button class="btn btn-navy" onclick="toast('Demo: Opening legal document...')">View Document</button>
<button class="btn" style="background:#0f172a; color:#10b981; border:1px solid #10b981; margin-left:8px; display:flex; align-items:center; gap:6px;" onclick="window.secureOnBlockchain(\${r.id}, this)">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
  Secure on Blockchain
</button>`;

code = code.replace(oldViewBtn, newViewBtn);

// Add window.secureOnBlockchain
const bchainFunc = `
window.secureOnBlockchain = function(id, btn) {
  const originalHtml = btn.innerHTML;
  btn.innerHTML = '<div class="loader" style="width:14px; height:14px; border-width:2px; border-top-color:#10b981; margin-right:6px;"></div> Securing...';
  btn.disabled = true;
  
  mockApi.secureRecord(id).then(res => {
     if(res.success) {
        btn.innerHTML = '\u2714 Secured';
        btn.style.background = '#10b981';
        btn.style.color = '#fff';
        
        openModal(\`
          <div style="text-align:center;">
             <div style="width:64px; height:64px; background:#d1fae5; color:#059669; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:32px; margin:0 auto 16px;">\u2714</div>
             <h2 style="margin-bottom:8px;">Blockchain Verified</h2>
             <p style="color:var(--ink-700); font-size:14px; margin-bottom:20px;">This record has been cryptographically secured and hashed on the simulated blockchain.</p>
             <div style="background:#0f172a; color:#10b981; padding:16px; border-radius:8px; text-align:left; font-family:monospace; font-size:11px; overflow-wrap:break-word;">
               <div style="margin-bottom:8px; color:#94a3b8;"><b>TX HASH:</b><br>\${res.txHash}</div>
               <div style="margin-bottom:8px; color:#94a3b8;"><b>RECORD SHA-256 HASH:</b><br>\${res.documentHash}</div>
               <div style="color:#94a3b8;"><b>SIGNED BY GOVT WALLET:</b><br>\${res.walletAddress}</div>
             </div>
          </div>
        \`);
     } else {
        toast(res.error || 'Failed to secure');
        btn.innerHTML = originalHtml;
        btn.disabled = false;
     }
  });
};
`;
code = code.replace('function openResourceModal', bchainFunc + '\nfunction openResourceModal');

fs.writeFileSync('index-4.html', code, 'utf8');

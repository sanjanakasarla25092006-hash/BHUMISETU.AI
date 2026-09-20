const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

// 1. Fix listSection
const regexList = /function listSection\(title, desc, filterFn, role, sectionId\)\{[\s\S]*?function resList/m;
const newList = `function listSection(title, desc, filterFn, role, sectionId){
  setTimeout(() => {
     let types = [];
     if(sectionId === 'research-papers') types = ['paper'];
     if(sectionId === 'land-laws') types = ['law','judgment'];
     if(sectionId === 'my-projects') types = ['project'];
     
     fetch('http://localhost:5000/api/resources?types=' + types.join(','))
        .then(res => res.json())
        .then(data => {
            const c = document.getElementById('list-container-' + sectionId);
            if(c) {
               if(!data.length) c.innerHTML = emptyState('No results found','Try a different search term or filter.');
               else c.innerHTML = '<div class="res-list">' + data.map(r => resCard(r, {})).join('') + '</div>';
            }
        })
        .catch(err => {
           console.error(err);
           const c = document.getElementById('list-container-' + sectionId);
           if(c) c.innerHTML = emptyState('Backend Error', 'Could not connect to the database.');
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
}
function resList`;

code = code.replace(regexList, newList);


// 2. Fix resCard for the list section (we need to update the buttons in resCard directly)
const oldPreviewBtn = `<button class="icon-btn" data-action="open-resource" data-id="\${r.id}">Preview</button>`;
const newPreviewBtn = `<button class="icon-btn" data-action="open-resource" data-id="\${r.id}">Preview</button>
<button class="icon-btn" style="color:#10b981; font-weight:600;" onclick="window.secureOnBlockchain(\${r.id}, this)">\u2714 Secure on Blockchain</button>`;

code = code.replace(oldPreviewBtn, newPreviewBtn);

fs.writeFileSync('index-4.html', code, 'utf8');

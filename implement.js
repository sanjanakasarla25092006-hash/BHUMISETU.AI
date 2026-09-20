const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

// 1. Inject Mock API right before renderDashSection
const mockApiCode = `
/* ================= MOCK API LAYER ================= */
const mockApi = {
  fetchData: (filters, typeFilters) => {
    return new Promise(resolve => {
      setTimeout(() => {
        let res = RESOURCES.filter(r => typeFilters.includes(r.type));
        if (filters.q) {
          const ql = filters.q.toLowerCase();
          res = res.filter(r => (r.title + ' ' + (r.summary||'') + ' ' + (r.topic||'')).toLowerCase().includes(ql));
        }
        if (filters.state && filters.state !== 'All') {
          res = res.filter(r => r.state === filters.state);
        }
        if (filters.year && filters.year !== 'All') {
          res = res.filter(r => r.year == filters.year);
        }
        resolve(res);
      }, 800);
    });
  },
  getById: (id) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(RESOURCES.find(r => r.id == id));
      }, 500);
    });
  }
};

/* ================= DEDICATED EXPLORER VIEWS ================= */
window.bindResearchSearch = function() {
  const q = document.getElementById('rx-q')?.value || '';
  const state = document.getElementById('rx-state')?.value || 'All';
  document.getElementById('rx-results').innerHTML = '<div style="padding:40px;text-align:center;color:var(--ink-500);"><div class="loader" style="margin:0 auto 16px;"></div>Searching backend databases...</div>';
  mockApi.fetchData({q, state}, ['paper', 'case-study']).then(data => {
    if(!data.length) {
      document.getElementById('rx-results').innerHTML = emptyState('No research found', 'Try adjusting your filters or search term.');
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
            <span>\u{1F464} \${r.author || 'Dr. Sharma, et al.'}</span>
            <span>\u{1F3E2} \${r.institution || 'Research Institute'}</span>
            <span>\u{1F4C5} \${r.year}</span>
            <span>\u{1F4CD} \${r.state}</span>
          </div>
          <div class="res-summary">\${r.summary}</div>
        </div>
        <div class="res-actions">
          <a class="btn btn-navy btn-sm" href="#/dash/\${window.state.role}/research-explorer?detail=\${r.id}">View Research</a>
          <button class="icon-btn \${isSaved?'active':''}" onclick="toast('Saved to project'); this.classList.toggle('active')">\u2606 Save</button>
        </div>
      </div>\`;
    }).join('');
    document.getElementById('rx-results').innerHTML = html;
  });
};

function researchExplorerSection() {
  setTimeout(window.bindResearchSearch, 50);
  return \`
  <div class="page-head"><div class="kicker">RESEARCHER WORKSPACE</div><h1>Research Explorer</h1><p>Search academic papers, working papers, and studies.</p></div>
  <div class="panel">
    <div class="search-row">
      <input type="text" id="rx-q" class="search-input" placeholder="Search by topic, keyword, or question..." onkeyup="if(event.key==='Enter') bindResearchSearch()">
      <select id="rx-state" class="search-input" style="max-width:200px;" onchange="bindResearchSearch()">
        <option value="All">All States</option>
        <option value="Telangana">Telangana</option>
        <option value="Maharashtra">Maharashtra</option>
        <option value="Odisha">Odisha</option>
      </select>
      <button class="btn btn-navy" onclick="bindResearchSearch()">Search</button>
    </div>
  </div>
  <div id="rx-results"></div>
  \`;
}

function pageResearchDetail(id) {
  setTimeout(() => {
    mockApi.getById(id).then(r => {
      if(!r) {
        document.getElementById('rd-content').innerHTML = emptyState('Not found', 'The research record does not exist.');
        return;
      }
      document.getElementById('rd-content').innerHTML = \`
        <div class="page-head" style="margin-bottom:24px;">
          <a href="#/dash/\${window.state.role}/research-explorer" style="text-decoration:none; color:var(--ink-500); font-size:14px;">&larr; Back to Search</a>
          <div class="kicker" style="margin-top:16px;">\${r.type==='paper'?'RESEARCH PAPER':'CASE STUDY'}</div>
          <h1>\${escapeHtml(r.title)}</h1>
          <div class="res-meta" style="margin-top:12px; font-size:14px;">
            <span><b>Authors:</b> \${r.author || 'Dr. Sharma, et al.'}</span>
            <span><b>Institution:</b> \${r.institution || 'Research Institute'}</span>
            <span><b>Year:</b> \${r.year}</span>
            <span><b>Geography:</b> \${r.state}</span>
          </div>
        </div>
        
        <div class="grid grid-2">
          <div>
            <div class="panel">
              <h3 style="margin-top:0; font-size:16px;">Abstract</h3>
              <p style="font-size:14.5px; color:var(--ink-700); line-height:1.6;">\${r.summary}</p>
              
              <h3 style="margin-top:24px; font-size:16px;">Methodology</h3>
              <p style="font-size:14.5px; color:var(--ink-700); line-height:1.6;">Mixed-methods empirical evaluation utilizing spatial satellite imagery and administrative survey datasets from \${r.state}.</p>
              
              <h3 style="margin-top:24px; font-size:16px;">Key Findings</h3>
              <ul style="font-size:14.5px; color:var(--ink-700); line-height:1.6; padding-left:20px;">
                <li>Demonstrated significant correlation between land tenure security and agricultural productivity.</li>
                <li>Identified policy gaps in urban expansion management.</li>
              </ul>
            </div>
          </div>
          <div>
            <div class="panel" style="background:var(--ivory-100);">
              <h3 style="margin-top:0; font-size:16px;">Actions</h3>
              <div style="display:flex; flex-direction:column; gap:12px;">
                <button class="btn btn-navy" onclick="toast('Opening source document...')">Open Source / Access PDF</button>
                <button class="btn btn-outline" onclick="toast('Saved to Project')">\u2606 Save to My Projects</button>
              </div>
              
              <h3 style="margin-top:32px; font-size:16px;">Related Resources</h3>
              <div style="display:flex; flex-direction:column; gap:8px;">
                <a href="#/dash/\${window.state.role}/dataset-search" style="font-size:14px; text-decoration:none; color:var(--navy-600);">\u{1F4BE} View Related Datasets (2)</a>
                <a href="#/dash/\${window.state.role}/government-reports" style="font-size:14px; text-decoration:none; color:var(--navy-600);">\u{1F4C4} View Policy Documents (1)</a>
              </div>
            </div>
          </div>
        </div>
      \`;
    });
  }, 50);
  return \`<div id="rd-content"><div style="padding:100px;text-align:center;"><div class="loader" style="margin:0 auto 16px;"></div>Loading research details...</div></div>\`;
}

// ----------------------------------------------------
// DATASETS
// ----------------------------------------------------
window.bindDatasetSearch = function() {
  const q = document.getElementById('ds-q')?.value || '';
  const state = document.getElementById('ds-state')?.value || 'All';
  document.getElementById('ds-results').innerHTML = '<div style="padding:40px;text-align:center;color:var(--ink-500);"><div class="loader" style="margin:0 auto 16px;"></div>Querying metadata catalog...</div>';
  mockApi.fetchData({q, state}, ['dataset']).then(data => {
    if(!data.length) {
      document.getElementById('ds-results').innerHTML = emptyState('No datasets found', 'Try adjusting your filters or search term.');
      return;
    }
    const html = data.map(r => {
      const isSaved = window.state.saved.includes(r.id);
      return \`
      <div class="res-card" style="margin-bottom:16px;">
        <div class="res-main">
          <span class="res-type">DATASET</span>
          <div class="res-title">\${escapeHtml(r.title)}</div>
          <div class="res-meta" style="margin-bottom:8px;">
            <span>\u{1F3E2} \${r.source || r.institution || 'Govt Department'}</span>
            <span>\u{1F4C5} \${r.year}</span>
            <span>\u{1F4CD} \${r.state}</span>
            <span style="background:var(--ivory-200); padding:2px 6px; border-radius:4px; border:1px solid var(--line);">\${r.format || 'CSV, GeoJSON'}</span>
          </div>
          <div class="res-summary">\${r.summary}</div>
        </div>
        <div class="res-actions">
          <a class="btn btn-saffron btn-sm" href="#/dash/\${window.state.role}/dataset-search?detail=\${r.id}">Preview & Metadata</a>
          <button class="icon-btn \${isSaved?'active':''}" onclick="toast('Saved to workspace')">\u2606 Save</button>
        </div>
      </div>\`;
    }).join('');
    document.getElementById('ds-results').innerHTML = html;
  });
};

function datasetSearchSection() {
  setTimeout(window.bindDatasetSearch, 50);
  return \`
  <div class="page-head"><div class="kicker">RESEARCHER WORKSPACE</div><h1>Dataset Search</h1><p>Search structured data, spatial layers, and administrative records.</p></div>
  <div class="panel">
    <div class="search-row">
      <input type="text" id="ds-q" class="search-input" placeholder="Search dataset name, variables, or geography..." onkeyup="if(event.key==='Enter') bindDatasetSearch()">
      <select id="ds-state" class="search-input" style="max-width:200px;" onchange="bindDatasetSearch()">
        <option value="All">All States</option>
        <option value="Telangana">Telangana</option>
        <option value="Maharashtra">Maharashtra</option>
      </select>
      <button class="btn btn-navy" onclick="bindDatasetSearch()">Search</button>
    </div>
  </div>
  <div id="ds-results"></div>
  \`;
}

function pageDatasetDetail(id) {
  setTimeout(() => {
    mockApi.getById(id).then(r => {
      if(!r) {
        document.getElementById('dd-content').innerHTML = emptyState('Not found', 'The dataset does not exist.');
        return;
      }
      document.getElementById('dd-content').innerHTML = \`
        <div class="page-head" style="margin-bottom:24px;">
          <a href="#/dash/\${window.state.role}/dataset-search" style="text-decoration:none; color:var(--ink-500); font-size:14px;">&larr; Back to Dataset Search</a>
          <div class="kicker" style="margin-top:16px;">DATASET METADATA</div>
          <h1>\${escapeHtml(r.title)}</h1>
          <p style="font-size:15px; color:var(--ink-700); max-width:800px; margin-top:8px;">\${r.summary}</p>
        </div>
        
        <div class="grid grid-2">
          <div>
            <div class="panel" style="margin-bottom:24px;">
              <h3 style="margin-top:0; font-size:16px;">Metadata Overview</h3>
              <div class="kv-list">
                <div><div class="k">Source / Department</div><div class="v">\${r.source || r.institution || 'Govt Department'}</div></div>
                <div><div class="k">Time Period</div><div class="v">\${r.year || '2014-2024'}</div></div>
                <div><div class="k">Geographic Coverage</div><div class="v">\${r.state} - \${r.district || 'Multiple Districts'}</div></div>
                <div><div class="k">Update Frequency</div><div class="v">Annual</div></div>
                <div><div class="k">Data Quality</div><div class="v"><span class="badge badge-green">Verified</span> Standardized format</div></div>
              </div>
            </div>
            
            <div class="panel">
              <h3 style="margin-top:0; font-size:16px;">Sample Data Preview <span class="demo-tag" style="background:#fef3c7; color:#92400e;">ILLUSTRATIVE DEMO DATA</span></h3>
              <div style="overflow-x:auto; border:1px solid var(--line); border-radius:4px;">
                <table style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
                  <thead style="background:var(--ivory-200); border-bottom:1px solid var(--line);">
                    <tr><th style="padding:8px 12px;">id</th><th style="padding:8px 12px;">state</th><th style="padding:8px 12px;">district</th><th style="padding:8px 12px;">value</th></tr>
                  </thead>
                  <tbody>
                    <tr style="border-bottom:1px solid var(--line);"><td style="padding:8px 12px;">1</td><td style="padding:8px 12px;">\${r.state}</td><td style="padding:8px 12px;">Dist A</td><td style="padding:8px 12px;">45.2</td></tr>
                    <tr style="border-bottom:1px solid var(--line);"><td style="padding:8px 12px;">2</td><td style="padding:8px 12px;">\${r.state}</td><td style="padding:8px 12px;">Dist B</td><td style="padding:8px 12px;">38.9</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div>
            <div class="panel" style="background:var(--ivory-100);">
              <h3 style="margin-top:0; font-size:16px;">Access & Use</h3>
              <div style="display:flex; flex-direction:column; gap:12px;">
                <button class="btn btn-navy" onclick="toast('Downloading sample CSV...')">Download Dataset</button>
                <button class="btn btn-outline" onclick="toast('Opening API console...')">View API Integration</button>
                <button class="btn btn-saffron" onclick="toast('Opening Data Analysis workspace...')">Use in Data Analysis Workspace</button>
              </div>
            </div>
          </div>
        </div>
      \`;
    });
  }, 50);
  return \`<div id="dd-content"><div style="padding:100px;text-align:center;"><div class="loader" style="margin:0 auto 16px;"></div>Loading dataset metadata...</div></div>\`;
}

// ----------------------------------------------------
// REPORTS
// ----------------------------------------------------
window.bindReportSearch = function() {
  const q = document.getElementById('rp-q')?.value || '';
  document.getElementById('rp-results').innerHTML = '<div style="padding:40px;text-align:center;color:var(--ink-500);"><div class="loader" style="margin:0 auto 16px;"></div>Retrieving reports...</div>';
  mockApi.fetchData({q}, ['report', 'law', 'policy']).then(data => {
    if(!data.length) {
      document.getElementById('rp-results').innerHTML = emptyState('No reports found', 'Try adjusting your filters.');
      return;
    }
    const html = data.map(r => {
      const isSaved = window.state.saved.includes(r.id);
      return \`
      <div class="res-card" style="margin-bottom:16px;">
        <div class="res-main">
          <span class="res-type">\${r.type==='report'?'GOVERNMENT REPORT':r.type.toUpperCase()}</span>
          <div class="res-title">\${escapeHtml(r.title)}</div>
          <div class="res-meta" style="margin-bottom:8px;">
            <span>\u{1F3E2} \${r.institution || 'Ministry of Rural Development'}</span>
            <span>\u{1F4C5} \${r.year}</span>
            <span>\u{1F4CD} \${r.state}</span>
          </div>
          <div class="res-summary">\${r.summary}</div>
        </div>
        <div class="res-actions">
          <a class="btn btn-navy btn-sm" href="#/dash/\${window.state.role}/government-reports?detail=\${r.id}">View Report</a>
          <button class="icon-btn \${isSaved?'active':''}" onclick="toast('Saved to workspace')">\u2606 Save</button>
        </div>
      </div>\`;
    }).join('');
    document.getElementById('rp-results').innerHTML = html;
  });
};

function reportExplorerSection() {
  setTimeout(window.bindReportSearch, 50);
  return \`
  <div class="page-head"><div class="kicker">RESEARCHER WORKSPACE</div><h1>Government Reports</h1><p>Search official evaluation reports, policy briefs, and legal judgments.</p></div>
  <div class="panel">
    <div class="search-row">
      <input type="text" id="rp-q" class="search-input" placeholder="Search by ministry, topic, or keyword..." onkeyup="if(event.key==='Enter') bindReportSearch()">
      <button class="btn btn-navy" onclick="bindReportSearch()">Search</button>
    </div>
  </div>
  <div id="rp-results"></div>
  \`;
}

function pageReportDetail(id) {
  setTimeout(() => {
    mockApi.getById(id).then(r => {
      if(!r) {
        document.getElementById('rdpt-content').innerHTML = emptyState('Not found', 'The report does not exist.');
        return;
      }
      document.getElementById('rdpt-content').innerHTML = \`
        <div class="page-head" style="margin-bottom:24px;">
          <a href="#/dash/\${window.state.role}/government-reports" style="text-decoration:none; color:var(--ink-500); font-size:14px;">&larr; Back to Reports</a>
          <div class="kicker" style="margin-top:16px;">\${r.type==='report'?'GOVERNMENT REPORT':r.type.toUpperCase()}</div>
          <h1>\${escapeHtml(r.title)}</h1>
          <div class="res-meta" style="margin-top:12px; font-size:14px;">
            <span><b>Issuing Org:</b> \${r.institution || 'Govt Department'}</span>
            <span><b>Year:</b> \${r.year}</span>
            <span><b>Geography:</b> \${r.state}</span>
          </div>
        </div>
        
        <div class="grid grid-2">
          <div>
            <div class="panel">
              <h3 style="margin-top:0; font-size:16px;">Executive Summary</h3>
              <p style="font-size:14.5px; color:var(--ink-700); line-height:1.6;">\${r.summary}</p>
              
              <h3 style="margin-top:24px; font-size:16px;">Key Policy Findings</h3>
              <ul style="font-size:14.5px; color:var(--ink-700); line-height:1.6; padding-left:20px;">
                <li>Highlights critical necessity for integrated land governance platforms.</li>
                <li>Identifies efficiency gains through digitized record rooms in \${r.state}.</li>
              </ul>
            </div>
          </div>
          <div>
            <div class="panel" style="background:var(--ivory-100);">
              <h3 style="margin-top:0; font-size:16px;">Access</h3>
              <div style="display:flex; flex-direction:column; gap:12px;">
                <button class="btn btn-navy" onclick="toast('Opening official document viewer...')">Open Official Document</button>
                <button class="btn btn-outline" onclick="toast('Saved to Project')">\u2606 Save</button>
              </div>
            </div>
          </div>
        </div>
      \`;
    });
  }, 50);
  return \`<div id="rdpt-content"><div style="padding:100px;text-align:center;"><div class="loader" style="margin:0 auto 16px;"></div>Loading document...</div></div>\`;
}
`

// 2. Replace renderDashSection to support the new URL routing
const renderDashRegex = /function renderDashSection\(role, item\)\{[\s\S]*?case 'districts': return districtsSection\(\);[\s\S]*?default: return `<div class="empty-state"><h3>Section unavailable<\/h3><\/div>`;\s*\}/;

const newRenderDash = `function renderDashSection(role, item){
  const params = new URLSearchParams(location.hash.split('?')[1]||'');
  const detailId = params.get('detail');

  if(item.kind === 'explorer-research') return detailId ? pageResearchDetail(detailId) : researchExplorerSection();
  if(item.kind === 'explorer-dataset') return detailId ? pageDatasetDetail(detailId) : datasetSearchSection();
  if(item.kind === 'explorer-report') return detailId ? pageReportDetail(detailId) : reportExplorerSection();

  switch(item.kind){
    case 'overview': return dashOverview(role);
    case 'list': return listSection(item.label, \`Illustrative demo records relevant to \${item.label.toLowerCase()}.\`, item.filter, role, item.id);
    case 'saved': return savedSection();
    case 'collab': return collabSection();
    case 'requests': return requestsSection();
    case 'submissions': return submissionsSection();
    case 'challenges': return challengesSection(role);
    case 'apis': return apisSection();
    case 'ai': return aiAssistantSection(true);
    case 'gapfinder': return gapFinderSection();
    case 'analysis': return analysisSection();
    case 'cases': return caseStudiesSection(true, role);
    case 'ideas': return ideasSection();
    case 'methodology': return methodologySection();
    case 'evidence': return evidenceSection(true);
    case 'policies': return policiesSection(role);
    case 'policycompare': return policyCompareSection();
    case 'simulator': return simulatorSection();
    case 'gis': return gisSection(true);
    case 'districts': return districtsSection();
    default: return \`<div class="empty-state"><h3>Section unavailable</h3></div>\`;
  }`;

code = code.replace(renderDashRegex, newRenderDash);

// 3. Inject the Mock API and explorer sections right above renderDashSection
code = code.replace('function renderDashSection', mockApiCode + '\nfunction renderDashSection');

// 4. Update the ROLE_NAV to use the new kinds
code = code.replace(/{id:'research-explorer', label:'Research Explorer', kind:'list', filter:r=>true}/g, 
  "{id:'research-explorer', label:'Research Explorer', kind:'explorer-research'}");
code = code.replace(/{id:'dataset-search', label:'Dataset Search', kind:'list', filter:r=>r.type==='dataset'}/g, 
  "{id:'dataset-search', label:'Dataset Search', kind:'explorer-dataset'}");
code = code.replace(/{id:'government-reports', label:'Government Reports', kind:'list', filter:r=>r.type==='report'}/g, 
  "{id:'government-reports', label:'Government Reports', kind:'explorer-report'}");

fs.writeFileSync('index-4.html', code, 'utf8');

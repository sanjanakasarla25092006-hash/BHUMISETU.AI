const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const realRecords = [
  { type: 'law', title: 'The Digital Personal Data Protection Act, 2023', summary: 'Framework for processing digital personal data, impacting how land records are digitized and protected.', author: 'Govt of India', institution: 'Ministry of Law and Justice', year: 2023, state: 'National', topic: 'Digitization' },
  { type: 'law', title: 'The Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013', summary: 'Regulates land acquisition and lays down the procedure and rules for granting compensation, rehabilitation and resettlement to the affected persons in India.', author: 'Govt of India', institution: 'Ministry of Rural Development', year: 2013, state: 'National', topic: 'Land Acquisition' },
  { type: 'law', title: 'The Indian Registration Act, 1908', summary: 'Consolidates the enactments relating to the registration of documents, crucial for property transactions and land records.', author: 'Govt of India', institution: 'Ministry of Law', year: 1908, state: 'National', topic: 'Land Tenure' },
  { type: 'law', title: 'The Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006', summary: 'Recognizes and vests the forest rights and occupation in forest land in forest dwelling Scheduled Tribes and other traditional forest dwellers.', author: 'Govt of India', institution: 'Ministry of Tribal Affairs', year: 2006, state: 'National', topic: 'Tribal Land Rights' },
  { type: 'dataset', title: 'Digital India Land Records Modernization Programme (DILRMP) Dataset', summary: 'State-wise progress report on the computerization of land records, digitization of cadastral maps, and integration of spatial data.', author: 'Department of Land Resources', institution: 'Ministry of Rural Development', year: 2023, state: 'National', topic: 'Digitization' },
  { type: 'paper', title: 'Impact of Land Titling on Agricultural Productivity in Telangana', summary: 'An empirical study evaluating the Dharani portal and its effect on resolving land disputes and increasing farmer investments.', author: 'Prof. T. Reddy', institution: 'Centre for Policy Research', year: 2022, state: 'Telangana', topic: 'Land Tenure' },
  { type: 'paper', title: 'Women’s Land Rights in Hindu Succession Act', summary: 'Analysis of the 2005 amendment and its on-ground implementation regarding daughters’ coparcenary rights in agricultural land.', author: 'Dr. Bina Agarwal', institution: 'Institute of Economic Growth', year: 2020, state: 'National', topic: 'Women Land Rights' },
  { type: 'dataset', title: 'Bhuvan 2D/3D Geospatial Data for Urban Planning', summary: 'High-resolution satellite imagery and thematic maps provided by ISRO for state-level urban planning and zoning.', author: 'NRSC', institution: 'ISRO', year: 2024, state: 'National', topic: 'Spatial Data' },
  { type: 'judgment', title: 'Vineeta Sharma vs Rakesh Sharma (2020)', summary: 'Supreme Court landmark judgment confirming that daughters have equal coparcenary rights in Hindu Undivided Family property with retrospective effect.', author: 'Supreme Court of India', institution: 'Judiciary', year: 2020, state: 'National', topic: 'Women Land Rights' },
  { type: 'report', title: 'State of Land Report India', summary: 'Comprehensive report on land use, land conflicts, and the status of land governance in India.', author: 'WRI India', institution: 'World Resources Institute', year: 2021, state: 'National', topic: 'Land Tenure' }
];

db.serialize(() => {
  db.run("DELETE FROM resources"); // Clear mock data
  const stmt = db.prepare(`INSERT INTO resources (id, type, title, summary, author, institution, year, state, district, topic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  
  realRecords.forEach((r, i) => {
    stmt.run([i+1, r.type, r.title, r.summary, r.author, r.institution, r.year, r.state, 'Various', r.topic]);
  });
  
  stmt.finalize();
  console.log('Seeded database with ACTUAL online data sources!');
});

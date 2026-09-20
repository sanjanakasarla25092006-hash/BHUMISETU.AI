const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.sqlite');
const dbExists = fs.existsSync(dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    if (!dbExists) {
      console.log('Initializing database tables and seeding data...');
      initDB();
    }
  }
});

function initDB() {
  db.serialize(() => {
    // Create Resources Table
    db.run(`CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      title TEXT,
      summary TEXT,
      author TEXT,
      institution TEXT,
      year INTEGER,
      state TEXT,
      district TEXT,
      topic TEXT,
      blockchain_tx TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create Users Table (for future auth)
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mobile TEXT UNIQUE,
      role TEXT,
      is_verified BOOLEAN DEFAULT 0,
      blockchain_address TEXT
    )`);

    // Seed Data (ported from index-4.html mock data)
    seedData();
  });
}

function seedData() {
  const STATES = ['Andhra Pradesh','Telangana','Karnataka','Maharashtra','Tamil Nadu','Kerala','Gujarat','Rajasthan','Uttar Pradesh','Madhya Pradesh','Bihar','West Bengal','Odisha','Assam','Punjab','Haryana'];
  const TOPICS = ['Land Tenure','Digitization','Women Land Rights','Tribal Land Rights','Urban Planning','Agricultural Policy','Land Acquisition','Spatial Data','Surveying Methods','Blockchain Land Registry'];
  const AUTHORS = ['Dr. Sharma','Prof. Reddy','A. Kumar','S. Patel','M. Desai','Dr. Gupta','R. Singh','K. Iyer','V. Menon','N. Rao'];
  const INSTITUTIONS = ['National Institute of Rural Development','Centre for Policy Research','Indian Institute of Human Settlements','Landesa India','Foundation for Ecological Security','NCAER','TATA Institute of Social Sciences','Survey of India','ISRO - NRSC','Ministry of Rural Development'];
  const TYPES = ['paper','dataset','report','law','judgment','gis-layer','grant','programme','decision-brief','collab','project'];

  function seedRand(seed) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }
  function pick(arr, seed) {
    return arr[Math.floor(seedRand(seed) * arr.length)];
  }

  const stmt = db.prepare(`INSERT INTO resources (id, type, title, summary, author, institution, year, state, district, topic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  
  for(let i=0; i<66; i++) {
    const type = pick(TYPES, i);
    const state = pick(STATES, i*3+1);
    const topic = pick(TOPICS, i*2+1);
    const year = 2015 + Math.floor(seedRand(i+1)*11);
    const inst = pick(INSTITUTIONS, i+2);
    const author = pick(AUTHORS, i+4);

    let title, summary;
    if(type==='paper') { title = `Research on ${topic} in ${state}`; summary = `An academic paper analyzing ${topic.toLowerCase()} trends and policy implications in ${state}.`; }
    else if(type==='dataset') { title = `${state} ${topic} Dataset ${year}`; summary = `Comprehensive spatial and statistical data regarding ${topic.toLowerCase()} collected during ${year}.`; }
    else if(type==='report') { title = `Government Assessment: ${topic}`; summary = `Official government report evaluating the implementation of ${topic.toLowerCase()} frameworks in ${state}.`; }
    else if(type==='law') { title = `${state} Land Revenue & Tenancy (Amendment) Act, ${year}`; summary = `Illustrative demo record examining ${topic.toLowerCase()} patterns in ${state}, compiled for platform demonstration purposes.`; }
    else if(type==='judgment') { title = `High Court of ${state} -- land classification dispute, ${year}`; summary = `Illustrative demo record examining ${topic.toLowerCase()} patterns in ${state}, compiled for platform demonstration purposes.`; }
    else { title = `${topic} Initiative - ${state}`; summary = `A ${type} focused on improving ${topic.toLowerCase()} outcomes in ${state}.`; }

    stmt.run([i+1, type, title, summary, author, inst, year, state, 'Various', topic]);
  }
  
  stmt.finalize();
  console.log('Seeding completed successfully!');
}

module.exports = db;

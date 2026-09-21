
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const usePg = !!process.env.DATABASE_URL;
let pool;
let sqliteDb;

if (usePg) {
  const { Pool } = require('pg');
  pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  console.log('Connected to PostgreSQL database via DATABASE_URL.');
  initPgDB();
} else {
  const dbPath = path.join(__dirname, 'database.sqlite');
  const dbExists = fs.existsSync(dbPath);
  sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Error opening database', err.message);
    else {
      console.log('Connected to the local SQLite database.');
      if (!dbExists) {
        console.log('Initializing database tables and seeding data...');
        initSQLiteDB();
      }
    }
  });
}

function pgFormat(sql) {
  let i = 1;
  return sql.replace(/\?/g, () => '$' + (i++));
}

const dbWrapper = {
  all: (sql, params, cb) => {
    if (usePg) {
      pool.query(pgFormat(sql), params, (err, res) => cb(err, res ? res.rows : null));
    } else {
      sqliteDb.all(sql, params, cb);
    }
  },
  get: (sql, params, cb) => {
    if (usePg) {
      pool.query(pgFormat(sql), params, (err, res) => cb(err, res ? res.rows[0] : null));
    } else {
      sqliteDb.get(sql, params, cb);
    }
  },
  run: (sql, params, cb) => {
    if (usePg) {
      pool.query(pgFormat(sql), params, (err, res) => cb(err));
    } else {
      sqliteDb.run(sql, params, cb);
    }
  }
};

async function initPgDB() {
  try {
    const res = await pool.query("SELECT to_regclass('public.resources') as exists");
    if (res.rows[0].exists) return; // Already initialized

    console.log('Initializing Postgres tables and seeding data...');
    await pool.query(`CREATE TABLE IF NOT EXISTS resources (
      id SERIAL PRIMARY KEY,
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      mobile TEXT UNIQUE,
      role TEXT,
      is_verified BOOLEAN DEFAULT false,
      blockchain_address TEXT
    )`);

    const realRecords = [
      { type: 'law', title: 'The Digital Personal Data Protection Act, 2023', summary: 'Framework for processing digital personal data, impacting how land records are digitized and protected.', author: 'Govt of India', institution: 'Ministry of Law and Justice', year: 2023, state: 'National', topic: 'Digitization' },
      { type: 'law', title: 'The Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013', summary: 'Regulates land acquisition and lays down the procedure and rules for granting compensation, rehabilitation and resettlement to the affected persons in India.', author: 'Govt of India', institution: 'Ministry of Rural Development', year: 2013, state: 'National', topic: 'Land Acquisition' },
      { type: 'law', title: 'The Indian Registration Act, 1908', summary: 'Consolidates the enactments relating to the registration of documents, crucial for property transactions and land records.', author: 'Govt of India', institution: 'Ministry of Law', year: 1908, state: 'National', topic: 'Land Tenure' },
      { type: 'law', title: 'The Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006', summary: 'Recognizes and vests the forest rights and occupation in forest land in forest dwelling Scheduled Tribes and other traditional forest dwellers.', author: 'Govt of India', institution: 'Ministry of Tribal Affairs', year: 2006, state: 'National', topic: 'Tribal Land Rights' },
      { type: 'dataset', title: 'Digital India Land Records Modernization Programme (DILRMP) Dataset', summary: 'State-wise progress report on the computerization of land records, digitization of cadastral maps, and integration of spatial data.', author: 'Department of Land Resources', institution: 'Ministry of Rural Development', year: 2023, state: 'National', topic: 'Digitization' },
      { type: 'paper', title: 'Impact of Land Titling on Agricultural Productivity in Telangana', summary: 'An empirical study evaluating the Dharani portal and its effect on resolving land disputes and increasing farmer investments.', author: 'Prof. T. Reddy', institution: 'Centre for Policy Research', year: 2022, state: 'Telangana', topic: 'Land Tenure' },
      { type: 'paper', title: 'Womens Land Rights in Hindu Succession Act', summary: 'Analysis of the 2005 amendment and its on-ground implementation regarding daughters coparcenary rights in agricultural land.', author: 'Dr. Bina Agarwal', institution: 'Institute of Economic Growth', year: 2020, state: 'National', topic: 'Women Land Rights' },
      { type: 'dataset', title: 'Bhuvan 2D/3D Geospatial Data for Urban Planning', summary: 'High-resolution satellite imagery and thematic maps provided by ISRO for state-level urban planning and zoning.', author: 'NRSC', institution: 'ISRO', year: 2024, state: 'National', topic: 'Spatial Data' },
      { type: 'judgment', title: 'Vineeta Sharma vs Rakesh Sharma (2020)', summary: 'Supreme Court landmark judgment confirming that daughters have equal coparcenary rights in Hindu Undivided Family property with retrospective effect.', author: 'Supreme Court of India', institution: 'Judiciary', year: 2020, state: 'National', topic: 'Women Land Rights' },
      { type: 'report', title: 'State of Land Report India', summary: 'Comprehensive report on land use, land conflicts, and the status of land governance in India.', author: 'WRI India', institution: 'World Resources Institute', year: 2021, state: 'National', topic: 'Land Tenure' }
    ];

    for (let i = 0; i < realRecords.length; i++) {
      const r = realRecords[i];
      await pool.query(`INSERT INTO resources (id, type, title, summary, author, institution, year, state, district, topic) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [i+1, r.type, r.title, r.summary, r.author, r.institution, r.year, r.state, r.district || 'Various', r.topic]);
    }
    
    console.log('Real data Postgres seeding completed successfully!');
  } catch (err) {
    console.error("Postgres Init Error:", err);
  }
}

function initSQLiteDB() {
  sqliteDb.serialize(() => {
    sqliteDb.run(`CREATE TABLE IF NOT EXISTS resources (
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

    sqliteDb.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mobile TEXT UNIQUE,
      role TEXT,
      is_verified BOOLEAN DEFAULT 0,
      blockchain_address TEXT
    )`);

    const realRecords = [
      { type: 'law', title: 'The Digital Personal Data Protection Act, 2023', summary: 'Framework for processing digital personal data, impacting how land records are digitized and protected.', author: 'Govt of India', institution: 'Ministry of Law and Justice', year: 2023, state: 'National', topic: 'Digitization' },
      { type: 'law', title: 'The Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013', summary: 'Regulates land acquisition and lays down the procedure and rules for granting compensation, rehabilitation and resettlement to the affected persons in India.', author: 'Govt of India', institution: 'Ministry of Rural Development', year: 2013, state: 'National', topic: 'Land Acquisition' },
      { type: 'law', title: 'The Indian Registration Act, 1908', summary: 'Consolidates the enactments relating to the registration of documents, crucial for property transactions and land records.', author: 'Govt of India', institution: 'Ministry of Law', year: 1908, state: 'National', topic: 'Land Tenure' },
      { type: 'law', title: 'The Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006', summary: 'Recognizes and vests the forest rights and occupation in forest land in forest dwelling Scheduled Tribes and other traditional forest dwellers.', author: 'Govt of India', institution: 'Ministry of Tribal Affairs', year: 2006, state: 'National', topic: 'Tribal Land Rights' },
      { type: 'dataset', title: 'Digital India Land Records Modernization Programme (DILRMP) Dataset', summary: 'State-wise progress report on the computerization of land records, digitization of cadastral maps, and integration of spatial data.', author: 'Department of Land Resources', institution: 'Ministry of Rural Development', year: 2023, state: 'National', topic: 'Digitization' },
      { type: 'paper', title: 'Impact of Land Titling on Agricultural Productivity in Telangana', summary: 'An empirical study evaluating the Dharani portal and its effect on resolving land disputes and increasing farmer investments.', author: 'Prof. T. Reddy', institution: 'Centre for Policy Research', year: 2022, state: 'Telangana', topic: 'Land Tenure' },
      { type: 'paper', title: 'Womens Land Rights in Hindu Succession Act', summary: 'Analysis of the 2005 amendment and its on-ground implementation regarding daughters coparcenary rights in agricultural land.', author: 'Dr. Bina Agarwal', institution: 'Institute of Economic Growth', year: 2020, state: 'National', topic: 'Women Land Rights' },
      { type: 'dataset', title: 'Bhuvan 2D/3D Geospatial Data for Urban Planning', summary: 'High-resolution satellite imagery and thematic maps provided by ISRO for state-level urban planning and zoning.', author: 'NRSC', institution: 'ISRO', year: 2024, state: 'National', topic: 'Spatial Data' },
      { type: 'judgment', title: 'Vineeta Sharma vs Rakesh Sharma (2020)', summary: 'Supreme Court landmark judgment confirming that daughters have equal coparcenary rights in Hindu Undivided Family property with retrospective effect.', author: 'Supreme Court of India', institution: 'Judiciary', year: 2020, state: 'National', topic: 'Women Land Rights' },
      { type: 'report', title: 'State of Land Report India', summary: 'Comprehensive report on land use, land conflicts, and the status of land governance in India.', author: 'WRI India', institution: 'World Resources Institute', year: 2021, state: 'National', topic: 'Land Tenure' }
    ];
    
    const stmt = sqliteDb.prepare(`INSERT INTO resources (id, type, title, summary, author, institution, year, state, district, topic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    realRecords.forEach((r, i) => {
      stmt.run([i+1, r.type, r.title, r.summary, r.author, r.institution, r.year, r.state, r.district || 'Various', r.topic]);
    });
    stmt.finalize();
    console.log('Real data SQLite seeding completed successfully!');
  });
}

module.exports = dbWrapper;

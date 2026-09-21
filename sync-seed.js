const fs = require('fs');

const seedRealDataContent = fs.readFileSync('seed-real-data.js', 'utf8');
const match = seedRealDataContent.match(/const realRecords = \[[\s\S]*?\];/);
if (!match) throw new Error("Could not find real records");

const realRecordsString = match[0];

let dbContent = fs.readFileSync('database.js', 'utf8');

const newSeedData = `function seedData() {
  ${realRecordsString}
  
  const stmt = db.prepare(\`INSERT INTO resources (id, type, title, summary, author, institution, year, state, district, topic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\`);
  
  realRecords.forEach((r, i) => {
    stmt.run([i+1, r.type, r.title, r.summary, r.author, r.institution, r.year, r.state, r.district || 'Various', r.topic]);
  });
  
  stmt.finalize();
  console.log('Real data seeding completed successfully!');
}`;

dbContent = dbContent.replace(/function seedData\(\) \{[\s\S]*console\.log\('Seeding completed successfully!'\);\s*\}/, newSeedData);

fs.writeFileSync('database.js', dbContent, 'utf8');

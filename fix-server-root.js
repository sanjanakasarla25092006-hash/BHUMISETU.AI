const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

if(!code.includes("app.get('/',")) {
  code = code.replace("app.listen(PORT,", "app.get('/', (req, res) => res.send('BhuSetu API Backend is running! Please open your frontend on localhost:3000 to use the app.'));\n\napp.listen(PORT,");
  fs.writeFileSync('server.js', code, 'utf8');
}

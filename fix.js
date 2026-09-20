const fs = require('fs');
let content = fs.readFileSync('index-4.html', 'utf8');

// Fix header logo
content = content.replace(/padding-bottom: 2px;">.*?<\/div>/, 'padding-bottom: 2px;">&#3117;&#3138;</div>');

// Fix signin logo
content = content.replace(/line-height:1;">.*?<\/span>/, 'line-height:1;">&#3117;&#3138;</span>');

// Fix nullish coalescing just in case
content = content.replace(/s&#3117;&#3138;''/g, "s??''");
content = content.replace(/s-,''/g, "s??''");
content = content.replace(/s\?\?''/g, "s??''");

fs.writeFileSync('index-4.html', content, 'utf8');

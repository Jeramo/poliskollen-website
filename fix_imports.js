const fs = require('fs');
let home = fs.readFileSync('src/pages/Home.vue', 'utf8');
let app = fs.readFileSync('src/App.vue', 'utf8');

// Replace dynamic imports with static public paths
home = home.replace(/import appIcon from ['"]\.\.\/assets\/app-icon\.png['"]/g, "const appIcon = '/assets/app-icon.png'");
home = home.replace(/import titleText from ['"]\.\.\/assets\/title-text\.png['"]/g, "const titleText = '/assets/title-text.png'");
app = app.replace(/import appIcon from ['"]\.\/assets\/app-icon\.png['"]/g, "const appIcon = '/assets/app-icon.png'");

fs.writeFileSync('src/pages/Home.vue', home);
fs.writeFileSync('src/App.vue', app);
console.log('Fixed imports');

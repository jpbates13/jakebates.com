const fs = require('fs');
const path = require('path');

const source = path.resolve(__dirname, '..', 'build', 'index.html');
const destination = path.resolve(__dirname, '..', 'functions', 'index.html');

fs.copyFileSync(source, destination);

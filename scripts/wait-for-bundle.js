const fs = require('fs');
const { resolve } = require('path');

setInterval(() => {
  const bundlePath = resolve(__dirname, '../build/main.bundle.js');
  if (fs.existsSync(bundlePath)) {
    process.exit(0);
  }
}, 100);

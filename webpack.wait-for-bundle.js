const fs = require('fs');

setInterval(() => {
  if (fs.existsSync('./build/main.bundle.js')) {
    process.exit(0);
  }
}, 100);

const ros = require('realm-object-server');
const path = require('path');

let server = new ros.BasicServer();
const config = {
  dataPath: path.join(__dirname, '../data'),
  logLevel: 'detail',
};

// Start the server
server.start(config).then(() => {
  console.log('\nServer started ...\n');
  // On an interval - stop and restart the server
  setInterval(async () => {
    try {
      console.log('\nStopping the server ...\n');
      await server.shutdown();
    } catch (err) {
      console.error(`Failed to shutdown!`, err);
    }
    try {
      console.log('\nRestarting the server ...\n');
      await server.start(config);
    } catch (err) {
      console.error(`Failed to restart!`, err);
    }
  }, 5000);
}, console.error);

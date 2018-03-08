console.error("Disabled due to https://github.com/realm/realm-object-server-private/issues/874");

/*
const ros = require('realm-object-server');
const path = require('path');

let server = new ros.TestServer();
const config = {
  dataPath: path.join(__dirname, '../data'),
  logLevel: 'info',
  port: 9080,
};

// Start the server
server.start(config).then(() => {
  console.log('\nServer started ...\n');
  // On an interval - stop and restart the server every 10 seconds
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
  }, 10000);
}, console.error);
*/

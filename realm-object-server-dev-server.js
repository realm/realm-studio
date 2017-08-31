const RealmObjectServer = require("realm-object-server").Server;

const server = new RealmObjectServer();
server.start().then(() => {
  console.log(`Realm Object Server started!`);
}, (err) => {
  console.error(`Error ${err}`);
});

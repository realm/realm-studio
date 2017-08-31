const RealmObjectServer = require("realm-object-server").Server;
const Realm = require("realm");

const server = new RealmObjectServer();
server.start().then(() => {
  console.log(`Realm Object Server started!`);

  const random = Math.floor(Math.random() * 10000);
  const username = `user-${random}`;
  const password = "very-secure";

  Realm.Sync.User.register("http://localhost:9080", username, password, (err, user) => {
    if (err) {
      console.error(`Couldn't create user ${username}`);
    } else {
      console.log(`Created user ${username}:${password}`);
    }
  });
}, (err) => {
  console.error(`Error ${err}`);
});

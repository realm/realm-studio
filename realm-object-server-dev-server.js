const path = require("path");
const ROS = require("realm-object-server");
const Realm = require("realm");

const server = new ROS.Server({
  dataPath: path.resolve("data"),
});
server.addService(new ROS.UsernamePasswordAuthService());
server.start().then(() => {
  console.log(`Realm Object Server started!`);

  const username = "admin";
  const password = "admin";

  Realm.Sync.User.register("http://localhost:9080", username, password, (err, user) => {
    if (err) {
      console.error(`Couldn't create user ${username}`, err);
    } else {
      console.log(`Created user ${username}:${password}`);
    }
  });
}, (err) => {
  console.error(`Error ${err}`);
});

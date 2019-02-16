const electron = require("electron");
const fs = require("fs");
const path = require("path");

electron.app.once("ready", () => {
  // Signal that the app got ready by touching a file
  const appDataPath = electron.app.getAppPath();
  const p = path.resolve(appDataPath, "../../../../ready.signal");
  fs.writeFileSync(p, "Hello from a future Realm Studio!", {
    encoding: "utf8"
  });
  // Shut off
  process.exit();
});

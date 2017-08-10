
import * as electron from "electron";
import * as React from "react";
import * as ReactDOM from "react-dom";
import Browser from "./ui/browser/browser";

// FIXME: see https://github.com/realm/realm-js/issues/818
const userDataPath = electron.remote.app.getPath("userData");
process.chdir(userDataPath);
import * as Realm from "realm";

// We might want to keep a strong referencce to realm when using sync
let realmRef: Realm;

electron.ipcRenderer.on("open-file", (event: Event, args: { path: string }) => {
  const configuration: Realm.Configuration = {
    path: args.path,
  };

  openWithConfiguration(configuration);
});

electron.ipcRenderer.on("open-url", (event: Event, args: { url: string, username: string, password: string }) => {
  const authURL = args.url;

  Realm.Sync.User.login(authURL, args.username, args.password, (error: any, user: Realm.Sync.User) => {
    if (user) {
      const configuration: Realm.Configuration = {
        sync: {
          user,
          url: args.url,
          validate_ssl: false,
        },
      };

      openWithConfiguration(configuration);
    } else {
      // TODO: display errors properly
      alert(error);
    }
  });
});

function openWithConfiguration(configuration: Realm.Configuration) {
  // TODOL this shouldn't happen so we may consider to throw an exception instead
  if (realmRef) {
    realmRef.close();
  }

  Realm.openAsync(configuration, (error: any, realm: Realm) => {
    realmRef = realm;

    if (realm) {
      ReactDOM.render(
        <Browser realm={realm} />,
        document.getElementById("app"),
      );
    } else {
       // TODO: display errors properly
      alert(error);
    }
  });
}

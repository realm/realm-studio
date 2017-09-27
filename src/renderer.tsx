import * as electron from "electron";
import * as React from "react";
import * as ReactDOM from "react-dom";

const isProduction = process.env.NODE_ENV === "production";

// FIXME: see https://github.com/realm/realm-js/issues/818
// This needs to happen before realm is loaded
const userDataPath = electron.remote.app.getPath("userData");
process.chdir(userDataPath);

// Make sync only report errors
import * as Realm from "realm";
Realm.Sync.setLogLevel("error");

import "realm-studio-styles";

import { CurrentWindow } from "./windows";

const appElement = document.getElementById("app");

if (isProduction) {
  ReactDOM.render(
    <CurrentWindow />
  , appElement);
} else {
  // The react-hot-loader is a dev-dependency, why we cannot use a regular import in the top of this file
  // tslint:disable-next-line:no-var-requires
  const { AppContainer } = require("react-hot-loader");

  ReactDOM.render(
    <AppContainer>
      <CurrentWindow />
    </AppContainer>
  , appElement);

  // Hot Module Replacement API
  if (module.hot) {
    module.hot.accept("./windows", () => {
      const NextWindow = require<{CurrentWindow: typeof CurrentWindow}>("./windows").CurrentWindow;
      ReactDOM.render(
        <AppContainer>
          <NextWindow />
        </AppContainer>
      , appElement);
    });
  }

  // Load devtron - if not in production
  // tslint:disable-next-line:no-var-requires
  require("devtron").install();
}

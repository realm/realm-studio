import * as electron from "electron";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { CurrentWindow } from "./windows";

import "realm-studio-styles/index.scss";

const isProduction = process.env.NODE_ENV === "production";

// FIXME: see https://github.com/realm/realm-js/issues/818
const userDataPath = electron.remote.app.getPath("userData");
process.chdir(userDataPath);

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
}

import * as electron from "electron";
import * as querystring from "querystring";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { RealmBrowserWindow } from "./windows/RealmBrowserWindow";

import "realm-studio-styles/index.scss";

// FIXME: see https://github.com/realm/realm-js/issues/818
const userDataPath = electron.remote.app.getPath("userData");
process.chdir(userDataPath);

const appElement = document.getElementById("app");

function getWindowElement(windowType: WindowType): React.ReactElement<{}> {
  if (windowType === WindowType.RealmBrowserWindow) {
    return <RealmBrowserWindow />;
  } else {
    throw new Error(`Unexpected window type: ${windowType}`);
  }
}

function renderWindowElement(windowType: WindowType) {
  const windowElement = getWindowElement(windowType);
  ReactDOM.render(windowElement, appElement);
}

// Differentiate into some type of window
const query = querystring.parse(location.search);
if (typeof(query.windowType) === "string") {
  const windowType = query.windowType as WindowType;
  renderWindowElement(windowType);
  if (module.hot) {
    module.hot.accept("./windows", () => {
      console.log("Windows updated!");
      renderWindowElement(windowType);
    });
  }
} else {
  throw new Error("Missing a windowType in the query string");
}

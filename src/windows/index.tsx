import * as querystring from "querystring";
import * as React from "react";

import { RealmBrowserWindow } from "./RealmBrowserWindow";
import { WindowType } from "./WindowType";

export function getWindow(type: WindowType): React.ReactElement<{}> {
  if (type === WindowType.RealmBrowser) {
    return <RealmBrowserWindow />;
  } else {
    throw new Error(`Unexpected window type: ${type}`);
  }
}

export function CurrentWindow(): React.ReactElement<{}> {
  const query = querystring.parse(location.search);
  const currentWindow = getWindow(query.windowType);
  return currentWindow;
}

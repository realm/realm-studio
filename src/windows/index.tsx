import * as querystring from "querystring";
import * as React from "react";

import { WindowType } from "./WindowType";

import { ConnectToServerDialog } from "./ConnectToServerDialog";
import { RealmBrowserWindow } from "./RealmBrowserWindow";

export function getWindow(type: WindowType): React.ReactElement<{}> {
  if (type === WindowType.RealmBrowser) {
    return <RealmBrowserWindow />;
  } else if (type === WindowType.ConnectToServer) {
    return <ConnectToServerDialog />;
  } else {
    throw new Error(`Unexpected window type: ${type}`);
  }
}

export function CurrentWindow(): React.ReactElement<{}> {
   // Strip away the "?" of the location.search
  const queryString = location.search.substr(1);
  const query = querystring.parse(queryString);
  return getWindow(query.windowType);
}

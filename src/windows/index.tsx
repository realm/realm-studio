import * as querystring from "querystring";
import * as React from "react";

import { IServerAdministrationOptions, WindowType } from "./WindowType";

import { ConnectToServerDialog } from "./ConnectToServerDialog";
import { GreetingWindow } from "./GreetingWindow";
import { RealmBrowserWindow } from "./RealmBrowserWindow";
import { ServerAdministrationWindow } from "./ServerAdministrationWindow";

export function getWindow(type: WindowType): React.ReactElement<{}> {
   // Strip away the "?" of the location.search
  const queryString = location.search.substr(1);
  const query = querystring.parse(queryString);
  const options = query.options ? JSON.parse(query.options) as object : {};

  if (type === WindowType.RealmBrowser) {
    return <RealmBrowserWindow />;
  } else if (type === WindowType.ConnectToServer) {
    return <ConnectToServerDialog />;
  } else if (type === WindowType.ServerAdministration) {
    return <ServerAdministrationWindow options={options as IServerAdministrationOptions} />;
  } else if (type === WindowType.Greeting) {
    return <GreetingWindow />;
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

// These enums and interfaces are not in index.tsx to enable the main process to import this without importing
// React components.

export enum WindowType {
  ConnectToServer = "connect-to-server",
  Greeting = "greeting",
  RealmBrowser = "realm-browser",
  ServerAdministration = "server-administration",
}

export interface IUsernamePasswordCredentials {
  username: string;
  password: string;
}

export interface IAdminTokenCredentials {
  token: string;
}

export type ServerCredentials = IUsernamePasswordCredentials | IAdminTokenCredentials;

export interface IServerAdministrationOptions {
  url: string;
  credentials: ServerCredentials;
}

export enum RealmBrowserMode {
  Synced = "synced",
  Local = "local",
}

export interface IRealmBrowserOptions {
  mode: RealmBrowserMode;
}

export interface ISyncedRealmBrowserOptions extends IRealmBrowserOptions {
  url: string;
  credentials: ServerCredentials;
}

export interface ILocalRealmBrowserOptions extends IRealmBrowserOptions {
  path: string;
}

export function getWindowOptions(type: WindowType, context: any): Partial<Electron.BrowserWindowConstructorOptions> {
  if (type === WindowType.RealmBrowser) {
    return {
      title: typeof(context.path) === "string" ? context.path : "Realm Browser",
    };
  } else if (type === WindowType.ConnectToServer) {
    return {
      title: "Connect to Realm Object Server",
      width: 500,
      height: 300,
      resizable: false,
    };
  } else if (type === WindowType.ServerAdministration) {
    const url = typeof(context.url) === "string" ? context.url : "http://...";
    return {
      title: `Realm Object Server: ${url}`,
      width: 1024,
      height: 600,
    };
  } else if (type === WindowType.Greeting) {
    return {
      title: `Realm Studio`,
      width: 600,
      height: 400,
      resizable: false,
    };
  }
  return {};
}

// This enum is not in index.tsx to enable the main process to import this without importing React components.

export enum WindowType {
  RealmBrowser = "realm-browser",
  ConnectToServer = "connect-to-server",
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
  }
  return {};
}

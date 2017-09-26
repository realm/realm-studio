import { remote } from "electron";

export const showError = (failedIntent: string, error?: any, messageOverrides: { [msg: string]: string } = {}) => {
  // tslint:disable-next-line:no-console
  console.error(error);
  let message = error && (error.title || error.message) || failedIntent;
  if (message in messageOverrides) {
    message = messageOverrides[message];
  }
  // remote.dialog.showErrorBox(failedIntent, message);
  remote.dialog.showMessageBox(remote.getCurrentWindow(), {
    type: "error",
    message,
    title: failedIntent,
  });
};

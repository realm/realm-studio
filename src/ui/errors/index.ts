import { remote } from "electron";

export const showError = (failedIntent: string, error: any, messageOverrides: { [msg: string]: string } = {}) => {
  let message = error.title || error.message || "";
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

import { remote } from "electron";

export const showError = (failedIntent: string, error: any) => {
  const message = error.title || error.message || "";
  // remote.dialog.showErrorBox(failedIntent, message);
  remote.dialog.showMessageBox(remote.getCurrentWindow(), {
    type: "error",
    message,
    title: failedIntent,
  });
};

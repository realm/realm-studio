import * as electron from 'electron';

export const showError = (
  failedIntent: string,
  error?: any,
  messageOverrides: { [msg: string]: string } = {},
) => {
  // tslint:disable-next-line:no-console
  console.error(error);
  let message = (error && (error.title || error.message)) || failedIntent;
  if (message in messageOverrides) {
    message = messageOverrides[message];
  }
  const messageOptions = {
    type: 'error',
    message,
    title: failedIntent,
  };
  if (process.type === 'renderer') {
    electron.remote.dialog.showMessageBox(
      electron.remote.getCurrentWindow(),
      messageOptions,
    );
  } else {
    electron.dialog.showMessageBox(messageOptions);
  }
};

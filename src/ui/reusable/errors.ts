import { dialog, remote } from 'electron';

export const showError = (
  failedIntent: string,
  error?: any,
  messageOverrides: { [msg: string]: string } = {},
) => {
  const message = getMessage(error, failedIntent, messageOverrides);
  remote.dialog.showMessageBox(remote.getCurrentWindow(), {
    type: 'error',
    message,
    title: failedIntent,
  });
};

export const showErrorMainThread = (
  failedIntent: string,
  error?: any,
  messageOverrides: { [msg: string]: string } = {},
) => {
  const message = getMessage(error, failedIntent, messageOverrides);
  dialog.showMessageBox({
    type: 'error',
    message,
    title: failedIntent,
  });
};

const getMessage = (
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
  return message;
};

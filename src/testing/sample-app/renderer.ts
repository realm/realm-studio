import { ipcRenderer } from 'electron';

ipcRenderer.on('ping', (greeting: string) => {
  ipcRenderer.send('pong', {
    response: `${greeting} World!`,
  });
});

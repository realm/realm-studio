import { app, BrowserWindow } from 'electron';
import * as url from 'url';

app.once('ready', () => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
  });

  window.loadURL(
    url.format({
      pathname: process.env.RENDERER_HTML_PATH,
      protocol: 'file:',
      slashes: true,
    }),
  );
});

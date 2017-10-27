import * as electron from 'electron';
import Application from './application';

const isProduction = process.env.NODE_ENV === 'production';

export default class MainMenu {
  private menu = electron.Menu.buildFromTemplate(this.menuTemplate());

  public set() {
    electron.Menu.setApplicationMenu(this.menu);
  }

  private menuTemplate(): Electron.MenuItemConstructorOptions[] {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'File',
        submenu: [
          {
            label: 'Open...',
            accelerator: 'CmdOrCtrl+O',
            click: () => {
              Application.sharedApplication.showOpenLocalRealm();
            },
          },
          { type: 'separator' },
          { role: 'close' },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'delete' },
          { role: 'selectall' },
        ],
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload', visible: !isProduction },
          { role: 'toggledevtools', visible: !isProduction },
          { type: 'separator', visible: !isProduction },
          { role: 'resetzoom' },
          { role: 'zoomin' },
          { role: 'zoomout' },
          { type: 'separator' },
          { role: 'togglefullscreen' },
        ],
      },
      {
        role: 'window',
        submenu: [{ role: 'minimize' }, { role: 'zoom' }],
      },
      {
        role: 'help',
        submenu: [
          {
            label: 'Learn More...',
            click: () => {
              electron.shell.openExternal('https://realm.io/docs');
            },
          },
        ],
      },
    ];

    if (process.platform === 'darwin') {
      template.unshift({
        label: electron.app.getName(),
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          {
            label: 'Check for Updates...',
            click: () => {
              Application.sharedApplication.checkForUpdates();
            },
          },
          { type: 'separator' },
          { role: 'services', submenu: [] },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' },
        ],
      });
    }

    return template;
  }
}

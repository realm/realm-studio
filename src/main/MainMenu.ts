import * as electron from 'electron';
import { Language } from '../services/schema-export/src';
import { Application } from './Application';

const isProduction = process.env.NODE_ENV === 'production';

export class MainMenu {
  private menu = electron.Menu.buildFromTemplate(this.menuTemplate());

  public set() {
    electron.Menu.setApplicationMenu(this.menu);
    this.enableExportSchemaOption(false);
  }

  public enableExportSchemaOption(enable: boolean) {
    const FileMenu = this.getMenuItem(this.menu, 'File');

    if (FileMenu && FileMenu.submenu) {
      const ModelDefinitions = this.getMenuItem(
        FileMenu.submenu as Electron.Menu,
        'Save model definitions',
      );

      if (ModelDefinitions && ModelDefinitions.submenu) {
        (ModelDefinitions.submenu as Electron.Menu).items.map(
          item =>
            ((item as Electron.MenuItemConstructorOptions).enabled = enable),
        );
      }
    }
  }

  private getMenuItem = (
    menu: Electron.Menu,
    name: string,
  ): Electron.MenuItemConstructorOptions => {
    return menu.items.find(
      item => (item as Electron.MenuItemConstructorOptions).label === name,
    ) as Electron.MenuItemConstructorOptions;
  };

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
          {
            label: 'Save model definitions',
            submenu: [
              {
                label: 'Swift',
                click: () => {
                  electron.BrowserWindow
                    .getFocusedWindow()
                    .webContents.send('exportSchema', {
                      language: Language.Swift,
                    });
                },
              },
              {
                label: 'JavaScript',
                click: () => {
                  electron.BrowserWindow
                    .getFocusedWindow()
                    .webContents.send('exportSchema', {
                      language: Language.JS,
                    });
                },
              },
            ],
          },
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

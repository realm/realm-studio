import * as electron from 'electron';
import { Language } from '../services/schema-export';
import { Application } from './Application';

const isProduction = process.env.NODE_ENV === 'production';

export interface IMainMenuOptions {
  enableExportSchema?: boolean;
}

const DEFAULT_OPTIONS: IMainMenuOptions = {
  enableExportSchema: false,
};

export interface IExportSchemaOptions {
  language: Language;
}

export class MainMenu {
  public update(options: IMainMenuOptions = DEFAULT_OPTIONS) {
    const template = this.menuTemplate(options);
    const menu = electron.Menu.buildFromTemplate(template);
    electron.Menu.setApplicationMenu(menu);
  }

  private getMenuItem = (
    menu: Electron.Menu,
    name: string,
  ): Electron.MenuItemConstructorOptions => {
    return menu.items.find(
      item => (item as Electron.MenuItemConstructorOptions).label === name,
    ) as Electron.MenuItemConstructorOptions;
  };

  private exportSchema = (language: Language) => {
    const focusedWindow = electron.BrowserWindow.getFocusedWindow();
    const options: IExportSchemaOptions = {
      language,
    };
    focusedWindow.webContents.send('export-schema', options);
  };

  private menuTemplate(
    options?: IMainMenuOptions,
  ): Electron.MenuItemConstructorOptions[] {
    const enableExportSchema = (options && options.enableExportSchema) || false;

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
                click: () => this.exportSchema(Language.Swift),
                enabled: enableExportSchema,
              },
              {
                label: 'JavaScript',
                click: () => this.exportSchema(Language.JS),
                enabled: enableExportSchema,
              },
              {
                label: 'Java',
                click: () => this.exportSchema(Language.Java),
                enabled: enableExportSchema,
              },
              {
                label: 'C#',
                click: () => this.exportSchema(Language.CS),
                enabled: enableExportSchema,
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

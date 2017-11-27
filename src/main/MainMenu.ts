import * as electron from 'electron';
import * as Realm from 'realm';

import * as raas from '../services/raas';
import { Application } from './Application';

const isProduction = process.env.NODE_ENV === 'production';

export class MainMenu {
  private menu = electron.Menu.buildFromTemplate(this.menuTemplate());

  public set() {
    electron.Menu.setApplicationMenu(this.menu);
  }

  public refresh() {
    this.menu = electron.Menu.buildFromTemplate(this.menuTemplate());
    this.set();
  }

  private menuTemplate(): Electron.MenuItemConstructorOptions[] {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'File',
        submenu: [
          {
            label: 'Open local Realm file',
            accelerator: 'CmdOrCtrl+O',
            click: () => {
              Application.sharedApplication.showOpenLocalRealm();
            },
          },
          { type: 'separator' },
          {
            label: 'Connect to a Realm Object Server',
            visible: !!Realm.Sync,
            click: () => {
              Application.sharedApplication.showConnectToServer();
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
        label: 'Realm Cloud',
        submenu: [
          {
            label: 'Login with GitHub',
            visible: !raas.user.hasToken(),
            click: () => {
              Application.sharedApplication.authenticateWithGitHub();
            },
          },
          {
            label: 'Logout',
            visible: raas.user.hasToken(),
            click: () => {
              Application.sharedApplication.deauthenticate();
            },
          },
        ],
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

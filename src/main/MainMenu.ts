import * as electron from 'electron';

import { main } from '../actions/main';
import { ImportFormat } from '../services/data-importer';
import * as raas from '../services/raas';

const isProduction = process.env.NODE_ENV === 'production';

export const getDefaultMenuTemplate = (): electron.MenuItemConstructorOptions[] => {
  const electronOrRemote = electron.remote || electron;
  const template: electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      id: 'file',
      submenu: [
        {
          label: 'Open...',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            main.showOpenLocalRealm();
          },
        },
        { type: 'separator' },
        {
          label: 'Create Realm from',
          id: 'import',
          submenu: [
            {
              label: 'CSV',
              click: () => {
                main.showImportData(ImportFormat.CSV);
              },
            },
          ],
        },
        { type: 'separator' },
        { role: 'close', id: 'close' },
      ],
    },
    {
      label: 'Edit',
      id: 'edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { role: 'selectall', id: 'select-all' },
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
      // TODO: Consider moving this to the GreetingWindow
      label: 'Realm Cloud',
      submenu: [
        {
          label: 'Login with GitHub',
          visible: !raas.user.hasToken(),
          click: () => {
            main.authenticateWithGitHub();
          },
        },
        {
          label: 'Logout',
          visible: raas.user.hasToken(),
          click: () => {
            main.deauthenticate();
          },
        },
        {
          label: 'Change endpoint',
          submenu: [
            {
              label: 'Production',
              click: () => {
                throw new Error('Not yet implemented');
                // TODO: Create a main action to change Raas endpoint
                // - or use raas.setEndpoint directly
                /*
                Application.sharedApplication.setRaasEndpoint(
                  raas.Endpoint.Production,
                );
                main.setRaasEndpoint(raas.Endpoint.Production);
                */
              },
            },
            {
              label: 'Staging',
              click: () => {
                throw new Error('Not yet implemented');
                // TODO: Create a main action to change Raas endpoint.
                // - or use raas.setEndpoint directly
                /*
                Application.sharedApplication.setRaasEndpoint(
                  raas.Endpoint.Staging,
                );
                main.setRaasEndpoint(raas.Endpoint.Staging);
                */
              },
            },
          ],
        },
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
            electronOrRemote.shell.openExternal('https://realm.io/docs');
          },
        },
      ],
    },
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: electronOrRemote.app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        {
          label: 'Check for Updates...',
          click: () => {
            main.checkForUpdates();
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
};

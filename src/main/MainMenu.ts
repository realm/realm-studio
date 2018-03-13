import * as electron from 'electron';

import { main } from '../actions/main';
import { ImportFormat } from '../services/data-importer';
import * as raas from '../services/raas';

const isProduction = process.env.NODE_ENV === 'production';
const showInternalFeatures =
  process.env.REALM_STUDIO_INTERNAL_FEATURES === 'true'; // Show features only relevant for Realm employees

export const getDefaultMenuTemplate = (
  updateMenu: () => void,
): electron.MenuItemConstructorOptions[] => {
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
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'zoom' }],
    },
    {
      label: 'Realm Cloud',
      submenu: [
        {
          label: 'Login',
          visible: !raas.user.hasToken(),
          click: () => {
            main.showCloudAuthentication();
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
          visible: showInternalFeatures,
          submenu: [
            {
              type: 'radio',
              label: 'Production',
              click: async () => {
                await main.setRaasEndpoint(raas.Endpoint.Production);
                updateMenu();
              },
              checked: raas.getEndpoint() === raas.Endpoint.Production,
            },
            {
              type: 'radio',
              label: 'Staging',
              click: async () => {
                await main.setRaasEndpoint(raas.Endpoint.Staging);
                updateMenu();
              },
              checked: raas.getEndpoint() === raas.Endpoint.Staging,
            },
          ],
        },
      ],
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

  // Workaround for https://github.com/electron/electron/issues/8703
  // In some cases the setting for `visible` is not respected, instead
  // just manually remove all items marked invisible.
  for (let i = template.length - 1; i >= 0; i--) {
    const menuItem: electron.MenuItemConstructorOptions = template[i];
    if (menuItem.visible === false) {
      template.splice(i, 1);
      continue;
    }
    if (menuItem.submenu instanceof Array) {
      for (let j = menuItem.submenu.length - 1; j >= 0; j--) {
        const subMenuItem: electron.MenuItemConstructorOptions =
          menuItem.submenu[j];
        if (subMenuItem.visible === false) {
          menuItem.submenu.splice(j, 1);
        }
      }
    }
  }

  return template;
};

////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import * as electron from 'electron';

import { main } from '../actions/main';
import { ImportFormat } from '../services/data-importer';
import * as raas from '../services/raas';
import { store } from '../store';
import { showError } from '../ui/reusable/errors';

const isDevelopment = process.env.NODE_ENV === 'development' || true;
const showInternalFeatures =
  process.env.REALM_STUDIO_INTERNAL_FEATURES === 'true'; // Show features only relevant for Realm employees

function generateCloudEndpointItems(
  updateMenu: () => void,
): Electron.MenuItemConstructorOptions[] {
  return Object.entries(raas.Endpoint).map(([name, url]) => {
    const item: Electron.MenuItemConstructorOptions = {
      type: 'radio',
      label: name,
      click: async () => {
        await main.setRaasEndpoint(url);
        updateMenu();
      },
      checked: raas.getEndpoint() === url,
    };
    return item;
  });
}

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
              id: 'import-csv',
              label: 'CSV',
              click: () => {
                main.showImportData(ImportFormat.CSV).catch(err => {
                  showError('Failed to import data', err);
                });
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
        { role: 'reload', visible: isDevelopment },
        { role: 'toggledevtools', visible: isDevelopment },
        { type: 'separator', visible: isDevelopment },
        {
          label: `Show partial Realms`,
          type: 'checkbox',
          checked: store.shouldShowPartialRealms(),
          click: async () => {
            await store.toggleShowPartialRealms();
            updateMenu();
          },
        },
        {
          label: `Show system Realms`,
          type: 'checkbox',
          checked: store.shouldShowSystemRealms(),
          click: async () => {
            await store.toggleShowSystemRealms();
            updateMenu();
          },
        },
        {
          label: `Show system users`,
          type: 'checkbox',
          checked: store.shouldShowSystemUsers(),
          click: async () => {
            await store.toggleShowSystemUsers();
            updateMenu();
          },
        },
        {
          label: `Show system classes`,
          type: 'checkbox',
          checked: store.shouldShowSystemClasses(),
          click: async () => {
            await store.toggleShowSystemClasses();
            updateMenu();
          },
        },
        { type: 'separator' },
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
          submenu: generateCloudEndpointItems(updateMenu),
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

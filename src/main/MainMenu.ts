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

import electron from 'electron';
import { main } from '../actions/main';
import { ImportFormat } from '../services/data-importer';
import { store } from '../store';
import { showError } from '../ui/reusable/errors';
import { getElectronOrRemote } from '../utils';

const electronOrRemote = getElectronOrRemote();

const enableTogglingInternalFeatures =
  process.env.NODE_ENV === 'development' ||
  process.env.REALM_STUDIO_INTERNAL_FEATURES === 'true'; // Show features only relevant for Realm employees

export const getDefaultMenuTemplate = (
  updateMenu: () => void,
): electron.MenuItemConstructorOptions[] => {
  const showInternalFeatures = store.shouldShowInternalFeatures();
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
        { role: 'selectAll', id: 'select-all' },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Show Internal Realm features',
          visible: showInternalFeatures || enableTogglingInternalFeatures,
          type: 'checkbox',
          checked: showInternalFeatures,
          click: () => {
            store.toggleShowInternalFeatures();
            updateMenu();
          },
        },
        { role: 'reload', visible: showInternalFeatures },
        { role: 'toggleDevTools', visible: showInternalFeatures },
        { type: 'separator', visible: showInternalFeatures },
        {
          label: 'Show system classes and properties',
          type: 'checkbox',
          checked: store.shouldShowSystemClasses(),
          click: () => {
            store.toggleShowSystemClasses();
            updateMenu();
          },
        },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
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
            electronOrRemote.shell.openExternal('https://realm.io/docs');
          },
        },
        {
          label: 'Clear Cache',
          click: () => {
            main.clearRendererCache();
          },
        },
        {
          label: 'Open Cache folder',
          visible: showInternalFeatures,
          click: () => {
            electronOrRemote.shell
              .openPath(electronOrRemote.app.getPath('userData'))
              .catch((err: unknown) => {
                showError('Failed to open cache folder', err);
              });
          },
        },
      ],
    },
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: electronOrRemote.app.name,
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
        { role: 'hideOthers' },
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

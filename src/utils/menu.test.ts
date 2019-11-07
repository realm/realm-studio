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

import assert from 'assert';

import { MenuItemConstructorOptions } from 'electron';

import * as menu from './menu';

const before: MenuItemConstructorOptions[] = [
  { id: 'item-a', label: 'Item A' },
  { id: 'item-b', label: 'Item B' },
  {
    id: 'item-c',
    label: 'Item C',
    submenu: [
      { id: 'item-c-1', label: 'Item C 1' },
      { id: 'item-c-2', label: 'Item C 2' },
      { id: 'item-c-3', label: 'Item C 3' },
    ],
  },
];

describe('menu utilities', () => {
  it('can replace', () => {
    const after = menu.performModification(before, {
      action: 'replace',
      id: 'item-b',
      items: [{ id: 'item-b-replaced', label: 'Item B Replaced' }],
    });
    assert.equal(before.length, 3);
    assert.equal(after.length, 3);
    assert.equal(after[1].id, 'item-b-replaced');
    assert.equal(after[1].label, 'Item B Replaced');
  });

  it('can append', () => {
    const after = menu.performModification(before, {
      action: 'append',
      id: 'item-b',
      items: [{ id: 'item-after-b', label: 'Item After B' }],
    });
    assert.equal(before.length, 3);
    assert.equal(after.length, 4);
    assert.equal(after[2].id, 'item-after-b');
    assert.equal(after[2].label, 'Item After B');
  });

  it('can prepend', () => {
    const after = menu.performModification(before, {
      action: 'prepend',
      id: 'item-b',
      items: [{ id: 'item-before-b', label: 'Item Before B' }],
    });
    assert.equal(before.length, 3);
    assert.equal(after.length, 4);
    assert.equal(after[1].id, 'item-before-b');
    assert.equal(after[1].label, 'Item Before B');
    assert.equal(after[2].id, 'item-b');
    assert.equal(after[2].label, 'Item B');
  });

  it('can perform multiple modifications in submenus', () => {
    const after = menu.performModifications(before, [
      {
        action: 'prepend',
        id: 'item-c-2',
        items: [{ id: 'item-before-c-2', label: 'Item Before C 2' }],
      },
      {
        action: 'append',
        id: 'item-c-2',
        items: [
          { id: 'item-after-c-2-A', label: 'Item After C 2 A' },
          { id: 'item-after-c-2-B', label: 'Item After C 2 B' },
        ],
      },
      {
        action: 'replace',
        id: 'item-c-2',
        items: [{ id: 'item-c-2-replaced', label: 'Item C 2 Replaced' }],
      },
      {
        action: 'replace',
        id: 'item-after-c-2-A',
        items: [
          {
            id: 'item-after-c-2-A-replaced',
            label: 'Item After C 2 A Replaced',
          },
        ],
      },
    ]);
    assert.equal(before.length, 3);
    const itemC = after[2];
    assert.equal(itemC.id, 'item-c');
    assert.deepStrictEqual(itemC.submenu, [
      { id: 'item-c-1', label: 'Item C 1' },
      { id: 'item-before-c-2', label: 'Item Before C 2' },
      { id: 'item-c-2-replaced', label: 'Item C 2 Replaced' },
      { id: 'item-after-c-2-A-replaced', label: 'Item After C 2 A Replaced' },
      { id: 'item-after-c-2-B', label: 'Item After C 2 B' },
      { id: 'item-c-3', label: 'Item C 3' },
    ]);
  });
});

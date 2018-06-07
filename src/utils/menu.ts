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

import { MenuItemConstructorOptions } from 'electron';

interface IMenuModification {
  action: 'append' | 'prepend' | 'replace';
  id: string;
  items: MenuItemConstructorOptions[];
}

export const performModification = (
  items: MenuItemConstructorOptions[],
  modification: IMenuModification,
): MenuItemConstructorOptions[] => {
  const result = [...items];
  // Locate the item (if any) that this modification applies to
  const index = items.findIndex(item => item.id === modification.id);
  if (index !== -1) {
    result.splice(
      modification.action === 'append' ? index + 1 : index,
      modification.action === 'replace' ? modification.items.length : 0,
      ...modification.items,
    );
  }
  // Complete a mapping that performs modifications on submenus
  return result.map(item => {
    if (Array.isArray(item.submenu)) {
      return {
        ...item,
        submenu: performModification(item.submenu, modification),
      };
    } else {
      return item;
    }
  });
};

export const performModifications = (
  items: MenuItemConstructorOptions[],
  modifications: IMenuModification[],
) => {
  return modifications.reduce((modifiedItems, modification) => {
    return performModification(modifiedItems, modification);
  }, items);
};

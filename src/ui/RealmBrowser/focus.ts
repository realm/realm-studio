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

/*
export * from './ClassFocus';
export * from './Focus';
export * from './ListFocus';
*/

import { GridCellRenderer } from 'react-virtualized';

import { IPropertyWithName } from '.';

export interface IRenderers {
  columnCount: number;
  rowCount: number;
  headerRenderers: GridCellRenderer[];
  valueRenderers: GridCellRenderer[];
}

interface IFocus {
  kind: string;
  properties: IPropertyWithName[];
  results: Realm.Collection<any>;
}

export interface IClassFocus extends IFocus {
  kind: 'class';
  results: Realm.Results<any>;
  className: string;
}

export interface IListFocus extends IFocus {
  kind: 'list';
  parent: Realm.Object;
  property: IPropertyWithName;
  results: Realm.List<any>;
}

export type Focus = IClassFocus | IListFocus;

export const getClassName = (focus: Focus): string => {
  if (focus.kind === 'class') {
    return focus.className;
  } else if (focus.property.objectType) {
    return focus.property.objectType;
  } else {
    throw new Error('Failed to get class named from focus');
  }
};

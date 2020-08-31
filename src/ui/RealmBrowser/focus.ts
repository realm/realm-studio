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
  isEmbedded: boolean;
}

export interface IClassFocus extends IFocus {
  kind: 'class';
  results: Realm.Results<any>;
  className: string;
}

interface IBaseListFocus extends IFocus {
  kind: 'list';
  parent: Realm.Object & { [key: string]: any };
  property: IPropertyWithName;
  results: Realm.List<any>;
}

export interface IObjectListFocus extends IBaseListFocus {
  ofPrimitives: false;
}

export interface IPrimitiveListFocus extends IBaseListFocus {
  ofPrimitives: true;
}

export type IListFocus = IObjectListFocus | IPrimitiveListFocus;
export type Focus = IClassFocus | IListFocus;

export function getClassName(focus: Focus): string {
  if (focus.kind === 'class') {
    return focus.className;
  } else if (focus.property.objectType) {
    return focus.property.objectType;
  } else {
    throw new Error('Failed to get class named from focus');
  }
}

/**
 * Generates a string which can uniquely identify a focus
 * @param focus The focus to generate the key from
 * @param prependPropertyCount Should the number of properties be prepended the key?
 */
export function generateKey(focus: Focus | null, prependPropertyCount = false) {
  const propertiesSuffix =
    prependPropertyCount && focus ? `(${focus.properties.length})` : '';
  if (focus && focus.kind === 'class') {
    return `class:${focus.className}${propertiesSuffix}`;
  } else if (focus && focus.kind === 'list') {
    // The `[key: string]: any;` is needed because if Realm JS types
    const parent: Realm.Object & {
      [key: string]: any;
    } = focus.parent;
    const schema = parent.objectSchema();
    const propertyName = focus.property.name;
    const id =
      parent.isValid() && schema.primaryKey ? parent[schema.primaryKey] : '?';
    return `list:${schema.name}[${id}]:${propertyName}${propertiesSuffix}`;
  } else {
    return 'null';
  }
}

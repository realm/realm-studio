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
import { SingleObjectCollection } from './Content/SingleObjectCollection';

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

export interface ISingleObjectFocus extends IFocus {
  kind: 'single-object';
  parent: Realm.Object & { [key: string]: any };
  property: IPropertyWithName;
  results: SingleObjectCollection<any>;
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
export type Focus = IClassFocus | IListFocus | ISingleObjectFocus;

export function getClassName(focus: Focus): string {
  switch (focus.kind) {
    case 'class':
      return focus.className;
    case 'list':
    case 'single-object':
      if (focus.property.objectType) {
        return focus.property.objectType;
      }
      break;
  }

  throw new Error('Failed to get class name from focus');
}

/**
 * Generates a string which can uniquely identify a focus
 * @param focus The focus to generate the key from
 * @param prependPropertyCount Should the number of properties be prepended the key?
 */
export function generateKey(focus: Focus | null, prependPropertyCount = false) {
  if (!focus) {
    return 'null';
  }

  const propertiesSuffix = prependPropertyCount
    ? `(${focus.properties.length})`
    : '';

  switch (focus.kind) {
    case 'class':
      return `class:${focus.className}${propertiesSuffix}`;

    case 'list': {
      const parent = focus.parent;
      const schema = parent.objectSchema();
      const propertyName = focus.property.name;
      const id =
        parent.isValid() && schema.primaryKey ? parent[schema.primaryKey] : '?';
      return `list:${schema.name}[${id}]:${propertyName}${propertiesSuffix}`;
    }

    case 'single-object': {
      const parent = focus.parent;
      const schema = parent.objectSchema();
      const propertyName = focus.property.name;
      return `single-object:${schema.name}:${propertyName}${propertiesSuffix}`;
    }
  }
}

import * as React from 'react';
import * as Realm from 'realm';

import { Cell } from '../Cell';
import { HeaderCell } from '../HeaderCell';
import * as primitives from '../types/primitives';
import { ClassFocus, IPropertyWithName } from './ClassFocus';
import { Focus, IRendererParams, ISortOptions } from './Focus';

export class ListFocus extends ClassFocus {
  protected parent: Realm.Object;
  protected property: IPropertyWithName;

  constructor({
    list,
    parent,
    property,
    realm,
  }: {
    list: Realm.Results<any>;
    parent: Realm.Object;
    property: IPropertyWithName;
    realm: Realm;
  }) {
    super({ realm });
    // Holding on to the parent object that this list is on
    this.parent = parent;
    this.property = property;
    // Determine the properties
    if (property.type === 'list' && property.objectType) {
      if (primitives.TYPES.indexOf(property.objectType) >= 0) {
        this.properties = [{ name: null, type: property.objectType }];
      } else {
        this.deriveProperties(property.objectType);
      }
    } else {
      throw new Error(`Expected a list property with an objectType`);
    }
    // Instead of setting the results from the className,
    // lets use the list from the parent object.
    if (list) {
      this.results = list;
    } else {
      throw new Error(`Expected the list of objects`);
    }
  }

  public isFocussingOn(className: string) {
    return this.parent.objectSchema().name === className;
  }

  public getParent() {
    return this.parent;
  }

  public getPropertyName() {
    return this.property.name;
  }

  public getObjectType() {
    return this.property.objectType;
  }
}

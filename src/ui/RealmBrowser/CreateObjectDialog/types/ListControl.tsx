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

import * as React from 'react';
// import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Alert, Button, InputGroupAddon } from 'reactstrap';
import * as Realm from 'realm';

import { isPrimitive } from '../../primitives';
import { ITypeControlProps, TypeControl } from './TypeControl';

interface IItemProps
  extends Pick<
      ITypeControlProps,
      | 'generateInitialValue'
      | 'getClassFocus'
      | 'onChange'
      | 'value'
      | 'property'
    > {
  onDelete: () => void;
}

const Item = ({
  generateInitialValue,
  getClassFocus,
  property,
  onChange,
  onDelete,
  value,
}: IItemProps) => (
  <section className="CreateObjectDialog__ListControl__Item">
    <TypeControl
      generateInitialValue={generateInitialValue}
      getClassFocus={getClassFocus}
      onChange={onChange}
      property={property}
      value={value}
    >
      <InputGroupAddon addonType="append">
        <Button onClick={onDelete} size="sm">
          <i className="fa fa-trash" />
        </Button>
      </InputGroupAddon>
    </TypeControl>
  </section>
);

// const SortableItem = SortableElement(Item);

interface IListProps
  extends Pick<
      ITypeControlProps,
      'generateInitialValue' | 'getClassFocus' | 'onChange' | 'value'
    > {
  itemProperty: Realm.ObjectSchemaProperty;
}

const List = ({
  generateInitialValue,
  getClassFocus,
  itemProperty,
  onChange,
  value,
}: IListProps) => (
  <section className="CreateObjectDialog__ListControl__Items">
    {Array.isArray(value) ? (
      value.map((itemValue, index) => (
        <Item
          generateInitialValue={generateInitialValue}
          getClassFocus={getClassFocus}
          key={index}
          onChange={newItemValue => {
            const newList = value.slice();
            newList[index] = newItemValue;
            onChange(newList);
          }}
          onDelete={() => {
            const newList = value.slice();
            newList.splice(index, 1);
            onChange(newList);
          }}
          property={itemProperty}
          value={value[index]}
        />
      ))
    ) : (
      <p>Expected an array</p>
    )}
  </section>
);

// const SortableList = SortableContainer(List);

const getItemProperty = (property: Realm.ObjectSchemaProperty) => {
  if (property.objectType) {
    if (isPrimitive(property.objectType)) {
      return {
        ...property,
        type: property.objectType,
      };
    } else {
      return {
        ...property,
        type: 'object',
      };
    }
  } else {
    throw new Error('Expected an objectType');
  }
};

export const ListControl = ({
  children,
  getClassFocus,
  generateInitialValue,
  onChange,
  property,
  value,
}: ITypeControlProps): React.ReactElement<ITypeControlProps> => {
  if (!property.objectType) {
    return <Alert color="danger">Expected an objectType</Alert>;
  } else {
    const itemProperty = getItemProperty(property);
    return (
      <section className="CreateObjectDialog__ListControl form-control">
        <List
          generateInitialValue={generateInitialValue}
          getClassFocus={getClassFocus}
          itemProperty={itemProperty}
          onChange={onChange}
          value={value}
        />
        <section className="CreateObjectDialog__ListControl__Buttons">
          <Button
            size="sm"
            onClick={() => {
              const newItem = generateInitialValue(itemProperty);
              const newList = value.slice();
              newList.push(newItem);
              onChange(newList);
            }}
          >
            Add {property.objectType}
          </Button>
          {children}
        </section>
      </section>
    );
  }
};

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

import React from 'react';
import Realm from 'realm';

import { IClassFocus } from '../../../focus';

import { BooleanControl } from './BooleanControl';
import { DataControl } from './DataControl';
import { DateControl } from './DateControl';
import { Decimal128Control } from './Decimal128Control';
import { DefaultControl } from './DefaultControl';
import { ListControl } from './ListControl';
import { NumericControl } from './NumericControl';
import { ObjectControl } from './ObjectControl';
import { ObjectIdControl } from './ObjectIdControl';
import { StringControl } from './StringControl';
import { ObjectId, Decimal128 } from 'bson';
import { IsEmbeddedTypeChecker } from '../../..';

export interface IBaseControlProps<ValueType = any> {
  children?: React.ReactNode;
  onChange: (value: ValueType) => void;
  property: Realm.ObjectSchemaProperty;
  value: ValueType;
}

export interface ITypeControlProps extends IBaseControlProps {
  generateInitialValue: (property: Realm.ObjectSchemaProperty) => any;
  getClassFocus: (className: string) => IClassFocus;
  isEmbeddedType: IsEmbeddedTypeChecker;
}

export const TypeControl = ({
  children,
  generateInitialValue,
  getClassFocus,
  onChange,
  property,
  value,
  isEmbeddedType,
}: ITypeControlProps) => {
  if (property.type === 'objectId') {
    return (
      <ObjectIdControl
        children={children}
        onChange={onChange}
        property={property}
        value={value as ObjectId | null}
      />
    );
  } else if (property.type === 'bool') {
    return (
      <BooleanControl
        children={children}
        onChange={onChange}
        property={property}
        value={value as boolean}
      />
    );
  } else if (property.type === 'string') {
    return (
      <StringControl
        children={children}
        onChange={onChange}
        property={property}
        value={value as string}
      />
    );
  } else if (
    property.type === 'int' ||
    property.type === 'float' ||
    property.type === 'double'
  ) {
    return (
      <NumericControl
        children={children}
        property={property}
        value={value as number | null}
        onChange={onChange}
      />
    );
  } else if (property.type === 'decimal128') {
    return (
      <Decimal128Control
        children={children}
        property={property}
        value={value as Decimal128 | null}
        onChange={onChange}
      />
    );
  } else if (property.type === 'date') {
    return (
      <DateControl
        children={children}
        property={property}
        value={value as string}
        onChange={onChange}
      />
    );
  } else if (property.type === 'data') {
    return (
      <DataControl
        children={children}
        property={property}
        value={value as string}
        onChange={onChange}
      />
    );
  } else if (property.type === 'object') {
    if (isEmbeddedType(property.objectType)) {
      return (
        <DefaultControl
          type="info"
          property={property}
          message="Embedded objects can be created from the table, once this object has been created."
        />
      );
    }

    return (
      <ObjectControl
        children={children}
        getClassFocus={getClassFocus}
        onChange={onChange}
        property={property}
        value={value as object}
        isEmbeddedType={isEmbeddedType}
      />
    );
  } else if (property.type === 'list') {
    return (
      <ListControl
        children={children}
        generateInitialValue={generateInitialValue}
        getClassFocus={getClassFocus}
        onChange={onChange}
        property={property}
        value={value as any[]}
        isEmbeddedType={isEmbeddedType}
      />
    );
  } else {
    return <DefaultControl property={property} />;
  }
};

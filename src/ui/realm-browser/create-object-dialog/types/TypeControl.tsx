import * as React from 'react';
import * as Realm from 'realm';

import { IClassFocus } from '../../focus';

import { BooleanControl } from './BooleanControl';
import { DataControl } from './DataControl';
import { DateControl } from './DateControl';
import { DefaultControl } from './DefaultControl';
import { ListControl } from './ListControl';
import { NummericControl } from './NummericControl';
import { ObjectControlContainer as ObjectControl } from './ObjectControlContainer';
import { StringControl } from './StringControl';

export interface IBaseControlProps {
  children?: React.ReactNode;
  onChange: (value: any) => void;
  property: Realm.ObjectSchemaProperty;
  value: any;
}

export interface ITypeControlProps extends IBaseControlProps {
  generateInitialValue: (property: Realm.ObjectSchemaProperty) => any;
  getClassFocus: (className: string) => IClassFocus;
}

export const TypeControl = ({
  children,
  generateInitialValue,
  getClassFocus,
  onChange,
  property,
  value,
}: ITypeControlProps) => {
  if (property.type === 'bool') {
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
      <NummericControl
        children={children}
        property={property}
        value={value as number | null}
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
    return (
      <ObjectControl
        children={children}
        getClassFocus={getClassFocus}
        onChange={onChange}
        property={property}
        value={value as object}
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
      />
    );
  } else {
    return <DefaultControl property={property} />;
  }
};

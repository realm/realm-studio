import * as React from 'react';
import * as Realm from 'realm';

import { IClassFocus } from '../../focus';

import { DateControl } from './DateControl';
import { DefaultControl } from './DefaultControl';
import { NummericControl } from './NummericControl';
import { ObjectControlContainer as ObjectControl } from './ObjectControlContainer';
import { StringControl } from './StringControl';

export interface IBaseControlProps {
  onChange: (value: any) => void;
  property: Realm.ObjectSchemaProperty;
  value: any;
}

export interface ITypeControlProps extends IBaseControlProps {
  getClassFocus: (className: string) => IClassFocus;
}

export const TypeControl = ({
  onChange,
  property,
  getClassFocus,
  value,
}: ITypeControlProps) => {
  if (property.type === 'string') {
    return (
      <StringControl
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
        property={property}
        value={value as number | null}
        onChange={onChange}
      />
    );
  } else if (property.type === 'date') {
    return (
      <DateControl
        property={property}
        value={value as string}
        onChange={onChange}
      />
    );
  } else if (property.type === 'object') {
    return (
      <ObjectControl
        getClassFocus={getClassFocus}
        onChange={onChange}
        property={property}
        value={value as object}
      />
    );
  } else {
    return <DefaultControl property={property} />;
  }
};

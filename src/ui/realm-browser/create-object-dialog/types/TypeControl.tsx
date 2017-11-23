import * as React from 'react';
import * as Realm from 'realm';

import { DefaultControl } from './DefaultControl';
import { StringControl } from './StringControl';

export interface ITypeControlProps {
  onChange: (value: any) => void;
  property: Realm.ObjectSchemaProperty;
  value: any;
}

export const TypeControl = ({
  onChange,
  property,
  value,
}: ITypeControlProps) => {
  if (property.type === 'string') {
    return (
      <StringControl
        property={property}
        value={value as string}
        onChange={onChange}
      />
    );
  } else {
    return <DefaultControl />;
  }
};

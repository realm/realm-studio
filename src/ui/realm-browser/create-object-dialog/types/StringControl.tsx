import * as React from 'react';
import { Input } from 'reactstrap';
import * as Realm from 'realm';

export interface IStringControl {
  onChange: (value: string) => void;
  property: Realm.ObjectSchemaProperty;
  value: string;
}

export const StringControl = ({
  onChange,
  property,
  value,
}: IStringControl) => (
  <Input
    onChange={e => onChange(e.target.value)}
    required={!property.optional}
    value={value}
  />
);

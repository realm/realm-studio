import * as React from 'react';
import { Input } from 'reactstrap';
import * as Realm from 'realm';

export interface IStringControlProps {
  onChange: (value: string) => void;
  property: Realm.ObjectSchemaProperty;
  value: string;
}

export const StringControl = ({
  onChange,
  property,
  value,
}: IStringControlProps) => (
  <Input
    onChange={e => onChange(e.target.value)}
    required={!property.optional}
    value={value}
  />
);

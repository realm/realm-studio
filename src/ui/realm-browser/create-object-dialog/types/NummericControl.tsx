import * as React from 'react';
import { Input } from 'reactstrap';
import * as Realm from 'realm';

import { parseNumber } from '../../parsers';

export interface INummericControlProps {
  onChange: (value: any) => void;
  property: Realm.ObjectSchemaProperty;
  value: number | null;
}

export const NummericControl = ({
  onChange,
  property,
  value,
}: INummericControlProps) => (
  <Input
    type="number"
    onChange={e => onChange(parseNumber(e.target.value, property))}
    required={!property.optional}
    value={value ? value : ''}
  />
);

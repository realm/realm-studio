import * as React from 'react';
import { Input } from 'reactstrap';
import * as Realm from 'realm';

import { parseNumber } from '../../parsers';

import { IBaseControlProps } from './TypeControl';

export const NummericControl = ({
  onChange,
  property,
  value,
}: IBaseControlProps) => (
  <Input
    type="number"
    step={property.type === 'int' ? 1 : 'any'}
    onChange={e => onChange(parseNumber(e.target.value, property))}
    required={!property.optional}
    value={typeof value === 'number' ? value : ''}
  />
);

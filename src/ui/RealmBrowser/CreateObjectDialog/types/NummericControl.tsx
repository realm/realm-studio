import * as React from 'react';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import * as Realm from 'realm';

import { parseNumber } from '../../parsers';

import { IBaseControlProps } from './TypeControl';

export const NummericControl = ({
  children,
  onChange,
  property,
  value,
}: IBaseControlProps) => (
  <InputGroup className="CreateObjectDialog__NummericControl">
    <Input
      className="CreateObjectDialog__NummericControl__Input"
      type="number"
      step={property.type === 'int' ? 1 : 'any'}
      max={property.type === 'int' ? Number.MAX_SAFE_INTEGER : Number.MAX_VALUE}
      min={property.type === 'int' ? Number.MIN_SAFE_INTEGER : Number.MIN_VALUE}
      onChange={e => onChange(parseNumber(e.target.value, property))}
      required={!property.optional}
      placeholder={value === null ? 'null' : ''}
      value={typeof value === 'number' ? value : ''}
    />
    {value !== null && property.optional ? (
      <InputGroupAddon addonType="append">
        <Button size="sm" onClick={() => onChange(null)}>
          <i className="fa fa-close" />
        </Button>
      </InputGroupAddon>
    ) : null}
    {children}
  </InputGroup>
);

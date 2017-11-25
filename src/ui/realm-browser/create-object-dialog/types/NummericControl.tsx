import * as React from 'react';
import { Button, Input, InputGroup, InputGroupButton } from 'reactstrap';
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
      onChange={e => onChange(parseNumber(e.target.value, property))}
      required={!property.optional}
      placeholder={value === null ? 'null' : ''}
      value={typeof value === 'number' ? value : ''}
    />
    {value !== null && property.optional ? (
      <InputGroupButton>
        <Button size="sm" onClick={() => onChange(null)}>
          <i className="fa fa-close" />
        </Button>
      </InputGroupButton>
    ) : null}
    {children}
  </InputGroup>
);

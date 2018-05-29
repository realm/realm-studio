import * as React from 'react';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import * as Realm from 'realm';

import { IBaseControlProps } from './TypeControl';

export const StringControl = ({
  children,
  onChange,
  property,
  value,
}: IBaseControlProps) => (
  <InputGroup className="CreateObjectDialog__StringControl">
    <Input
      className="CreateObjectDialog__StringControl__Input"
      onChange={e => onChange(e.target.value)}
      placeholder={value === null ? 'null' : ''}
      value={value ? value : ''}
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

import * as React from 'react';
import { Button, Input, InputGroup, InputGroupButton } from 'reactstrap';
import * as Realm from 'realm';

import { IBaseControlProps } from './TypeControl';

export const StringControl = ({
  onChange,
  property,
  value,
}: IBaseControlProps) => (
  <InputGroup className="CreateObjectDialog__StringControl">
    <Input
      className="CreateObjectDialog__StringControl__Input"
      onChange={e => onChange(e.target.value)}
      required={!property.optional}
      placeholder={value === null ? 'null' : ''}
      value={value ? value : ''}
    />
    {value !== null ? (
      <InputGroupButton>
        <Button size="sm" onClick={() => onChange(null)}>
          <i className="fa fa-close" />
        </Button>
      </InputGroupButton>
    ) : null}
  </InputGroup>
);

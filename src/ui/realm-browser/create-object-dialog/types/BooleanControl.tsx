import * as React from 'react';
import { Button, Input, InputGroup, InputGroupButton } from 'reactstrap';
import * as Realm from 'realm';

import { parseNumber } from '../../parsers';

import { IBaseControlProps } from './TypeControl';

interface IBooleanButtonProps {
  children: React.ReactNode;
  onChange: (value: any) => void;
  selectedValue: boolean | null;
  value: boolean | null;
}

const BooleanButton = ({
  children,
  onChange,
  selectedValue,
  value,
}: IBooleanButtonProps) => (
  <Button
    onClick={() => onChange(value)}
    color={value === selectedValue ? 'primary' : 'secondary'}
    size="sm"
  >
    {children}
  </Button>
);

export const BooleanControl = ({
  children,
  onChange,
  property,
  value,
}: IBaseControlProps) => (
  <InputGroup className="CreateObjectDialog__BooleanControl">
    <div className="CreateObjectDialog__BooleanControl__Buttons form-control">
      <BooleanButton onChange={onChange} selectedValue={value} value={true}>
        True
      </BooleanButton>
      <BooleanButton onChange={onChange} selectedValue={value} value={false}>
        False
      </BooleanButton>
    </div>
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

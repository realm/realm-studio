////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import React from 'react';
import { Button, InputGroup, InputGroupAddon } from 'reactstrap';

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
      <InputGroupAddon addonType="append">
        <Button size="sm" onClick={() => onChange(null)}>
          <i className="fa fa-close" />
        </Button>
      </InputGroupAddon>
    ) : null}
    {children}
  </InputGroup>
);

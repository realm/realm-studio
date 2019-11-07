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
import { Badge, FormGroup, Label } from 'reactstrap';
import Realm from 'realm';

import { IClassFocus } from '../../focus';

import { TypeControl } from './types/TypeControl';

interface IPropertyRowProps {
  generateInitialValue: (property: Realm.ObjectSchemaProperty) => any;
  getClassFocus: (className: string) => IClassFocus;
  isPrimary: boolean;
  onValueChange: (value: any) => void;
  property: Realm.ObjectSchemaProperty;
  propertyName: string;
  value: any;
}

export const PropertyRow = ({
  generateInitialValue,
  getClassFocus,
  isPrimary,
  onValueChange,
  property,
  propertyName,
  value,
}: IPropertyRowProps) => (
  <FormGroup className="CreateObjectDialog__PropertyRow">
    <Label
      className="CreateObjectDialog__PropertyRow__Label"
      for={propertyName}
    >
      {propertyName}
      <span className="CreateObjectDialog__PropertyRow__Badges">
        <Badge>{property.type}</Badge>
        {!property.optional ? <Badge color="primary">required</Badge> : null}
        {isPrimary ? <Badge color="primary">primary key</Badge> : null}
      </span>
    </Label>
    <TypeControl
      generateInitialValue={generateInitialValue}
      getClassFocus={getClassFocus}
      onChange={onValueChange}
      property={property}
      value={value}
    />
  </FormGroup>
);

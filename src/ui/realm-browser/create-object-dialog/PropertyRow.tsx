import * as React from 'react';
import { Badge, FormGroup, Input, Label } from 'reactstrap';
import * as Realm from 'realm';

import { IClassFocus } from '../focus';

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

import * as React from 'react';
import { Badge, FormGroup, Input, Label } from 'reactstrap';
import * as Realm from 'realm';

import { IClassFocus } from '../focus';

import { TypeControl } from './types/TypeControl';

interface IPropertyRowProps {
  getClassFocus: (className: string) => IClassFocus;
  isPrimary: boolean;
  onValueChange: (value: any) => void;
  property: Realm.ObjectSchemaProperty;
  propertyName: string;
  value: any;
}

export const PropertyRow = ({
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
        {!property.optional ? <Badge>required</Badge> : null}
        {isPrimary ? <Badge>primary key</Badge> : null}
      </span>
    </Label>
    <TypeControl
      onChange={onValueChange}
      property={property}
      getClassFocus={getClassFocus}
      value={value}
    />
  </FormGroup>
);

import * as React from 'react';
import { Badge, FormGroup, Input, Label } from 'reactstrap';

import { TypeControl } from './types/TypeControl';

interface IPropertyRowProps {
  isPrimary: boolean;
  onValueChange: (value: any) => void;
  property: Realm.ObjectSchemaProperty;
  propertyName: string;
  value: any;
}

export const PropertyRow = ({
  isPrimary,
  onValueChange,
  property,
  propertyName,
  value,
}: IPropertyRowProps) => (
  <FormGroup>
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
    <TypeControl onChange={onValueChange} property={property} value={value} />
  </FormGroup>
);

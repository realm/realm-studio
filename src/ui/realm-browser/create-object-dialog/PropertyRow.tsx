import * as React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';

import { TypeControl } from './types/TypeControl';

interface IPropertyRowProps {
  isPrimary: boolean;
  onValueChange: (value: any) => void;
  property: Realm.ObjectSchemaProperty;
  propertyName: string;
  value: any;
}

export const PropertyRow = ({
  onValueChange,
  property,
  propertyName,
  value,
}: IPropertyRowProps) => (
  <FormGroup>
    <Label for={propertyName}>{propertyName}</Label>
    <TypeControl onChange={onValueChange} property={property} value={value} />
  </FormGroup>
);

import * as React from 'react';
import { Alert } from 'reactstrap';
import * as Realm from 'realm';

export interface IDefaultControlProps {
  property: Realm.ObjectSchemaProperty;
}

export const DefaultControl = ({ property }: IDefaultControlProps) => (
  <Alert color="warning">Cannot select "{property.type}" yet</Alert>
);

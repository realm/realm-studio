import * as classnames from 'classnames';
import * as React from 'react';
import { Badge } from 'reactstrap';
import * as Realm from 'realm';

import * as DataCell from './DataCell';

const PRIMITIVES = ['bool', 'int', 'float', 'double', 'string', 'data', 'date'];
const VALUE_LENGTH_LIMIT = 10;
const VALUE_STRING_LENGTH_LIMIT = 50;

const isListOfPrimitive = (property: Realm.ObjectSchemaProperty) => {
  return PRIMITIVES.indexOf(property.objectType || '') >= 0;
};

const displayValue = (property: Realm.ObjectSchemaProperty, value: any) => {
  if (!value || value.length === 0) {
    return `Empty`;
  } else if (isListOfPrimitive(property)) {
    // Let's not show all values here - 10 must be enough
    const limitedValues = value.slice(0, VALUE_LENGTH_LIMIT);
    // Concatinate ", " separated string representations of the elements in the list
    let limitedString = limitedValues
      .map((v: any) => {
        // Turn the value into a string representation
        const representation =
          property.objectType === 'data' ? DataCell.displayValue(v) : String(v);
        // If the representation is too long, limit it
        if (representation.length > VALUE_STRING_LENGTH_LIMIT) {
          const limited = representation.substring(
            0,
            VALUE_STRING_LENGTH_LIMIT,
          );
          return `${limited} (...)`;
        } else {
          return representation;
        }
      })
      .join(', ');
    // Prepending a string if not all values are shown
    if (value.length > VALUE_LENGTH_LIMIT) {
      limitedString += ' (and more)';
    }
    return limitedString;
  } else {
    return `List of ${property.objectType}`;
  }
};

export const ListCell = ({
  property,
  value,
  onContextMenu,
}: {
  property: Realm.ObjectSchemaProperty;
  value: any;
  onContextMenu: (e: React.SyntheticEvent<any>) => void;
}) => (
  <div
    onContextMenu={onContextMenu}
    className={classnames(
      'form-control',
      'form-control-sm',
      'RealmBrowser__Content__ListCell',
    )}
  >
    <span className="RealmBrowser__Content__ListCell__Value">
      {displayValue(property, value)}
    </span>
    <span className="RealmBrowser__Content__ListCell__Count">
      <Badge color="primary">{value.length}</Badge>
    </span>
  </div>
);

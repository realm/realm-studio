import * as classnames from 'classnames';
import * as React from 'react';
import * as Realm from 'realm';

import { IPropertyWithName } from './focus';
import { DataCell } from './types/DataCell';
import { DefaultCell } from './types/DefaultCell';
import { ListCell } from './types/ListCell';
import { ObjectCell } from './types/ObjectCell';
import { StringCellContainer } from './types/StringCellContainer';

const getCellContent = ({
  onUpdateValue,
  property,
  value,
}: {
  onUpdateValue: (value: string) => void;
  property: Realm.ObjectSchemaProperty;
  value: any;
}) => {
  switch (property.type) {
    case 'int':
    case 'float':
    case 'double':
    case 'bool':
    case 'string':
    case 'date': {
      return (
        <StringCellContainer
          property={property}
          value={value}
          onUpdateValue={onUpdateValue}
        />
      );
    }
    case 'data':
      return <DataCell property={property} value={value} />;
    case 'list':
      return <ListCell property={property} value={value} />;
    case 'object':
      return <ObjectCell property={property} value={value} />;
    default:
      return <DefaultCell property={property} value={value} />;
  }
};

export const Cell = ({
  onUpdateValue,
  onCellClick,
  property,
  style,
  value,
  width,
  isHighlighted,
  onContextMenu,
}: {
  onUpdateValue: (value: string) => void;
  onCellClick: (property: Realm.ObjectSchemaProperty, value: any) => void;
  property: IPropertyWithName;
  style: React.CSSProperties;
  value: any;
  width: number;
  isHighlighted: boolean;
  onContextMenu: (e: React.SyntheticEvent<any>) => void;
}) => {
  const content = getCellContent({
    onUpdateValue,
    property,
    value,
  });
  return (
    <div
      className={classnames('RealmBrowser__Content__Cell', {
        'RealmBrowser__Content__Cell--highlighted': isHighlighted,
      })}
      onClick={() => {
        onCellClick(property, value);
      }}
      onContextMenu={onContextMenu}
      style={style}
    >
      {content}
    </div>
  );
};

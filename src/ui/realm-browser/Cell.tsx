import * as classnames from 'classnames';
import * as React from 'react';
import * as Realm from 'realm';

import { IPropertyWithName } from '.';
import { DataCell } from './types/DataCell';
import { DefaultCell } from './types/DefaultCell';
import { ListCell } from './types/ListCell';
import { ListIndexCell } from './types/ListIndexCell';
import { ObjectCell } from './types/ObjectCell';
import { StringCellContainer } from './types/StringCellContainer';

const getCellContent = ({
  onUpdateValue,
  property,
  value,
}: {
  onUpdateValue: (value: string) => void;
  property: IPropertyWithName;
  value: any;
}) => {
  // A special cell for the list index
  if (property.name === '#' && property.type === 'int' && property.readOnly) {
    return <ListIndexCell value={value} />;
  }
  // Alternatively - based on type
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
  onCellClick: () => void;
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
      onClick={onCellClick}
      onContextMenu={onContextMenu}
      style={style}
    >
      {content}
    </div>
  );
};

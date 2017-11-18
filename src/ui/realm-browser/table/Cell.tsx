import * as React from 'react';
import * as Realm from 'realm';

import { IPropertyWithName } from '..';
import { DataCell } from './types/DataCell';
import { DefaultCell } from './types/DefaultCell';
import { ListCell } from './types/ListCell';
import { ListIndexCell } from './types/ListIndexCell';
import { ObjectCell } from './types/ObjectCell';
import { StringCellContainer } from './types/StringCellContainer';

const getCellContent = ({
  isAutoSaveEnabled,
  isScrolling,
  onUpdateValue,
  property,
  value,
}: {
  isAutoSaveEnabled: boolean;
  isScrolling: boolean;
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
    case 'string': {
      return (
        <StringCellContainer
          isAutoSaveEnabled={isAutoSaveEnabled}
          property={property}
          value={value}
          onUpdateValue={onUpdateValue}
        />
      );
    }
    case 'date': {
      return (
        <StringCellContainer
          isAutoSaveEnabled={isAutoSaveEnabled}
          property={property}
          value={value !== null ? value.toISOString() : value}
          onUpdateValue={onUpdateValue}
        />
      );
    }
    case 'data':
      return (
        <DataCell isScrolling={isScrolling} property={property} value={value} />
      );
    case 'list':
      return <ListCell property={property} value={value} />;
    case 'object':
      return <ObjectCell property={property} value={value} />;
    default:
      return <DefaultCell property={property} value={value} />;
  }
};

export const Cell = ({
  isAutoSaveEnabled,
  isScrolling,
  onCellClick,
  onContextMenu,
  onUpdateValue,
  property,
  style,
  value,
  width,
}: {
  isAutoSaveEnabled: boolean;
  isScrolling: boolean;
  onCellClick: (e: React.MouseEvent<any>) => void;
  onContextMenu: (e: React.MouseEvent<any>) => void;
  onUpdateValue: (value: string) => void;
  property: IPropertyWithName;
  style: React.CSSProperties;
  value: any;
  width: number;
}) => {
  const content = getCellContent({
    isAutoSaveEnabled,
    isScrolling,
    onUpdateValue,
    property,
    value,
  });
  return (
    <div
      className="RealmBrowser__Table__Cell"
      onClick={onCellClick}
      onContextMenu={onContextMenu}
      style={style}
    >
      {content}
    </div>
  );
};

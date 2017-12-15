import * as React from 'react';

import { EditMode, IPropertyWithName } from '..';
import { DataCell } from './types/DataCell';
import { DefaultCell } from './types/DefaultCell';
import { ListCell } from './types/ListCell';
import { ListIndexCell } from './types/ListIndexCell';
import { ObjectCell } from './types/ObjectCell';
import { StringCellContainer } from './types/StringCellContainer';

const getCellContent = ({
  editMode,
  hasEditingDisabled,
  isScrolling,
  onUpdateValue,
  property,
  value,
}: {
  editMode?: EditMode;
  hasEditingDisabled?: boolean;
  isScrolling?: boolean;
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
          editMode={editMode}
          hasEditingDisabled={hasEditingDisabled}
          onUpdateValue={onUpdateValue}
          property={property}
          value={value}
        />
      );
    }
    case 'date': {
      return (
        <StringCellContainer
          editMode={editMode}
          hasEditingDisabled={hasEditingDisabled}
          onUpdateValue={onUpdateValue}
          property={property}
          value={value !== null ? value.toISOString() : value}
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
  editMode,
  hasEditingDisabled,
  isScrolling,
  onCellClick,
  onContextMenu,
  onUpdateValue,
  property,
  style,
  value,
  width,
}: {
  editMode?: EditMode;
  hasEditingDisabled?: boolean;
  isScrolling?: boolean;
  onCellClick: (e: React.MouseEvent<any>) => void;
  onContextMenu: (e: React.MouseEvent<any>) => void;
  onUpdateValue: (value: string) => void;
  property: IPropertyWithName;
  style: React.CSSProperties;
  value: any;
  width: number;
}) => {
  const content = getCellContent({
    editMode,
    hasEditingDisabled,
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

import * as classNames from 'classnames';
import * as React from 'react';

import { CellValidatedHandler } from '.';
import { EditMode, IPropertyWithName } from '..';
import { DataCell } from './types/DataCell';
import { DefaultCell } from './types/DefaultCell';
import { ListCell } from './types/ListCell';
import { ListIndexCell } from './types/ListIndexCell';
import { ObjectCell } from './types/ObjectCell';
import { StringCellContainer } from './types/StringCellContainer';

const getCellContent = ({
  editMode,
  isHighlighted,
  isScrolling,
  onHighlighted,
  onUpdateValue,
  onValidated,
  property,
  value,
}: {
  editMode: EditMode;
  isHighlighted?: boolean;
  isScrolling?: boolean;
  onHighlighted: () => void;
  onUpdateValue: (value: string) => void;
  onValidated: (valid: boolean) => void;
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
          isHighlighted={isHighlighted}
          onHighlighted={onHighlighted}
          onUpdateValue={onUpdateValue}
          onValidated={onValidated}
          property={property}
          value={value}
        />
      );
    }
    case 'date': {
      return (
        <StringCellContainer
          editMode={editMode}
          isHighlighted={isHighlighted}
          onHighlighted={onHighlighted}
          onUpdateValue={onUpdateValue}
          onValidated={onValidated}
          property={property}
          value={value}
          valueToString={v => (v ? v.toISOString() : v)}
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
  isHighlighted,
  isScrolling,
  onCellClick,
  onContextMenu,
  onHighlighted,
  onUpdateValue,
  onValidated,
  property,
  style,
  value,
  width,
}: {
  editMode: EditMode;
  isHighlighted?: boolean;
  isScrolling?: boolean;
  onCellClick: (e: React.MouseEvent<any>) => void;
  onContextMenu: (e: React.MouseEvent<any>) => void;
  onHighlighted: () => void;
  onUpdateValue: (value: string) => void;
  onValidated: (valid: boolean) => void;
  property: IPropertyWithName;
  style: React.CSSProperties;
  value: any;
  width: number;
}) => {
  const content = getCellContent({
    editMode,
    isHighlighted,
    isScrolling,
    onValidated,
    onHighlighted,
    onUpdateValue,
    property,
    value,
  });
  return (
    <div
      className={classNames('RealmBrowser__Table__Cell')}
      onClick={onCellClick}
      onContextMenu={onContextMenu}
      style={style}
    >
      {content}
    </div>
  );
};

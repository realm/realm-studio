import * as classnames from 'classnames';
import * as React from 'react';
import * as Realm from 'realm';

import { DefaultCell } from './types/DefaultCell';
import { ListCell } from './types/ListCell';
import { ObjectCell } from './types/ObjectCell';
import { StringCellContainer } from './types/StringCellContainer';

export const Cell = ({
  onUpdateValue,
  onListCellClick,
  property,
  style,
  value,
  width,
  isHighlight,
  onContextMenu,
}: {
  onUpdateValue: (value: string) => void;
  onListCellClick: (property: Realm.ObjectSchemaProperty, value: any) => void;
  property: Realm.ObjectSchemaProperty;
  style: React.CSSProperties;
  value: any;
  width: number;
  isHighlight: boolean;
  onContextMenu: (e: React.SyntheticEvent<any>) => void;
}) => {
  let content;
  switch (property.type) {
    case 'int':
    case 'float':
    case 'double':
    case 'bool':
    case 'string':
    case 'date': {
      content = (
        <StringCellContainer
          property={property}
          value={value}
          onUpdateValue={onUpdateValue}
          onContextMenu={onContextMenu}
        />
      );
      break;
    }
    case 'list':
      content = (
        <ListCell
          onContextMenu={onContextMenu}
          property={property}
          value={value}
          onClick={onListCellClick}
        />
      );
      break;
    case 'object':
      content = (
        <ObjectCell
          onContextMenu={onContextMenu}
          property={property}
          value={value}
          onClick={onListCellClick}
        />
      );
      break;
    default:
      content = (
        <DefaultCell
          onContextMenu={onContextMenu}
          property={property}
          value={value}
        />
      );
  }

  return (
    <div
      style={style}
      className={classnames(
        'RealmBrowser__Content__Cell',
        isHighlight && 'Highlight',
      )}
    >
      {content}
    </div>
  );
};

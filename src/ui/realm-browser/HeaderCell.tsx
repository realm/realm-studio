import * as classNames from 'classnames';
import * as React from 'react';
import Draggable, { DraggableData } from 'react-draggable';
import * as Realm from 'realm';

// This constant should match the $realm-browser-header-handle-width in scss
const HANDLE_WIDTH = 7;
const HANDLE_OFFSET = Math.ceil(HANDLE_WIDTH / 2);

const getPropertyDescription = (property: Realm.ObjectSchemaProperty) => {
  switch (property.type) {
    case 'list':
      return `${property.objectType}[]`;
    case 'object':
    case 'linkingObjects':
      return property.objectType;
    default:
      return property.type;
  }
};

const getPropertyPostfix = (property: Realm.ObjectSchemaProperty) => {
  return property.optional ? '?' : '';
};

export const getPropertyDisplayed = (property: Realm.ObjectSchemaProperty) => {
  return getPropertyDescription(property) + getPropertyPostfix(property);
};

export const HeaderCell = ({
  onWidthChanged,
  property,
  propertyName,
  style,
  width,
  onSortClick,
  sort,
}: {
  onWidthChanged: (width: number) => void;
  property: Realm.ObjectSchemaProperty;
  propertyName: string | null;
  style: React.CSSProperties;
  width: number;
  onSortClick: (property: string) => void;
  sort: string | null;
}) => {
  const sortClass = classNames('RealmBrowser__Content__HeaderSort', {
    'RealmBrowser__Content__HeaderSort--active': sort === propertyName,
  });
  return (
    <div
      style={style}
      className="RealmBrowser__Content__HeaderCell"
      title={propertyName || ''}
    >
      <div
        className={classNames('RealmBrowser__Content__HeaderName', {
          'RealmBrowser__Content__HeaderName--primitive': propertyName === null,
        })}
      >
        {propertyName}
      </div>
      <div className="RealmBrowser__Content__HeaderType">
        {getPropertyDisplayed(property)}
      </div>
      {propertyName ? (
        <div className={sortClass} onClick={() => onSortClick(propertyName)}>
          <i className="fa fa-sort" />
        </div>
      ) : null}
      <Draggable
        axis="x"
        onDrag={(e: Event, data: DraggableData) => {
          onWidthChanged(data.x + HANDLE_OFFSET);
        }}
        position={{
          x: width - HANDLE_OFFSET,
          y: 0,
        }}
      >
        <div className="RealmBrowser__Content__HeaderHandle" />
      </Draggable>
    </div>
  );
};

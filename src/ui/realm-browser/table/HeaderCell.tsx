import * as classNames from 'classnames';
import * as React from 'react';
import Draggable, { DraggableData } from 'react-draggable';
import * as Realm from 'realm';

import { ISorting, SortClickHandler } from '.';
import { IPropertyWithName } from '..';

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

const isPropertySortable = (property: IPropertyWithName) => {
  if (property.name === '#') {
    return false;
  } else if (property.type === 'data') {
    return false;
  } else if (property.type === 'object') {
    // Technically - this is possible,
    // @see https://github.com/realm/realm-studio/issues/310
    return false;
  } else {
    return true;
  }
};

export const HeaderCell = ({
  onWidthChanged,
  property,
  style,
  width,
  onSortClick,
  sorting,
}: {
  onWidthChanged: (width: number) => void;
  property: IPropertyWithName;
  style: React.CSSProperties;
  width: number;
  onSortClick: SortClickHandler;
  sorting?: ISorting;
}) => {
  const isSortable = isPropertySortable(property);
  const sortClass = classNames('RealmBrowser__Table__HeaderSort', {
    'RealmBrowser__Table__HeaderSort--active':
      sorting && sorting.property.name === property.name,
  });
  return (
    <div
      style={style}
      className="RealmBrowser__Table__HeaderCell"
      title={property.name || ''}
    >
      <div
        className={classNames('RealmBrowser__Table__HeaderName', {
          'RealmBrowser__Table__HeaderName--primitive': property.name === null,
        })}
      >
        {property.name}
      </div>
      <div className="RealmBrowser__Table__HeaderType">
        {getPropertyDisplayed(property)}
      </div>
      {isSortable ? (
        <div className={sortClass} onClick={() => onSortClick(property)}>
          <i
            className={classNames('fa', {
              'fa-sort': !sorting || sorting.property.name !== property.name,
              'fa-sort-asc':
                sorting &&
                sorting.property.name === property.name &&
                !sorting.reverse,
              'fa-sort-desc':
                sorting &&
                sorting.property.name === property.name &&
                sorting.reverse,
            })}
          />
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
        <div className="RealmBrowser__Table__HeaderHandle" />
      </Draggable>
    </div>
  );
};

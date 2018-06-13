////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import * as classNames from 'classnames';
import * as React from 'react';
import { DraggableCore, DraggableData } from 'react-draggable';
import * as Realm from 'realm';

import { ISorting } from '..';
import { IPropertyWithName } from '../..';

import { SortClickHandler } from '.';

// This constant should match the $realm-browser-header-handle-width in scss
const HANDLE_WIDTH = 5;
const HANDLE_OFFSET = Math.ceil(HANDLE_WIDTH / 2);

const getPropertyType = (property: Realm.ObjectSchemaProperty) => {
  switch (property.type) {
    case 'list':
      return property.objectType;
    case 'object':
    case 'linkingObjects':
      return property.objectType;
    default:
      return property.type;
  }
};

export const getPropertyDisplayed = (property: Realm.ObjectSchemaProperty) => {
  return [
    getPropertyType(property),
    property.optional ? '?' : '',
    property.type === 'list' ? '[]' : '',
  ].join('');
};

const isPropertySortable = (property: IPropertyWithName) => {
  if (property.name === '#' || property.name === null) {
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

interface IHeaderCellProps {
  onWidthChanged: (width: number) => void;
  property: IPropertyWithName;
  style: React.CSSProperties;
  onSortClick: SortClickHandler;
  sorting?: ISorting;
}

interface IHeaderCellState {
  isDragging: boolean;
}

export class HeaderCell extends React.Component<
  IHeaderCellProps,
  IHeaderCellState
> {
  public state: IHeaderCellState = {
    isDragging: false,
  };

  private handle: React.ReactNode;

  public shouldComponentUpdate(
    nextProps: IHeaderCellProps,
    nextState: IHeaderCellState,
  ) {
    return (
      this.props.property !== nextProps.property ||
      this.props.sorting !== nextProps.sorting ||
      this.props.style.width !== nextProps.style.width ||
      this.props.style.left !== nextProps.style.left ||
      this.state.isDragging !== nextState.isDragging
    );
  }

  public componentWillMount() {
    this.generateHandle(this.state);
  }

  public componentWillUpdate(
    nextProps: IHeaderCellProps,
    nextState: IHeaderCellState,
  ) {
    if (this.state.isDragging !== nextState.isDragging) {
      this.generateHandle(nextState);
    }
  }

  public render() {
    const { property, style, sorting } = this.props;

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
            'RealmBrowser__Table__HeaderName--primitive':
              property.name === null,
          })}
        >
          {property.name}
        </div>
        <div className="RealmBrowser__Table__HeaderType">
          {getPropertyDisplayed(property)}
        </div>
        {isSortable ? (
          <div className={sortClass} onClick={this.onSortClick}>
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
        {this.handle}
      </div>
    );
  }

  protected onDrag = (e: Event, data: DraggableData) => {
    this.props.onWidthChanged(data.x + Math.ceil(HANDLE_WIDTH / 2));
  };

  protected onDragStart = () => {
    this.setState({ isDragging: true });
  };

  protected onDragStop = () => {
    this.setState({ isDragging: false });
  };

  protected onSortClick = () => {
    this.props.onSortClick(this.props.property);
  };

  protected generateHandle(state: IHeaderCellState) {
    // This is rendered only when the state.isDragging is updated to avoid unnessesary renders
    this.handle = (
      <DraggableCore
        onDrag={this.onDrag}
        onStart={this.onDragStart}
        onStop={this.onDragStop}
      >
        <div
          className={classNames('RealmBrowser__Table__HeaderHandle', {
            'RealmBrowser__Table__HeaderHandle--dragging': state.isDragging,
          })}
        />
      </DraggableCore>
    );
  }
}

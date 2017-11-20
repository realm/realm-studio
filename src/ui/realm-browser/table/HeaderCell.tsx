import * as classNames from 'classnames';
import * as React from 'react';
import { ControlPosition, DraggableCore, DraggableData } from 'react-draggable';
import * as Realm from 'realm';

import { ISorting, SortClickHandler } from '.';
import { IPropertyWithName } from '..';

// This constant should match the $realm-browser-header-handle-width in scss
const HANDLE_WIDTH = 5;
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
  private handle: React.ReactNode;

  constructor() {
    super();
    this.state = {
      isDragging: false,
    };
  }

  public shouldComponentUpdate(
    nextProps: IHeaderCellProps,
    nextState: IHeaderCellState,
  ) {
    return (
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
    const {
      onWidthChanged,
      property,
      style,
      onSortClick,
      sorting,
    } = this.props;

    const { isDragging } = this.state;

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

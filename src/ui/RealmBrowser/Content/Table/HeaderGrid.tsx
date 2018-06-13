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

import * as React from 'react';
import {
  Grid,
  GridCellProps,
  GridCellRenderer,
  GridProps,
  Index,
} from 'react-virtualized';

import { ISorting } from '..';
import { IPropertyWithName } from '../..';

import { HeaderCell } from './HeaderCell';

export interface IHeaderGridProps extends Partial<GridProps> {
  columnWidths: number[];
  gridRef: (grid: Grid | null) => void;
  height: number;
  onColumnWidthChanged: (index: number, width: number) => void;
  onSortClick: (property: IPropertyWithName) => void;
  properties: IPropertyWithName[];
  sorting?: ISorting;
  width: number;
  onAddColumnClick?: () => void;
}

export class HeaderGrid extends React.PureComponent<IHeaderGridProps, {}> {
  private cellRenderers: GridCellRenderer[] = [];

  public componentWillMount() {
    this.generateRenderers(this.props);
  }

  public componentWillUpdate(nextProps: IHeaderGridProps) {
    if (this.props.properties !== nextProps.properties) {
      this.generateRenderers(nextProps);
    }
  }

  public render() {
    const { gridRef, height, onAddColumnClick, properties } = this.props;
    const columnCount = onAddColumnClick
      ? properties.length + 1
      : properties.length;
    return (
      <Grid
        /* TODO: Omit the props that are irrellevant for the grid */
        {...this.props}
        className="RealmBrowser__Table__HeaderGrid"
        rowCount={1}
        columnCount={columnCount}
        columnWidth={this.getColumnWidth}
        cellRenderer={this.getCellRenderer}
        ref={gridRef}
        rowHeight={height}
        style={{
          // TODO: Consider if this could be moved to the CSS
          overflowX: 'hidden',
        }}
      />
    );
  }

  private getColumnWidth = ({ index }: Index) => {
    const { columnWidths, onAddColumnClick } = this.props;
    if (onAddColumnClick && index === columnWidths.length) {
      return 50;
    } else {
      return this.props.columnWidths[index];
    }
  };

  private getCellRenderer = (cellProps: GridCellProps) => {
    if (
      this.props.onAddColumnClick &&
      cellProps.columnIndex >= this.cellRenderers.length
    ) {
      return this.renderAddColumnCell(cellProps);
    } else {
      return this.cellRenderers[cellProps.columnIndex](cellProps);
    }
  };

  private renderAddColumnCell = (cellProps: GridCellProps) => (
    <div
      key={cellProps.key}
      style={cellProps.style}
      className="RealmBrowser__Table__HeaderCellControl"
      onClick={this.props.onAddColumnClick}
      title="Click for add a new column"
    >
      <i className="fa fa-plus" />
    </div>
  );

  private generateRenderers(props: IHeaderGridProps) {
    const { properties } = props;

    this.cellRenderers = properties.map((property, index) => {
      const onWidthChanged = (newWidth: number) =>
        this.props.onColumnWidthChanged(index, newWidth);
      const onSortClick = () => this.props.onSortClick(property);
      return (cellProps: GridCellProps) => {
        return (
          <HeaderCell
            key={cellProps.key}
            property={property}
            style={cellProps.style}
            onSortClick={onSortClick}
            onWidthChanged={onWidthChanged}
            sorting={this.props.sorting}
          />
        );
      };
    });
  }
}

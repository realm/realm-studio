import * as React from 'react';
import {
  Grid,
  GridCellProps,
  GridCellRenderer,
  GridProps,
  Index,
} from 'react-virtualized';

import { ISorting } from '.';
import { IPropertyWithName } from '..';
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
  columnCount: number;
}

export class HeaderGrid extends React.PureComponent<IHeaderGridProps, {}> {
  private cellRenderers: GridCellRenderer[];

  public componentWillMount() {
    this.generateRenderers(this.props);
  }

  public componentWillUpdate(nextProps: IHeaderGridProps) {
    if (this.props.properties !== nextProps.properties) {
      this.generateRenderers(nextProps);
    }
  }

  public render() {
    const { gridRef, height } = this.props;
    return (
      <Grid
        /* TODO: Omit the props that are irrellevant for the grid */
        {...this.props}
        className="RealmBrowser__Table__HeaderGrid"
        rowCount={1}
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
    return this.props.columnWidths[index];
  };

  private getCellRenderer = (cellProps: GridCellProps) => {
    return this.cellRenderers[cellProps.columnIndex](cellProps);
  };

  private addColumnHeaderCell = () => {
    const { onAddColumnClick } = this.props;
    return (cellProps: GridCellProps) => (
      <div
        key={cellProps.key}
        style={cellProps.style}
        className="RealmBrowser__Table__HeaderCellControl"
        onClick={onAddColumnClick}
        title="Click for add a new column"
      >
        <i className="fa fa-plus" />
      </div>
    );
  };

  private generateRenderers(props: IHeaderGridProps) {
    const { properties } = props;

    this.cellRenderers = [
      ...properties.map((property, index) => {
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
      }),
      this.addColumnHeaderCell(),
    ];
  }
}

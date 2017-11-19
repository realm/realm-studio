import * as React from 'react';
import {
  Grid,
  GridCellProps,
  GridCellRenderer,
  GridProps,
} from 'react-virtualized';

import { ISorting } from '.';
import { IPropertyWithName } from '..';
import { HeaderCell } from './HeaderCell';

export interface IHeaderGridProps extends Partial<GridProps> {
  columnWidths: number[];
  gridRef: (ref: React.ReactNode) => void;
  height: number;
  onColumnWidthChanged: (index: number, width: number) => void;
  onSortClick: (property: IPropertyWithName) => void;
  properties: IPropertyWithName[];
  sorting?: ISorting;
  width: number;
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
    const { columnWidths, gridRef, height, properties } = this.props;

    return (
      <Grid
        /* TODO: Omit the props that are irrellevant for the grid */
        {...this.props}
        className="RealmBrowser__Table__HeaderGrid"
        rowCount={1}
        columnCount={properties.length}
        columnWidth={({ index }) => columnWidths[index]}
        cellRenderer={cellProps =>
          this.cellRenderers[cellProps.columnIndex](cellProps)}
        ref={gridRef}
        rowHeight={height}
        style={{
          // TODO: Consider if this could be moved to the CSS
          overflowX: 'hidden',
        }}
      />
    );
  }

  private generateRenderers(props: IHeaderGridProps) {
    const { properties } = props;

    this.cellRenderers = properties.map(property => {
      return (cellProps: GridCellProps) => {
        return (
          <HeaderCell
            key={cellProps.key}
            property={property}
            width={this.props.columnWidths[cellProps.columnIndex]}
            style={cellProps.style}
            onSortClick={() => this.props.onSortClick(property)}
            onWidthChanged={newWidth =>
              this.props.onColumnWidthChanged(cellProps.columnIndex, newWidth)}
            sorting={this.props.sorting}
          />
        );
      };
    });
  }
}

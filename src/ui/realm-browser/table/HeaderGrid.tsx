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
  gridRef: (ref: React.ReactNode) => void;
  height: number;
  onColumnWidthChanged: (index: number, width: number) => void;
  onSortClick: (property: IPropertyWithName) => void;
  properties: IPropertyWithName[];
  sorting?: ISorting;
  width: number;
  onAddColumnClick?: () => void;
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
    const { gridRef, height, properties } = this.props;

    return (
      <Grid
        /* TODO: Omit the props that are irrellevant for the grid */
        {...this.props}
        className="RealmBrowser__Table__HeaderGrid"
        rowCount={1}
        columnCount={properties.length}
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

  private generateRenderers(props: IHeaderGridProps) {
    const { properties, onAddColumnClick } = props;

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
            onAddColumnClick={onAddColumnClick}
          />
        );
      };
    });
  }
}

import * as React from 'react';
import {
  Grid,
  GridCellProps,
  GridCellRangeProps,
  List,
  Table,
} from 'react-virtualized';

/**
 * Default implementation of cellRangeRenderer used by Grid.
 * This renderer supports cell-caching while the user is scrolling.
 */

export interface IGridRowProps {
  children: React.ReactNode[];
  isScrolling: boolean;
  isVisible: boolean;
  key: string;
  parent: Grid | List | Table;
  rowIndex: number;
  style: React.CSSProperties;
}

export type GridRowRenderer = (props: IGridRowProps) => React.ReactNode;

export const rowCellRangeRenderer = (rowRenderer: GridRowRenderer) => ({
  cellCache,
  cellRenderer,
  columnSizeAndPositionManager,
  columnStartIndex,
  columnStopIndex,
  deferredMeasurementCache,
  horizontalOffsetAdjustment,
  isScrolling,
  parent, // Grid (or List or Table)
  rowSizeAndPositionManager,
  rowStartIndex,
  rowStopIndex,
  styleCache,
  verticalOffsetAdjustment,
  visibleColumnIndices,
  visibleRowIndices,
}: GridCellRangeProps) => {
  const renderedRows: React.ReactNode[] = [];

  // Browsers have native size limits for elements (eg Chrome 33M pixels, IE 1.5M pixes).
  // User cannot scroll beyond these size limitations.
  // In order to work around this, ScalingCellSizeAndPositionManager compresses offsets.
  // We should never cache styles for compressed offsets though as this can lead to bugs.
  // See issue #576 for more.
  const areOffsetsAdjusted =
    columnSizeAndPositionManager.areOffsetsAdjusted() ||
    rowSizeAndPositionManager.areOffsetsAdjusted();

  const canCacheStyle = !isScrolling && !areOffsetsAdjusted;

  for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
    const rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(
      rowIndex,
    );

    const renderedCells: React.ReactNode[] = [];
    const rowKey = `${rowIndex}`;

    for (
      let columnIndex = columnStartIndex;
      columnIndex <= columnStopIndex;
      columnIndex++
    ) {
      const columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(
        columnIndex,
      );
      const isCellVisible =
        columnIndex >= visibleColumnIndices.start &&
        columnIndex <= visibleColumnIndices.stop &&
        rowIndex >= visibleRowIndices.start &&
        rowIndex <= visibleRowIndices.stop;
      const cellKey = `${rowIndex}-${columnIndex}`;
      let cellStyle: React.CSSProperties;

      // Cache style objects so shallow-compare doesn't re-render unnecessarily.
      if (canCacheStyle && styleCache[cellKey]) {
        cellStyle = styleCache[cellKey];
      } else {
        // In deferred mode, cells will be initially rendered before we know their size.
        // Don't interfere with CellMeasurer's measurements by setting an invalid size.
        if (
          deferredMeasurementCache &&
          !deferredMeasurementCache.has(rowIndex, columnIndex)
        ) {
          // Position not-yet-measured cells at top/left 0,0,
          // And give them width/height of 'auto' so they can grow larger than the parent Grid if necessary.
          // Positioning them further to the right/bottom influences their measured size.
          cellStyle = {
            height: 'auto',
            left: 0,
            position: 'absolute',
            top: 0,
            width: 'auto',
          };
        } else {
          cellStyle = {
            height: rowDatum.size,
            left: columnDatum.offset + horizontalOffsetAdjustment,
            position: 'absolute',
            top: 0,
            width: columnDatum.size,
          };

          styleCache[cellKey] = cellStyle;
        }
      }

      const cellRendererParams: GridCellProps = {
        columnIndex,
        isScrolling,
        isVisible: isCellVisible,
        key: cellKey,
        parent,
        rowIndex,
        style: cellStyle,
      };

      let renderedCell: React.ReactNode;

      // Avoid re-creating cells while scrolling.
      // This can lead to the same cell being created many times and can cause performance issues for "heavy" cells.
      // If a scroll is in progress- cache and reuse cells.
      // This cache will be thrown away once scrolling completes.
      // However if we are scaling scroll positions and sizes, we should also avoid caching.
      // This is because the offset changes slightly as scroll position changes and caching leads to stale values.
      // For more info refer to issue #395
      if (
        isScrolling &&
        !horizontalOffsetAdjustment &&
        !verticalOffsetAdjustment
      ) {
        if (!cellCache[cellKey]) {
          cellCache[cellKey] = cellRenderer(cellRendererParams);
        }

        renderedCell = cellCache[cellKey];

        // If the user is no longer scrolling, don't cache cells.
        // This makes dynamic cell content difficult for users and would also lead to a heavier memory footprint.
      } else {
        renderedCell = cellRenderer(cellRendererParams);
      }

      if (renderedCell == null || renderedCell === false) {
        continue;
      }

      if (process.env.NODE_ENV !== 'production') {
        warnAboutMissingStyle(parent, renderedCell);
      }

      renderedCells.push(renderedCell);
    }

    const isRowVisible =
      rowIndex >= visibleRowIndices.start && rowIndex <= visibleRowIndices.stop;
    let rowStyle: React.CSSProperties;

    // Cache style objects so shallow-compare doesn't re-render unnecessarily.
    if (canCacheStyle && styleCache[rowKey]) {
      rowStyle = styleCache[rowKey];
    } else {
      rowStyle = {
        height: rowDatum.size,
        left: 0,
        position: 'absolute',
        right: 0,
        top: rowDatum.offset + verticalOffsetAdjustment,
      };

      styleCache[rowKey] = rowStyle;
    }

    const rowRendererParams: IGridRowProps = {
      children: renderedCells,
      isScrolling,
      isVisible: isRowVisible,
      key: rowKey,
      parent,
      rowIndex,
      style: rowStyle,
    };

    // The cache block is commented out - as caching rows when scrolling horizontally wont
    // render correctly when scrolling to new columns.
    // If re-enabled, its cache key should contain the range of column indecies that it shows.
    const renderedRow = rowRenderer(rowRendererParams);

    // Avoid re-creating cells while scrolling.
    // This can lead to the same cell being created many times and can cause performance issues for "heavy" cells.
    // If a scroll is in progress- cache and reuse cells.
    // This cache will be thrown away once scrolling completes.
    // However if we are scaling scroll positions and sizes, we should also avoid caching.
    // This is because the offset changes slightly as scroll position changes and caching leads to stale values.
    // For more info refer to issue #395

    /*
    if (
      isScrolling &&
      !horizontalOffsetAdjustment &&
      !verticalOffsetAdjustment
    ) {
      if (!cellCache[rowKey]) {
        cellCache[rowKey] = rowRenderer(rowRendererParams);
      }

      renderedRow = cellCache[rowKey];

      // If the user is no longer scrolling, don't cache cells.
      // This makes dynamic cell content difficult for users and would also lead to a heavier memory footprint.
    } else {
      renderedRow = rowRenderer(rowRendererParams);
    }
    */

    if (renderedRow == null || renderedRow === false) {
      continue;
    }

    if (process.env.NODE_ENV !== 'production') {
      warnAboutMissingStyle(parent, renderedRow);
    }

    renderedRows.push(renderedRow);
  }

  return renderedRows;
};

function warnAboutMissingStyle(parent: any, renderedCell: any) {
  if (process.env.NODE_ENV !== 'production') {
    if (renderedCell) {
      // If the direct child is a CellMeasurer, then we should check its child
      // See issue #611
      if (renderedCell.type && renderedCell.type.__internalCellMeasurerFlag) {
        renderedCell = renderedCell.props.children;
      }

      if (
        renderedCell &&
        renderedCell.props &&
        renderedCell.props.style === undefined &&
        parent.__warnedAboutMissingStyle !== true
      ) {
        parent.__warnedAboutMissingStyle = true;
        // tslint:disable-next-line:no-console
        console.warn(
          'Rendered cell should include style property for positioning.',
        );
      }
    }
  }
}

import * as React from 'react';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  Column,
  Dimensions as IAutoSizerDimensions,
  List,
  ListRowRenderer,
  ScrollSync,
} from 'react-virtualized';

import {
  ILoadingProgress,
  LoadingOverlay,
} from '../../reusable/loading-overlay';

import { LogLevel } from '.';
import { Entry, ILogEntry } from './Entry';
import { LevelSelector } from './LevelSelector';

import './Log.scss';

interface IListScrollParams {
  clientHeight: number;
  scrollHeight: number;
  scrollTop: number;
}

interface ILogProps {
  cellMeasurerCache: CellMeasurerCache;
  entries: ILogEntry[];
  isLevelSelectorOpen: boolean;
  level: LogLevel;
  onLevelChanged: (level: LogLevel) => void;
  progress: ILoadingProgress;
  toggleLevelSelector: () => void;
}

export class Log extends React.Component<ILogProps, {}> {
  public render() {
    const {
      cellMeasurerCache,
      entries,
      isLevelSelectorOpen,
      level,
      onLevelChanged,
      progress,
      toggleLevelSelector,
    } = this.props;

    return (
      <div className="Log">
        <div className="Log__Table">
          <ScrollSync disableWidth={true}>
            {({ clientHeight, onScroll, scrollTop, scrollHeight }) => {
              // Measure the distance from the bottom scroll - initially 0.
              const scrollBottom = scrollHeight - (scrollTop + clientHeight);
              // If we're close to the bottom - stick to the bottom when new entries arrive
              const scrollToIndex =
                scrollBottom < 10 ? entries.length - 1 : undefined;
              return (
                <AutoSizer>
                  {({ width, height }: IAutoSizerDimensions) => (
                    <List
                      width={width}
                      height={height}
                      deferredMeasurementCache={cellMeasurerCache}
                      onScroll={(params: IListScrollParams) => {
                        onScroll({
                          ...params,
                          clientWidth: 0,
                          scrollLeft: 0,
                          scrollWidth: width,
                        });
                      }}
                      rowCount={entries.length}
                      rowHeight={({ index }) =>
                        cellMeasurerCache.rowHeight({ index }) || 20
                      }
                      rowRenderer={this.rowRenderer}
                      scrollToIndex={scrollToIndex}
                    />
                  )}
                </AutoSizer>
              );
            }}
          </ScrollSync>
        </div>
        <div className="Log__Controls">
          <div className="Log__Status">
            {progress.status === 'done' ? (
              <span>Showing {entries.length} entries from the server</span>
            ) : null}
          </div>
          <div className="Log__LevelSelector">
            Show levels &ge;&nbsp;
            <LevelSelector
              isDropdownOpen={isLevelSelectorOpen}
              selectedLevel={level}
              toggle={toggleLevelSelector}
              onLevelChanged={onLevelChanged}
            />
          </div>
        </div>
        <LoadingOverlay progress={progress} />
      </div>
    );
  }

  protected rowRenderer: ListRowRenderer = ({ index, key, parent, style }) => {
    const entry = this.props.entries[index] as ILogEntry;
    return (
      <CellMeasurer
        cache={this.props.cellMeasurerCache}
        columnIndex={0}
        key={key}
        rowIndex={index}
        parent={parent as any /* Types are misbehaving */}
      >
        {({ measure }) => (
          <Entry key={key} style={style} onResized={measure} {...entry} />
        )}
      </CellMeasurer>
    );
  };
}

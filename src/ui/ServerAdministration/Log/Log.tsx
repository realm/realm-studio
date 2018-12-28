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
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  Dimensions as IAutoSizerDimensions,
  List,
  ListRowRenderer,
  ScrollSync,
} from 'react-virtualized';

import {
  ILoadingProgress,
  LoadingOverlay,
} from '../../reusable/LoadingOverlay';

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

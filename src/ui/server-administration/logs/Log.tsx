import * as React from 'react';
import {
  AutoSizer,
  Column,
  Dimensions as IAutoSizerDimensions,
  List,
  ScrollSync,
} from 'react-virtualized';

import { Entry, ILogEntry } from './Entry';
import { LevelSelector, LogLevel } from './LevelSelector';

import './Log.scss';

export const Log = ({
  entries,
  isLevelSelectorOpen,
  level,
  onLevelChanged,
  toggleLevelSelector,
}: {
  entries: ILogEntry[];
  isLevelSelectorOpen: boolean;
  level: LogLevel;
  onLevelChanged: (level: LogLevel) => void;
  toggleLevelSelector: () => void;
}) => {
  return (
    <div className="Log">
      <div className="Log__Table">
        <ScrollSync>
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
                    onScroll={onScroll}
                    rowCount={entries.length}
                    rowHeight={20}
                    rowRenderer={({ key, style, index, isScrolling }) => {
                      const entry = entries[index] as ILogEntry;
                      return <Entry key={key} style={style} {...entry} />;
                    }}
                    scrollToIndex={scrollToIndex}
                  />
                )}
              </AutoSizer>
            );
          }}
        </ScrollSync>
      </div>
      <div className="Log__Controls">
        <div className="Log__Status">Showing {entries.length} log entries</div>
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
    </div>
  );
};

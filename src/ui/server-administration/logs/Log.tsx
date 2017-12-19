import * as React from 'react';
import {
  AutoSizer,
  Column,
  Dimensions as IAutoSizerDimensions,
  List,
  ScrollSync,
} from 'react-virtualized';

import {
  ILoadingProgress,
  LoadingOverlay,
} from '../../reusable/loading-overlay';

import { Entry, ILogEntry } from './Entry';
import { LevelSelector, LogLevel } from './LevelSelector';

import './Log.scss';

export const Log = ({
  entries,
  isLevelSelectorOpen,
  level,
  onLevelChanged,
  toggleLevelSelector,
  progress,
}: {
  entries: ILogEntry[];
  isLevelSelectorOpen: boolean;
  level: LogLevel;
  onLevelChanged: (level: LogLevel) => void;
  toggleLevelSelector: () => void;
  progress: ILoadingProgress;
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
};

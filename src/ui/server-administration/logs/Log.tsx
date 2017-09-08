import * as React from "react";
import { AutoSizer, Column, Dimensions as IAutoSizerDimensions, Table } from "react-virtualized";

import { Entry, ILogEntry } from "./Entry";
import { LevelSelector, LogLevel } from "./LevelSelector";

import "./Log.scss";

export const Log = ({
  entries,
  isLevelSelectorOpen,
  level,
  onLevelChanged,
  toggleLevelSelector,
}: {
  entries: ILogEntry[],
  isLevelSelectorOpen: boolean,
  level: LogLevel,
  onLevelChanged: (level: LogLevel) => void,
  toggleLevelSelector: () => void,
}) => {
  return (
    <div className="Log">
      <div className="Log__Table">
        <AutoSizer>
        {({width, height}: IAutoSizerDimensions) => (
          <Table width={width} height={height}
            rowHeight={20} headerHeight={0} disableHeader
            rowCount={entries.length}
            rowGetter={({ index }) => entries[index]}>
            <Column className="Log__EntryCell" dataKey="null" flexGrow={1} width={width}
              cellRenderer={({ rowData }) => {
                const entry = rowData as ILogEntry;
                return <Entry {...entry} />;
              }} />
          </Table>
        )}
        </AutoSizer>
      </div>
      <div className="Log__Controls">
        <div className="Log__Status">
          Showing {entries.length} log entries
        </div>
        <div className="Log__LevelSelector">
          Show levels &ge;&nbsp;
          <LevelSelector
            isDropdownOpen={isLevelSelectorOpen} selectedLevel={level}
            toggle={toggleLevelSelector} onLevelChanged={onLevelChanged} />
        </div>
      </div>
    </div>
  );
};

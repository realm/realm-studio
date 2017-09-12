import * as classnames from "classnames";
import * as React from "react";
import { AutoSizer, Column, Dimensions as IAutoSizerDimensions, Table } from "react-virtualized";

import { IRealmFile } from "../../../services/ros";

import "./RealmsTable.scss";

export const RealmsTable = ({
  realmCount,
  getRealm,
  getRealmFromId,
  onRealmDeleted,
  onRealmOpened,
  onRealmSelected,
  selectedRealmPath,
}: {
  realmCount: number,
  getRealm: (index: number) => IRealmFile | null,
  getRealmFromId: (path: string) => IRealmFile | null,
  onRealmDeleted: (path: string) => void,
  onRealmOpened: (path: string) => void,
  onRealmSelected: (path: string | null) => void,
  selectedRealmPath: string | null,
}) => {
  return (
    <div className="RealmsTable">
      <div className="RealmsTable__table">
        <AutoSizer>
        {({width, height}: IAutoSizerDimensions) => (
          <Table width={width} height={height}
            rowHeight={30} headerHeight={30}
            rowClassName={({ index }) => {
              const realm = getRealm(index);
              return classnames("RealmsTable__row", {
                "RealmsTable__selected-row": realm && realm.path === selectedRealmPath,
              });
            }}
            rowCount={realmCount}
            rowGetter={({ index }) => getRealm(index)}
            onRowClick={({event, index}) => {
              const realm = getRealm(index);
              onRealmSelected(realm && realm.path !== selectedRealmPath ? realm.path : null);
              event.preventDefault();
            }}
            onRowDoubleClick={({event, index}) => {
              const realm = getRealm(index);
              if (realm) {
                onRealmOpened(realm.path);
              }
            }}>
            <Column label="Path" dataKey="path" width={width} />
          </Table>
        )}
        </AutoSizer>
      </div>
    </div>
  );
};

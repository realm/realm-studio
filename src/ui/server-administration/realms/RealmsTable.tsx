import * as classnames from 'classnames';
import * as React from 'react';
import {
  AutoSizer,
  Column,
  Dimensions as IAutoSizerDimensions,
  Table,
} from 'react-virtualized';

import { IRealmFile } from '../../../services/ros';
import {
  ILoadingProgress,
  LoadingOverlay,
} from '../../reusable/loading-overlay';
import { RealmSidebar } from './RealmSidebar';

import './RealmsTable.scss';

export const RealmsTable = ({
  getRealm,
  getRealmFromId,
  onRealmDeletion,
  onRealmOpened,
  onRealmSelected,
  progress,
  realmCount,
  selectedRealmPath,
}: {
  getRealm: (index: number) => IRealmFile | null;
  getRealmFromId: (path: string) => IRealmFile | null;
  onRealmDeletion: (path: string) => void;
  onRealmOpened: (path: string) => void;
  onRealmSelected: (path: string | null) => void;
  progress: ILoadingProgress;
  realmCount: number;
  selectedRealmPath: string | null;
}) => {
  return (
    <div className="RealmsTable">
      <div
        className="RealmsTable__table"
        onClick={event => {
          onRealmSelected(null);
        }}
      >
        <AutoSizer>
          {({ width, height }: IAutoSizerDimensions) => (
            <Table
              width={width}
              height={height}
              rowHeight={30}
              headerHeight={30}
              rowClassName={({ index }) => {
                const realm = getRealm(index);
                return classnames('RealmsTable__row', {
                  'RealmsTable__row--selected':
                    realm && realm.path === selectedRealmPath,
                });
              }}
              rowCount={realmCount}
              rowGetter={({ index }) => getRealm(index)}
              onRowClick={({ event, index }) => {
                const realm = getRealm(index);
                onRealmSelected(
                  realm && realm.path !== selectedRealmPath ? realm.path : null,
                );
                event.stopPropagation();
              }}
              onRowDoubleClick={({ event, index }) => {
                const realm = getRealm(index);
                if (realm) {
                  onRealmOpened(realm.path);
                }
                event.stopPropagation();
              }}
            >
              <Column label="Path" dataKey="path" width={width} />
            </Table>
          )}
        </AutoSizer>
      </div>

      <RealmSidebar
        isOpen={selectedRealmPath !== null}
        realm={
          selectedRealmPath !== null ? getRealmFromId(selectedRealmPath) : null
        }
        onRealmDeletion={onRealmDeletion}
      />

      <LoadingOverlay progress={progress} fade={true} />
    </div>
  );
};

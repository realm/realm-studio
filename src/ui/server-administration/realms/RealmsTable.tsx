import * as classnames from 'classnames';
import * as React from 'react';
import {
  AutoSizer,
  Column,
  Dimensions as IAutoSizerDimensions,
  Table,
} from 'react-virtualized';
import { Button } from 'reactstrap';

import { IRealmFile } from '../../../services/ros';
import {
  ILoadingProgress,
  LoadingOverlay,
} from '../../reusable/loading-overlay';
import { FloatingControls } from '../shared/FloatingControls';
import { CreateRealmDialogContainer } from './CreateRealmDialogContainer';
import { RealmSidebar } from './RealmSidebar';
import './RealmsTable.scss';

export const RealmsTable = ({
  getRealm,
  getRealmFromId,
  onRealmDeletion,
  onRealmOpened,
  onRealmSelected,
  onRealmCreated,
  progress,
  realmCount,
  selectedRealmPath,
  isCreateRealmOpen,
  toggleCreateRealm,
}: {
  getRealm: (index: number) => IRealmFile | null;
  getRealmFromId: (path: string) => IRealmFile | null;
  onRealmDeletion: (path: string) => void;
  onRealmOpened: (path: string) => void;
  onRealmCreated: (path: string) => void;
  onRealmSelected: (path: string | null) => void;
  progress: ILoadingProgress;
  realmCount: number;
  selectedRealmPath: string | null;
  isCreateRealmOpen: boolean;
  toggleCreateRealm: () => void;
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

      <FloatingControls isOpen={selectedRealmPath === null}>
        <Button onClick={toggleCreateRealm}>Create new realm</Button>
      </FloatingControls>

      <CreateRealmDialogContainer
        isOpen={isCreateRealmOpen}
        toggle={toggleCreateRealm}
        onRealmCreated={onRealmCreated}
      />

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

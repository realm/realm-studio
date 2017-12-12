import * as classnames from 'classnames';
import * as React from 'react';
import {
  AutoSizer,
  Column,
  Dimensions as IAutoSizerDimensions,
  Table,
} from 'react-virtualized';
import { Button } from 'reactstrap';

import { IPermission, IRealmFile } from '../../../services/ros';
import {
  ILoadingProgress,
  LoadingOverlay,
} from '../../reusable/loading-overlay';
import { FloatingControls } from '../shared/FloatingControls';

import { CreateRealmDialog } from './CreateRealmDialog';
import { DraggingFileOverlay } from './DraggingFileOverlay';
import { RealmSidebar } from './RealmSidebar';
import { UploadRealmDialog } from './UploadRealmDialog';

import './RealmsTable.scss';

export const RealmsTable = ({
  getRealm,
  getRealmFromId,
  getRealmPermissions,
  isCreateRealmOpen,
  isDraggingFile,
  isUploadRealmOpen,
  onDragLeave,
  onDragOver,
  onDrop,
  onRealmCreate,
  onRealmDeletion,
  onRealmOpened,
  onRealmSelected,
  onRealmUpload,
  progress,
  realmCount,
  selectedRealmPath,
  toggleCreateRealm,
  toggleUploadRealm,
}: {
  getRealm: (index: number) => IRealmFile | null;
  getRealmFromId: (path: string) => IRealmFile | null;
  getRealmPermissions: (path: string) => Realm.Results<IPermission>;
  isCreateRealmOpen: boolean;
  isDraggingFile: boolean;
  isUploadRealmOpen: boolean;
  onDragLeave: React.DragEventHandler<any>;
  onDragOver: React.DragEventHandler<any>;
  onDrop: React.DragEventHandler<any>;
  onRealmCreate: (path: string) => void;
  onRealmDeletion: (path: string) => void;
  onRealmOpened: (path: string) => void;
  onRealmSelected: (path: string | null) => void;
  onRealmUpload: (localPath: string, serverPath: string) => void;
  progress: ILoadingProgress;
  realmCount: number;
  selectedRealmPath: string | null;
  toggleCreateRealm: () => void;
  toggleUploadRealm: () => void;
}) => {
  return (
    <div className="RealmsTable">
      <div
        className="RealmsTable__table"
        onClick={event => {
          onRealmSelected(null);
        }}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
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
                event.stopPropagation();
                const realm = getRealm(index);
                onRealmSelected(
                  realm && realm.path !== selectedRealmPath ? realm.path : null,
                );
              }}
              onRowDoubleClick={({ event, index }) => {
                event.stopPropagation();
                const realm = getRealm(index);
                if (realm) {
                  onRealmOpened(realm.path);
                }
              }}
            >
              <Column label="Path" dataKey="path" width={width} />
            </Table>
          )}
        </AutoSizer>
      </div>

      <FloatingControls isOpen={selectedRealmPath === null}>
        <Button onClick={toggleUploadRealm}>Upload Realm</Button>
        <Button onClick={toggleCreateRealm}>Create new Realm</Button>
      </FloatingControls>

      <CreateRealmDialog
        isOpen={isCreateRealmOpen}
        toggle={toggleCreateRealm}
        onRealmCreated={onRealmCreate}
      />

      <UploadRealmDialog
        isOpen={isUploadRealmOpen}
        toggle={toggleUploadRealm}
        onRealmUpload={onRealmUpload}
      />

      <RealmSidebar
        isOpen={selectedRealmPath !== null}
        getRealmPermissions={getRealmPermissions}
        onRealmDeletion={onRealmDeletion}
        onRealmOpened={onRealmOpened}
        realm={
          selectedRealmPath !== null ? getRealmFromId(selectedRealmPath) : null
        }
      />

      {isDraggingFile ? <DraggingFileOverlay /> : null}

      <LoadingOverlay progress={progress} fade={true} />
    </div>
  );
};

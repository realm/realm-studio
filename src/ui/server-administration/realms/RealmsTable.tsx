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
import { QuerySearch } from '../../reusable/QuerySearch';
import { FloatingControls } from '../shared/FloatingControls';
import '../shared/Table/Table.scss';
import { displayUser } from '../utils';
import { CreateRealmDialogContainer } from './CreateRealmDialogContainer';
import { RealmSidebar } from './RealmSidebar';

export const RealmsTable = ({
  getRealmFromId,
  getRealmPermissions,
  isCreateRealmOpen,
  onRealmCreated,
  onRealmDeletion,
  onRealmOpened,
  onRealmSelected,
  realms,
  selectedRealmPath,
  toggleCreateRealm,
  query,
  onQueryChange,
}: {
  getRealmFromId: (path: string) => IRealmFile | null;
  getRealmPermissions: (path: string) => Realm.Results<IPermission>;
  isCreateRealmOpen: boolean;
  onRealmCreated: (path: string) => void;
  onRealmDeletion: (path: string) => void;
  onRealmOpened: (path: string) => void;
  onRealmSelected: (path: string | null) => void;
  realms: Realm.Results<IRealmFile>;
  selectedRealmPath: string | null;
  toggleCreateRealm: () => void;
  query: string;
  onQueryChange: (query: string) => void;
}) => {
  return (
    <div className="Table">
      <div className="Table__content">
        <div className="Table__topbar">
          <QuerySearch
            query={query}
            onQueryChange={onQueryChange}
            placeholder="Search realms"
          />
        </div>
        <div
          className="Table__table"
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
                  const realm = realms[index];
                  return classnames('Table__row', {
                    'Table__row--selected':
                      realm && realm.path === selectedRealmPath,
                  });
                }}
                rowCount={realms.length}
                rowGetter={({ index }) => realms[index]}
                onRowClick={({ event, index }) => {
                  event.stopPropagation();
                  const realm = realms[index];
                  onRealmSelected(
                    realm && realm.path !== selectedRealmPath
                      ? realm.path
                      : null,
                  );
                }}
                onRowDoubleClick={({ event, index }) => {
                  event.stopPropagation();
                  const realm = realms[index];
                  if (realm) {
                    onRealmOpened(realm.path);
                  }
                }}
              >
                <Column label="Path" dataKey="path" width={width} />
                <Column
                  label="Owner"
                  dataKey="owner"
                  width={width}
                  cellRenderer={({ cellData }) => displayUser(cellData)}
                />
              </Table>
            )}
          </AutoSizer>
        </div>
      </div>

      <FloatingControls isOpen={selectedRealmPath === null}>
        <Button onClick={toggleCreateRealm}>Create new Realm</Button>
      </FloatingControls>

      <CreateRealmDialogContainer
        isOpen={isCreateRealmOpen}
        toggle={toggleCreateRealm}
        onRealmCreated={onRealmCreated}
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
    </div>
  );
};

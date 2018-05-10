import * as React from 'react';
import { Column } from 'react-virtualized';
import { Button } from 'reactstrap';

import { IPermission, IRealmFile, RealmType } from '../../../services/ros';
import {
  FilterableTable,
  FilterableTableWrapper,
} from '../shared/FilterableTable';
import { FloatingControls } from '../shared/FloatingControls';
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
  onRealmTypeUpgrade,
  realms,
  selectedRealmPath,
  toggleCreateRealm,
  searchString,
  onSearchStringChange,
}: {
  getRealmFromId: (path: string) => IRealmFile | undefined;
  getRealmPermissions: (path: string) => Realm.Results<IPermission>;
  isCreateRealmOpen: boolean;
  onRealmCreated: (path: string) => void;
  onRealmDeletion: (path: string) => void;
  onRealmOpened: (path: string) => void;
  onRealmSelected: (path: string | null) => void;
  onRealmTypeUpgrade: (path: string) => void;
  realms: Realm.Results<IRealmFile>;
  selectedRealmPath: string | null;
  toggleCreateRealm: () => void;
  searchString: string;
  onSearchStringChange: (query: string) => void;
}) => {
  return (
    <FilterableTableWrapper>
      <FilterableTable
        elementIdProperty="path"
        elements={realms}
        onElementDoubleClick={onRealmOpened}
        onElementSelected={onRealmSelected}
        onSearchStringChange={onSearchStringChange}
        searchPlaceholder="Search Realms"
        searchString={searchString}
        selectedIdPropertyValue={selectedRealmPath}
      >
        <Column label="Path" dataKey="path" width={500} />
        <Column
          label="Owner"
          dataKey="owner"
          width={300}
          cellRenderer={({ cellData }) => displayUser(cellData)}
        />
        <Column
          label="Type"
          dataKey="realmType"
          width={200}
          cellRenderer={({ cellData }) => cellData || 'full'}
        />
      </FilterableTable>

      <FloatingControls isOpen={selectedRealmPath === null}>
        <Button onClick={toggleCreateRealm}>Create new Realm</Button>
      </FloatingControls>

      <CreateRealmDialogContainer
        isOpen={isCreateRealmOpen}
        toggle={toggleCreateRealm}
        onRealmCreated={onRealmCreated}
      />

      <RealmSidebar
        getRealmPermissions={getRealmPermissions}
        isOpen={selectedRealmPath !== null}
        onRealmDeletion={onRealmDeletion}
        onRealmOpened={onRealmOpened}
        onRealmTypeUpgrade={onRealmTypeUpgrade}
        onToggle={() => onRealmSelected(null)}
        realm={
          selectedRealmPath !== null
            ? getRealmFromId(selectedRealmPath)
            : undefined
        }
      />
    </FilterableTableWrapper>
  );
};

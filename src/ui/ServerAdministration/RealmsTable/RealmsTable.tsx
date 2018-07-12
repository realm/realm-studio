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
import { Column } from 'react-virtualized';
import { Button } from 'reactstrap';

import { IPermission, IRealmFile } from '../../../services/ros';
import {
  FilterableTable,
  FilterableTableWrapper,
} from '../shared/FilterableTable';
import { FloatingControls } from '../shared/FloatingControls';
import { displayUser, prettyBytes } from '../utils';

import { MissingSizeBadge } from './MissingSizeBadge';
import { RealmSidebar } from './RealmSidebar';

export const RealmsTable = ({
  getRealmFromId,
  getRealmPermissions,
  getRealmStateSize,
  onRealmDeletion,
  onRealmOpened,
  onRealmSelected,
  onRealmTypeUpgrade,
  realms,
  realmStateSizes,
  selectedRealmPath,
  onRealmCreation,
  searchString,
  onSearchStringChange,
}: {
  getRealmFromId: (path: string) => IRealmFile | undefined;
  getRealmPermissions: (path: string) => Realm.Results<IPermission>;
  getRealmStateSize: (path: string) => number | undefined;
  onRealmDeletion: (path: string) => void;
  onRealmOpened: (path: string) => void;
  onRealmSelected: (path: string | null) => void;
  onRealmTypeUpgrade: (path: string) => void;
  realms: Realm.Results<IRealmFile>;
  realmStateSizes?: { [path: string]: number };
  selectedRealmPath: string | null;
  onRealmCreation: () => void;
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
          width={200}
          cellRenderer={({ cellData }) => displayUser(cellData)}
        />
        <Column
          label="Type"
          dataKey="realmType"
          width={100}
          cellRenderer={({ cellData }) => cellData || 'full'}
        />
        <Column
          label="Data Size"
          dataKey="path"
          /* Don't show the size column if all sizes are unknown */
          width={realmStateSizes ? 100 : 0}
          cellRenderer={({ cellData }) =>
            realmStateSizes && typeof realmStateSizes[cellData] === 'number' ? (
              prettyBytes(realmStateSizes[cellData])
            ) : (
              <MissingSizeBadge />
            )
          }
        />
      </FilterableTable>

      <FloatingControls isOpen={selectedRealmPath === null}>
        <Button onClick={onRealmCreation}>Create new Realm</Button>
      </FloatingControls>

      <RealmSidebar
        getRealmPermissions={getRealmPermissions}
        getRealmStateSize={getRealmStateSize}
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

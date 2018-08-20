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

import { IPermission } from '../../../services/ros';
import {
  FilterableTable,
  FilterableTableWrapper,
  IFilterableTableProps,
} from '../shared/FilterableTable';
import { FloatingControls } from '../shared/FloatingControls';
import { displayUser, prettyBytes } from '../utils';

import { IDeletionProgress, RealmFile } from '.';
import { MissingSizeBadge } from './MissingSizeBadge';
import { RealmSidebar } from './RealmSidebar';
import { StateSizeHeader } from './StateSizeHeader';

const FilterableRealmTable: React.ComponentType<
  IFilterableTableProps<RealmFile>
> = FilterableTable;

export const RealmsTable = ({
  deletionProgress,
  getRealmPermissions,
  getRealmStateSize,
  onRealmClick,
  onRealmCreation,
  onRealmDeletion,
  onRealmOpened,
  onRealmsDeselection,
  onRealmTypeUpgrade,
  onSearchStringChange,
  realms,
  realmStateSizes,
  searchString,
  selectedRealms,
}: {
  deletionProgress?: IDeletionProgress;
  getRealmPermissions: (realm: RealmFile) => Realm.Results<IPermission>;
  getRealmStateSize: (realm: RealmFile) => number | undefined;
  onRealmClick: (e: React.MouseEvent<HTMLElement>, realm: RealmFile) => void;
  onRealmCreation: () => void;
  onRealmDeletion: (...realms: RealmFile[]) => void;
  onRealmOpened: (realm: RealmFile, usingGrahpiql?: boolean) => void;
  onRealmsDeselection: () => void;
  onRealmTypeUpgrade: (realm: RealmFile) => void;
  onSearchStringChange: (query: string) => void;
  realms: Realm.Results<RealmFile>;
  realmStateSizes?: { [path: string]: number };
  searchString: string;
  selectedRealms: RealmFile[];
}) => {
  return (
    <FilterableTableWrapper>
      <FilterableRealmTable
        elements={realms}
        onElementClick={onRealmClick}
        onElementDoubleClick={onRealmOpened}
        onElementsDeselection={onRealmsDeselection}
        onSearchStringChange={onSearchStringChange}
        searchPlaceholder="Search Realms"
        searchString={searchString}
        selectedElements={selectedRealms}
        isElementsEqual={(a, b) => a.path === b.path}
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
          headerRenderer={props => <StateSizeHeader {...props} />}
          cellRenderer={({ cellData }) =>
            realmStateSizes && typeof realmStateSizes[cellData] === 'number' ? (
              prettyBytes(realmStateSizes[cellData])
            ) : (
              <MissingSizeBadge />
            )
          }
        />
      </FilterableRealmTable>

      <FloatingControls isOpen={selectedRealms.length === 0}>
        <Button onClick={onRealmCreation}>Create new Realm</Button>
      </FloatingControls>

      <RealmSidebar
        deletionProgress={deletionProgress}
        getRealmPermissions={getRealmPermissions}
        getRealmStateSize={getRealmStateSize}
        isOpen={selectedRealms.length > 0}
        onRealmDeletion={onRealmDeletion}
        onRealmOpened={onRealmOpened}
        onRealmTypeUpgrade={onRealmTypeUpgrade}
        onToggle={() => onRealmsDeselection()}
        realms={selectedRealms}
      />
    </FilterableTableWrapper>
  );
};

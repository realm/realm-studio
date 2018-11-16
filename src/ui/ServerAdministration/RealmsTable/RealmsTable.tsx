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

import { IPermission, IRealmSizeInfo } from '../../../services/ros';
import {
  FilterableTable,
  IFilterableTableProps,
} from '../shared/FilterableTable';
import { FloatingControls } from '../shared/FloatingControls';
import { displayUser, prettyBytes } from '../utils';

import { IDeletionProgress, RealmFile } from '.';
import { MissingSizeBadge } from './MissingSizeBadge';
import { RealmSidebar } from './RealmSidebar';
import { StateSizeHeader } from './StateSizeHeader';

import './RealmsTable.scss';

const FilterableRealmTable: React.ComponentType<
  IFilterableTableProps<RealmFile>
> = FilterableTable;

export const RealmsTable = ({
  deletionProgress,
  getRealmPermissions,
  getRealmSize,
  onRealmClick,
  onRealmCreation,
  onRealmDeletion,
  onRealmOpened,
  onRealmsDeselection,
  onRealmTypeUpgrade,
  onSearchStringChange,
  realms,
  realmSizes,
  searchString,
  selectedRealms,
  onRealmSizeRecalculate,
  shouldShowRealmSize,
}: {
  deletionProgress?: IDeletionProgress;
  getRealmPermissions: (realm: RealmFile) => Realm.Results<IPermission>;
  getRealmSize: (realm: RealmFile) => IRealmSizeInfo | undefined;
  onRealmClick: (e: React.MouseEvent<HTMLElement>, realm: RealmFile) => void;
  onRealmCreation: () => void;
  onRealmDeletion: (...realms: RealmFile[]) => void;
  onRealmOpened: (realm: RealmFile) => void;
  onRealmsDeselection: () => void;
  onRealmTypeUpgrade: (realm: RealmFile) => void;
  onSearchStringChange: (query: string) => void;
  realms: Realm.Results<RealmFile>;
  realmSizes?: { [path: string]: IRealmSizeInfo };
  searchString: string;
  selectedRealms: RealmFile[];
  onRealmSizeRecalculate: (realm: RealmFile) => void;
  shouldShowRealmSize: boolean;
}) => {
  return (
    <div className="RealmsTable">
      <FilterableRealmTable
        className="RealmsTable__Table"
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
          width={shouldShowRealmSize ? 100 : 0}
          headerRenderer={props => <StateSizeHeader {...props} />}
          cellRenderer={({ cellData }) =>
            renderRealmSize(cellData, 'stateSize', realmSizes)
          }
        />
        <Column
          label="File Size"
          dataKey="path"
          width={shouldShowRealmSize ? 100 : 0}
          headerRenderer={props => <StateSizeHeader {...props} />}
          cellRenderer={({ cellData }) =>
            renderRealmSize(cellData, 'fileSize', realmSizes)
          }
        />
      </FilterableRealmTable>

      <FloatingControls isOpen={selectedRealms.length === 0}>
        <Button onClick={onRealmCreation}>Create new Realm</Button>
      </FloatingControls>

      <RealmSidebar
        deletionProgress={deletionProgress}
        getRealmPermissions={getRealmPermissions}
        getRealmSize={getRealmSize}
        isOpen={selectedRealms.length > 0}
        onRealmDeletion={onRealmDeletion}
        onRealmOpened={onRealmOpened}
        onRealmTypeUpgrade={onRealmTypeUpgrade}
        onClose={onRealmsDeselection}
        realms={selectedRealms}
        onRealmSizeRecalculate={onRealmSizeRecalculate}
        shouldShowRealmSize={shouldShowRealmSize}
      />
    </div>
  );
};

const renderRealmSize = (
  path: string,
  valueName: keyof IRealmSizeInfo,
  realmSizes?: { [path: string]: IRealmSizeInfo },
) => {
  if (realmSizes) {
    const realmSize = realmSizes[path];
    if (realmSize) {
      const value = realmSize[valueName];
      if (typeof value === 'number') {
        return prettyBytes(value);
      }
    }
  }

  return <MissingSizeBadge />;
};

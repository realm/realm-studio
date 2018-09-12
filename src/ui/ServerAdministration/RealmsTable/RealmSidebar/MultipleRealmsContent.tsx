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
import { Button, Progress } from 'reactstrap';

import { IDeletionProgress, RealmFile } from '..';
import { SidebarBody, SidebarControls, SidebarTitle } from '../../../reusable';

interface IMultipleRealmsContentProps {
  deletionProgress?: IDeletionProgress;
  onRealmDeletion: (...realms: RealmFile[]) => void;
  realms: RealmFile[];
}

export const MultipleRealmsContent = ({
  deletionProgress,
  onRealmDeletion,
  realms,
}: IMultipleRealmsContentProps) => {
  return (
    <React.Fragment>
      <SidebarTitle>{realms.length} Realms selected</SidebarTitle>
      <SidebarBody grow={1} />
      <SidebarBody>
        {deletionProgress ? (
          <Progress
            animated={true}
            max={deletionProgress.total}
            value={deletionProgress.current}
          />
        ) : null}
      </SidebarBody>
      <SidebarControls>
        <Button
          size="sm"
          color="danger"
          disabled={!!deletionProgress}
          onClick={() => onRealmDeletion(...realms)}
        >
          Delete {realms.length} Realms
        </Button>
      </SidebarControls>
    </React.Fragment>
  );
};

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
import { Button, Card, CardBody, CardTitle, Progress } from 'reactstrap';

import { IDeletionProgress, RealmFile } from '..';

export const MultipleRealmsSidebarCard = ({
  deletionProgress,
  onRealmDeletion,
  realms,
}: {
  deletionProgress?: IDeletionProgress;
  onRealmDeletion: (...realms: RealmFile[]) => void;
  realms: RealmFile[];
}) => {
  return (
    <Card className="RealmSidebar__Card">
      <CardBody className="RealmSidebar__Top">
        <CardTitle className="RealmSidebar__Title">
          {realms.length} Realms selected
        </CardTitle>
      </CardBody>
      <CardBody className="RealmSidebar__Tables" />
      <CardBody className="RealmSidebar__Progress">
        {deletionProgress ? (
          <Progress
            animated={true}
            max={deletionProgress.total}
            value={deletionProgress.current}
          />
        ) : null}
      </CardBody>
      <CardBody className="RealmSidebar__Controls">
        <Button
          size="sm"
          color="danger"
          disabled={!!deletionProgress}
          onClick={() => onRealmDeletion(...realms)}
        >
          Delete {realms.length} Realms
        </Button>
      </CardBody>
    </Card>
  );
};

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
import { AutoSizer, List } from 'react-virtualized';

import { IUser } from '../..';

import { UserRow } from './UserRow';

interface IUserListProps {
  members: IUser[];
  editable?: boolean;
}

const rowHeight = 35;
const MAX_HEIGHT = 350;

export const UserList = ({ members, editable = true }: IUserListProps) => {
  const height = Math.min(rowHeight * members.length, MAX_HEIGHT);
  return (
    <div style={{ height }}>
      <AutoSizer>
        {({ width }) => (
          <List
            className="RoleDialog__UserList"
            height={height}
            rowHeight={35}
            headerHeight={0}
            rowCount={members.length}
            width={width}
            rowRenderer={({ index, style }) => {
              const member = members[index];
              return <UserRow key={member.id} member={member} style={style} />;
            }}
          />
        )}
      </AutoSizer>
    </div>
  );
};

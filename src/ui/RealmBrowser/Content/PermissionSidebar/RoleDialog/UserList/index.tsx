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

import React from 'react';

import { IUser } from '../..';

import { UserList } from './UserList';

interface IUserListContainerProps {
  members: IUser[];
  editable?: boolean;
}

interface IUserListContainerState {
  searchString: string;
}

class UserListContainer extends React.Component<
  IUserListContainerProps,
  IUserListContainerState
> {
  public state = {
    searchString: '',
  };

  public render() {
    const members = this.filteredMembers();
    return <UserList editable={this.props.editable} members={members} />;
  }

  private filteredMembers() {
    return this.props.members.filter(user =>
      user.id.includes(this.state.searchString),
    );
  }
}

export { UserListContainer as UserList };

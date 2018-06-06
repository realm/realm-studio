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

import { CreateRealmDialog } from './CreateRealmDialog';

export interface ICreateRealmDialogContainerProps {
  isOpen: boolean;
  onRealmCreated: (path: string) => void;
  toggle: () => void;
}

export interface ICreateRealmDialogContainerState {
  path: string;
}

class CreateRealmDialogContainer extends React.Component<
  ICreateRealmDialogContainerProps,
  ICreateRealmDialogContainerState
> {
  public state: ICreateRealmDialogContainerState = {
    path: '',
  };

  public render() {
    return <CreateRealmDialog {...this.props} {...this.state} {...this} />;
  }

  public onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { path } = this.state;
    // Await the realm being created
    await this.props.onRealmCreated(path);
    // Reset the state
    this.setState({
      path: '',
    });
    // And hide the dialog
    this.props.toggle();
  };

  public onPathChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      path: e.target.value,
    });
  };
}

export { CreateRealmDialogContainer as CreateRealmDialog };

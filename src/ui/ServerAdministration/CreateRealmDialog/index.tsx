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

import { CreateRealmDialog } from './CreateRealmDialog';

export interface ICreateRealmDialogContainerProps {
  isBusy: boolean;
  isOpen: boolean;
  onRealmCreation: (path: string) => void;
  onCancelRealmCreation: () => void;
}

export interface ICreateRealmDialogContainerState {
  path: string;
}

class CreateRealmDialogContainer extends React.Component<
  ICreateRealmDialogContainerProps,
  ICreateRealmDialogContainerState
> {
  public state: ICreateRealmDialogContainerState = { path: '' };

  public componentDidUpdate(prevProps: ICreateRealmDialogContainerProps) {
    // Reset the path when the dialog opens
    if (this.props.isOpen && !prevProps.isOpen) {
      this.setState({ path: '' });
    }
  }

  public render() {
    return <CreateRealmDialog {...this.props} {...this.state} {...this} />;
  }

  public onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { path } = this.state;
    // Await the realm being created
    this.props.onRealmCreation(path);
  };

  public onPathChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      path: e.target.value,
    });
  };
}

export { CreateRealmDialogContainer as CreateRealmDialog };

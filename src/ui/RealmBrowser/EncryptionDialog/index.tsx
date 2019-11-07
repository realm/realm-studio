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

import { EncryptionDialog } from './EncryptionDialog';

export interface IEncryptionDialogContainerProps {
  onHide: () => void;
  onOpenWithEncryption: (key: string) => void;
  visible: boolean;
}

export interface IEncryptionDialogContainerState {
  key: string;
}

class EncryptionDialogContainer extends React.Component<
  IEncryptionDialogContainerProps,
  IEncryptionDialogContainerState
> {
  public render() {
    return (
      <EncryptionDialog
        onExit={this.props.onHide}
        onKeyChange={this.onKeyChange}
        onSubmit={this.onSubmit}
        visible={this.props.visible}
      />
    );
  }

  protected onKeyChange = (key: string) => {
    this.setState({ key });
  };

  protected onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault();
    this.props.onHide();
    this.props.onOpenWithEncryption(this.state.key);
  };
}

export { EncryptionDialogContainer as EncryptionDialog };

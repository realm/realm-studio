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

import { IRole } from '..';

import { IRoleDialogProps, RoleDialog } from './RoleDialog';

interface IRoleDialogContainerBaseProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IRoleDialogContainerOpenedProps
  extends IRoleDialogContainerBaseProps {
  isOpen: true;
  role: IRole;
}

interface IRoleDialogContainerClosedProps
  extends IRoleDialogContainerBaseProps {
  isOpen: false;
}

type IRoleDialogContainerProps =
  | IRoleDialogContainerOpenedProps
  | IRoleDialogContainerClosedProps;

class RoleDialogContainer extends React.Component<
  IRoleDialogContainerProps,
  {}
> {
  public render() {
    const props = this.getProps();
    return <RoleDialog {...props} />;
  }

  private getProps(): IRoleDialogProps {
    if (this.props.isOpen) {
      return {
        isOpen: true,
        role: this.props.role,
        onClose: this.props.onClose,
      };
    } else {
      return {
        isOpen: false,
        onClose: this.props.onClose,
      };
    }
  }
}

export { RoleDialogContainer as RoleDialog };

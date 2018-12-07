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
import * as Realm from 'realm';

import { IPropertyWithName } from '../..';
import { Focus } from '../../focus';
import { IHighlight } from '../Table';

import { ClassPermissionSidebar } from './ClassPermissionSidebar';
import { ObjectPermissionSidebar } from './ObjectPermissionSidebar';
import { RoleDialog } from './RoleDialog';

import { Action, IPermission, IRole, Permissions } from './models';
export * from './models';

interface IRoleDialog {
  isOpen: true;
  role: IRole;
}

interface IPermissionSidebarContainerProps {
  className?: string;
  isOpen: boolean;
  onToggle?: () => void;
  highlight?: IHighlight;
  focus: Focus;
  // TODO: Use the Realm react context to access the Realm
  realm: Realm;
}

interface IPermissionSidebarContainerState {
  roleDialog: IRoleDialog | { isOpen: false };
}

class PermissionSidebarContainer extends React.Component<
  IPermissionSidebarContainerProps,
  IPermissionSidebarContainerState
> {
  public state: IPermissionSidebarContainerState = {
    roleDialog: { isOpen: false },
  };

  public render() {
    const isPermissionsEnabled = this.isPermissionsEnabled();
    return isPermissionsEnabled ? (
      <React.Fragment>
        <RoleDialog
          {...this.state.roleDialog}
          onClose={this.onCloseRoleDialog}
        />
        {this.renderSidebar()}
      </React.Fragment>
    ) : null;
  }

  public renderSidebar() {
    if (this.props.focus && this.props.focus.kind === 'class') {
      const classPermissions = this.getClassPermissions();
      const realmPermissions = this.getRealmPermissions();
      if (this.props.highlight) {
        const hasPermissionProperty = !!this.getPermissionsProperty();
        return (
          <ObjectPermissionSidebar
            className={this.props.className}
            classPermissions={classPermissions}
            focus={this.props.focus}
            getObjectPermissions={this.getObjectPermissions}
            hasPermissionProperty={hasPermissionProperty}
            highlight={this.props.highlight}
            isOpen={this.props.isOpen}
            onPermissionChange={this.onPermissionChange}
            onRoleClick={this.onRoleClick}
            onToggle={this.props.onToggle}
            realmPermissions={realmPermissions}
          />
        );
      } else {
        return (
          <ClassPermissionSidebar
            className={this.props.className}
            classPermissions={classPermissions}
            isOpen={this.props.isOpen}
            name={this.props.focus.className}
            onPermissionChange={this.onPermissionChange}
            onRoleClick={this.onRoleClick}
            onToggle={this.props.onToggle}
            realmPermissions={realmPermissions}
          />
        );
      }
    }
  }

  private getPermissionsProperty() {
    const { focus } = this.props;
    if (focus && focus.results.length > 0) {
      // Accessing the property from the schema on the first selected
      const firstObject: Realm.Object = focus.results[0];
      const schema = firstObject.objectSchema();
      const properties = schema.properties as {
        [key: string]: IPropertyWithName;
      };
      return Object.values(properties).find(property => {
        return (
          property.type === 'list' && property.objectType === '__Permission'
        );
      });
    }
  }

  private getObjectPermissions = (
    object: any & Realm.Object,
  ): Permissions | null => {
    const property = this.getPermissionsProperty();
    if (property && property.name && property.name in object) {
      return object[property.name];
    } else {
      return null;
    }
  };

  /**
   * Returns the collection of __Permissions for a particular class.
   * This will throw if the Realm is not opened, if it has no class named "__Class" or if that doesn't contain a value
   * for the particular class passed as argument.
   */
  private getClassPermissions(): Permissions | null {
    const { focus } = this.props;
    if (focus && focus.kind === 'class') {
      const row = this.props.realm.objectForPrimaryKey<any>(
        '__Class',
        focus.className,
      );
      if (row && row.permissions) {
        return row.permissions;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  private getRealmPermissions(): Permissions | null {
    const row = this.props.realm.objectForPrimaryKey<any>('__Realm', 0);
    if (row && row.permissions) {
      return row.permissions;
    } else {
      return null;
    }
  }

  private isPermissionsEnabled() {
    const { schema } = this.props.realm;
    const classNames = schema.map(c => c.name);
    // Does the Realm schema contain all permission classes?
    const hasPermissionClasses = [
      '__Class',
      '__Permission',
      '__Realm',
      '__Role',
      '__User',
    ].every(name => classNames.includes(name));
    // Permissions are enabled if the permission classes exists
    return hasPermissionClasses;
  }

  private onCloseRoleDialog = () => {
    this.setState({ roleDialog: { isOpen: false } });
  };

  private onPermissionChange = (
    permission: IPermission,
    action: Action,
    enabled: boolean,
  ) => {
    const { realm } = this.props;
    realm.write(() => {
      permission[action] = enabled;
    });
  };

  private onRoleClick = (role: IRole) => {
    this.setState({ roleDialog: { isOpen: true, role } });
  };
}

export { PermissionSidebarContainer as PermissionSidebar };

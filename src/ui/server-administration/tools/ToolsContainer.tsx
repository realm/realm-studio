import * as React from 'react';
import * as Realm from 'realm';

import { getAdminRealm } from '../../../services/ros';

import { Tools } from './Tools';

export class ToolsContainer extends React.Component<
  {
    user: Realm.Sync.User;
  },
  {}
> {
  public render() {
    return <Tools {...this} />;
  }

  public onGenerateMockUserAndRealms = async () => {
    throw new Error('No longer implemented ...');
  };
}

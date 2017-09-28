import * as electron from 'electron';
import * as React from 'react';
import * as Realm from 'realm';

import { showConnectToServer, showOpenLocalRealm } from '../../actions';

import { Greeting } from './Greeting';

export class GreetingContainer extends React.Component<
  {},
  {
    isSyncEnabled: boolean;
    version: string;
  }
> {
  constructor() {
    super();
    this.state = {
      isSyncEnabled: !!Realm.Sync,
      version: process.env.REALM_STUDIO_VERSION || 'unknown',
    };
  }

  public render() {
    return <Greeting {...this.state} {...this} />;
  }

  public onConnectToServer = () => {
    showConnectToServer();
  };

  public onOpenLocalRealm = () => {
    showOpenLocalRealm();
  };
}

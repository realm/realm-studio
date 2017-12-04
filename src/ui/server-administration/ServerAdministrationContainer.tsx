import * as electron from 'electron';
import * as React from 'react';
import * as Realm from 'realm';

import { main } from '../../actions/main';
import {
  IAdminTokenCredentials,
  IUsernamePasswordCredentials,
  realms,
  users,
} from '../../services/ros';
import {
  IRealmBrowserOptions,
  IServerAdministrationOptions,
} from '../../windows/WindowType';
import { showError } from '../reusable/errors';

import { ValidateCertificatesChangeHandler } from './realms/RealmsTableContainer';
import { ServerAdministration, Tab } from './ServerAdministration';

export interface IServerAdministrationContainerProps
  extends IServerAdministrationOptions {
  onValidateCertificatesChange: ValidateCertificatesChangeHandler;
}

export interface IServerAdministrationContainerState {
  activeTab: Tab;
  isRealmOpening: boolean;
  user: Realm.Sync.User | null;
}

export class ServerAdministrationContainer extends React.Component<
  IServerAdministrationContainerProps,
  IServerAdministrationContainerState
> {
  constructor() {
    super();
    this.state = {
      activeTab: Tab.Realms,
      isRealmOpening: false,
      user: null,
    };
  }

  public async componentDidMount() {
    try {
      // Authenticate towards the server
      const user = await users.authenticate(this.props.credentials);
      this.setState({
        user,
      });
    } catch (err) {
      showError('Failed when authenticating with the Realm Object Server', err);
    }
  }

  public render() {
    return (
      <ServerAdministration
        {...this.state}
        {...this}
        validateCertificates={this.props.validateCertificates}
        onValidateCertificatesChange={this.props.onValidateCertificatesChange}
      />
    );
  }

  // TODO: Once the user serializes better, this method should be moved to the ./realms/RealmsTableContainer.tsx
  public onRealmOpened = async (path: string) => {
    if (!this.state.isRealmOpening) {
      this.setState({ isRealmOpening: true });
      // Let the UI update before sync waiting on the window to appear
      const realm: realms.ISyncedRealmToLoad = {
        authentication: this.props.credentials,
        mode: realms.RealmLoadingMode.Synced,
        path,
        validateCertificates: this.props.validateCertificates,
      };
      await main.showRealmBrowser({
        realm,
      });
      this.setState({ isRealmOpening: false });
    }
  };

  public onTabChanged = (tab: Tab) => {
    this.setState({
      activeTab: tab,
    });
  };
}

import * as electron from 'electron';
import * as React from 'react';
import * as Realm from 'realm';

import { main } from '../../actions/main';
import {
  IAdminTokenCredentials,
  ISyncedRealmToLoad,
  IUsernamePasswordCredentials,
  RealmLoadingMode,
} from '../../services/ros';
import {
  IRealmBrowserOptions,
  IServerAdministrationOptions,
} from '../../windows/WindowType';
import { showError } from '../reusable/errors';

import { ServerAdministration, Tab } from './ServerAdministration';

export class ServerAdministrationContainer extends React.Component<
  IServerAdministrationOptions,
  {
    activeTab: Tab;
    isRealmOpening: boolean;
    user: Realm.Sync.User | null;
  }
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
    const serverUrl = this.props.credentials.url;
    if ('token' in this.props.credentials) {
      const credentials = this.props.credentials as IAdminTokenCredentials;
      const user = Realm.Sync.User.adminUser(credentials.token, serverUrl);
      this.setState({ user });
    } else if (
      'username' in this.props.credentials &&
      'password' in this.props.credentials
    ) {
      const credentials = this.props
        .credentials as IUsernamePasswordCredentials;
      try {
        const user = await Realm.Sync.User.login(
          serverUrl,
          credentials.username,
          credentials.password,
        );
        this.setState({ user });
      } catch (err) {
        showError(`Couldn't connect to Realm Object Server`, err, {
          'Failed to fetch': 'Could not reach the server',
        });
      }
    }
  }

  public render() {
    return <ServerAdministration {...this.state} {...this} />;
  }

  // TODO: Once the user serializes better, this method should be moved to the ./realms/RealmsTableContainer.tsx
  public onRealmOpened = async (path: string) => {
    if (!this.state.isRealmOpening) {
      this.setState({ isRealmOpening: true });
      // Let the UI update before sync waiting on the window to appear
      const realm: ISyncedRealmToLoad = {
        authentication: this.props.credentials,
        mode: RealmLoadingMode.Synced,
        path,
      };
      await main.showRealmBrowser({ realm });
      this.setState({ isRealmOpening: false });
    }
  };

  public onTabChanged = (tab: Tab) => {
    this.setState({
      activeTab: tab,
    });
  };
}

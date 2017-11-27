import * as electron from 'electron';
import * as React from 'react';

import { main } from '../../actions/main';
import * as mixpanel from '../../services/mixpanel';
import * as raas from '../../services/raas';
import { CloudAdministration } from './CloudAdministration';

const SENT_MESSAGE_STORAGE_KEY = 'sent-realm-cloud-message';

interface ICloudAdministrationContainerState {
  hasSentMessage: boolean;
  hasToken: boolean;
  message: string;
}

export class CloudAdministrationContainer extends React.Component<
  {},
  ICloudAdministrationContainerState
> {
  constructor() {
    super();
    this.state = {
      hasSentMessage: false,
      hasToken: false,
      message: '',
    };
  }

  public render() {
    return <CloudAdministration {...this.state} {...this} />;
  }

  public componentDidMount() {
    this.refreshMessageStatus();
    this.refreshTokenStatus();
  }

  public onMessageChange = (e: React.ChangeEvent<any>) => {
    this.setState({ message: e.currentTarget.value });
  };

  public onSendMessage = () => {
    // Tell mixpanel about this
    mixpanel.track('Realm Cloud signup', {
      message: this.state.message,
    });
    localStorage.setItem(SENT_MESSAGE_STORAGE_KEY, 'true');
    this.refreshMessageStatus();
  };

  public onAuthenticate = async () => {
    try {
      await main.authenticateWithGitHub();
      this.refreshTokenStatus();
    } catch (err) {
      electron.remote.dialog.showErrorBox(
        'Authentication failed',
        'Unfortunately Realm Cloud is not avalable just yet.',
      );
    }
  };

  public onLogout = () => {
    raas.user.forgetToken();
    localStorage.removeItem(SENT_MESSAGE_STORAGE_KEY);
    this.refreshTokenStatus();
    this.refreshMessageStatus();
  };

  private refreshMessageStatus() {
    const hasSentMessage =
      localStorage.getItem(SENT_MESSAGE_STORAGE_KEY) === 'true';
    this.setState({ hasSentMessage });
  }

  private refreshTokenStatus() {
    this.setState({ hasToken: raas.user.hasToken() });
  }
}
